window.KARENApp = window.KARENApp || {};

(function registerApp(app) {
const useEffect = React.useEffect;
const useMemo = React.useMemo;
const useState = React.useState;
const CaseCard = app.CaseCard;
const CaseDetailsModal = app.CaseDetailsModal;
const CaseForm = app.CaseForm;
const Filters = app.Filters;
const getSampleCases = app.getSampleCases;
const getCaseDisplayStatus = app.getCaseDisplayStatus;
const getDashboardBucket = app.getDashboardBucket;
const toISODate = app.toISODate;

const STORAGE_KEY = "karen_cases_v1";

const sectionConfig = {
  Today: {
    title: "Today",
    description: "Internal reminder is due now or has already started.",
    shell: "border-amber-200 bg-amber-50/80",
  },
  "Due Tomorrow": {
    title: "Due Tomorrow",
    description: "Cases with an internal reminder coming up tomorrow.",
    shell: "border-sky-200 bg-sky-50/80",
  },
  Upcoming: {
    title: "Upcoming",
    description: "Cases that are on track but still need future follow-up.",
    shell: "border-slate-200 bg-white/80",
  },
  Overdue: {
    title: "Overdue",
    description: "The real deadline passed and the case is not completed.",
    shell: "border-rose-200 bg-rose-50/80",
  },
  Completed: {
    title: "Completed",
    description: "Finished cases that can stay on file for reference.",
    shell: "border-emerald-200 bg-emerald-50/80",
  },
};

const emptyFilters = {
  search: "",
  insuranceCompany: "",
  status: "",
  dateFrom: "",
  dateTo: "",
};

function normalizeCase(caseItem) {
  return {
    ...caseItem,
    notes: caseItem.notes ?? "",
    history: Array.isArray(caseItem.history) ? caseItem.history : [],
  };
}

function readCases() {
  if (typeof window === "undefined") {
    return getSampleCases();
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        return parsed.map(normalizeCase);
      }
    }
  } catch {
    return getSampleCases();
  }

  return getSampleCases();
}

function buildId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildHistoryEntry(text, createdAt = new Date()) {
  const timestamp = createdAt instanceof Date ? createdAt : new Date(createdAt);

  return {
    id: buildId("history"),
    text: text.trim(),
    createdAt: timestamp.toISOString(),
  };
}

function sortCases(left, right) {
  const leftDeadline = left.manualDeadline ?? "";
  const rightDeadline = right.manualDeadline ?? "";

  if (leftDeadline !== rightDeadline) {
    return leftDeadline.localeCompare(rightDeadline);
  }

  return left.clientName.localeCompare(right.clientName);
}

function App() {
  const [cases, setCases] = useState(() => readCases());
  const [filters, setFilters] = useState(emptyFilters);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCase, setEditingCase] = useState(null);
  const [selectedCaseId, setSelectedCaseId] = useState(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
    } catch {
      return;
    }
  }, [cases]);

  const selectedCase = useMemo(
    () => cases.find((caseItem) => caseItem.id === selectedCaseId) ?? null,
    [cases, selectedCaseId],
  );

  const insuranceCompanies = useMemo(
    () =>
      [...new Set(cases.map((caseItem) => caseItem.insuranceCompany).filter(Boolean))]
        .sort((left, right) => left.localeCompare(right)),
    [cases],
  );

  const filteredCases = useMemo(() => {
    return cases
      .filter((caseItem) => {
        const searchMatch = caseItem.clientName
          .toLowerCase()
          .includes(filters.search.trim().toLowerCase());

        const companyMatch = filters.insuranceCompany
          ? caseItem.insuranceCompany === filters.insuranceCompany
          : true;

        const displayStatus = getCaseDisplayStatus(caseItem);
        const statusMatch = filters.status
          ? displayStatus === filters.status || caseItem.status === filters.status
          : true;

        const fromMatch = filters.dateFrom
          ? Boolean(caseItem.manualDeadline) && caseItem.manualDeadline >= filters.dateFrom
          : true;

        const toMatch = filters.dateTo
          ? Boolean(caseItem.manualDeadline) && caseItem.manualDeadline <= filters.dateTo
          : true;

        return searchMatch && companyMatch && statusMatch && fromMatch && toMatch;
      })
      .map((caseItem) => ({
        ...caseItem,
        displayStatus: getCaseDisplayStatus(caseItem),
        bucket: getDashboardBucket(caseItem),
      }))
      .sort(sortCases);
  }, [cases, filters]);

  const sections = useMemo(() => {
    const nextSections = {
      Today: [],
      "Due Tomorrow": [],
      Upcoming: [],
      Overdue: [],
      Completed: [],
    };

    filteredCases.forEach((caseItem) => {
      nextSections[caseItem.bucket].push(caseItem);
    });

    return nextSections;
  }, [filteredCases]);

  const summary = useMemo(
    () => ({
      total: filteredCases.length,
      today: sections.Today.length,
      overdue: sections.Overdue.length,
      completed: sections.Completed.length,
    }),
    [filteredCases.length, sections],
  );

  function closeForm() {
    setIsFormOpen(false);
    setEditingCase(null);
  }

  function openCreateForm() {
    setEditingCase(null);
    setIsFormOpen(true);
  }

  function openEditForm(caseItem) {
    setEditingCase(caseItem);
    setIsFormOpen(true);
  }

  function updateCaseInState(caseId, makeNextCase) {
    setCases((currentCases) =>
      currentCases.map((caseItem) =>
        caseItem.id === caseId ? normalizeCase(makeNextCase(caseItem)) : caseItem,
      ),
    );
  }

  function handleSaveCase(formData) {
    const now = new Date();

    if (editingCase) {
      setCases((currentCases) =>
        currentCases.map((caseItem) => {
          if (caseItem.id !== editingCase.id) {
            return caseItem;
          }

          const nextStatus = formData.status;
          const nextNotes = formData.notes.trim();
          const history = [...caseItem.history];

          if (nextStatus !== caseItem.status) {
            history.push(buildHistoryEntry(`Status updated to ${nextStatus}.`, now));
          }

          if (nextNotes !== caseItem.notes.trim()) {
            history.push(
              buildHistoryEntry(
                nextNotes ? `Notes updated: ${nextNotes}` : "Case notes cleared.",
                now,
              ),
            );
          }

          return normalizeCase({
            ...caseItem,
            ...formData,
            notes: nextNotes,
            status: nextStatus,
            dateReported:
              nextStatus === "Reported"
                ? caseItem.dateReported || toISODate(now)
                : caseItem.dateReported || "",
            lastUpdated: now.toISOString(),
            history,
          });
        }),
      );
    } else {
      const initialHistory = [buildHistoryEntry("Case created.", now)];

      if (formData.notes.trim()) {
        initialHistory.push(buildHistoryEntry(formData.notes.trim(), now));
      }

      setCases((currentCases) => [
        normalizeCase({
          ...formData,
          id: buildId("case"),
          notes: formData.notes.trim(),
          dateCreated: toISODate(now),
          lastUpdated: now.toISOString(),
          dateReported: formData.status === "Reported" ? toISODate(now) : "",
          history: initialHistory,
        }),
        ...currentCases,
      ]);
    }

    closeForm();
  }

  function handleDeleteCase(caseId) {
    const caseToDelete = cases.find((caseItem) => caseItem.id === caseId);

    if (!caseToDelete) {
      return;
    }

    const confirmed = window.confirm(
      `Delete ${caseToDelete.clientName}'s case? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setCases((currentCases) => currentCases.filter((caseItem) => caseItem.id !== caseId));

    if (selectedCaseId === caseId) {
      setSelectedCaseId(null);
    }

    if (editingCase?.id === caseId) {
      closeForm();
    }
  }

  function handleQuickStatusChange(caseId, nextStatus) {
    const now = new Date();

    updateCaseInState(caseId, (caseItem) => ({
      ...caseItem,
      status: nextStatus,
      dateReported:
        nextStatus === "Reported"
          ? caseItem.dateReported || toISODate(now)
          : caseItem.dateReported || "",
      lastUpdated: now.toISOString(),
      history: [
        ...caseItem.history,
        buildHistoryEntry(
          nextStatus === "Reported"
            ? "Case marked as Reported."
            : "Case marked as Completed.",
          now,
        ),
      ],
    }));
  }

  function handleSaveNotes(caseId, nextNotes) {
    const now = new Date();
    const cleanNotes = nextNotes.trim();

    updateCaseInState(caseId, (caseItem) => {
      if (cleanNotes === caseItem.notes.trim()) {
        return caseItem;
      }

      return {
        ...caseItem,
        notes: cleanNotes,
        lastUpdated: now.toISOString(),
        history: [
          ...caseItem.history,
          buildHistoryEntry(
            cleanNotes ? `Notes updated: ${cleanNotes}` : "Case notes cleared.",
            now,
          ),
        ],
      };
    });
  }

  function handleAddHistoryNote(caseId, note) {
    const now = new Date();
    const cleanNote = note.trim();

    if (!cleanNote) {
      return;
    }

    updateCaseInState(caseId, (caseItem) => ({
      ...caseItem,
      lastUpdated: now.toISOString(),
      history: [...caseItem.history, buildHistoryEntry(cleanNote, now)],
    }));
  }

  function handleResetData() {
    const confirmed = window.confirm(
      "Reset all data back to the original demo cases?",
    );

    if (!confirmed) {
      return;
    }

    setCases(getSampleCases());
    setFilters({ ...emptyFilters });
    setSelectedCaseId(null);
    closeForm();
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-mist text-slate-800">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-sky-100/80 via-white to-transparent" />
      <div className="pointer-events-none absolute -left-20 top-16 h-64 w-64 rounded-full bg-mint/70 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-10 h-80 w-80 rounded-full bg-blush/80 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-[32px] border border-white/80 bg-white/90 p-6 shadow-soft backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-spruce">
                KAREN
              </p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                A calm, clear intake dashboard for reporting deadlines.
              </h1>
              <p className="mt-3 text-base leading-7 text-slate-600">
                Enter the real deadline once. KAREN automatically calculates the
                internal reminder two days earlier so work can stay ahead of the
                due date.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={openCreateForm}
                className="rounded-2xl bg-ink px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                Create Case
              </button>
              <button
                type="button"
                onClick={handleResetData}
                className="rounded-2xl border border-rose-200 bg-white px-6 py-4 text-base font-semibold text-rose-600 transition hover:bg-rose-50"
              >
                Reset All Data
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <div className="rounded-[24px] bg-gradient-to-br from-sky-50 to-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Visible Cases</p>
              <p className="mt-2 text-3xl font-bold text-ink">{summary.total}</p>
            </div>
            <div className="rounded-[24px] bg-gradient-to-br from-amber-50 to-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Need Attention Today</p>
              <p className="mt-2 text-3xl font-bold text-ink">{summary.today}</p>
            </div>
            <div className="rounded-[24px] bg-gradient-to-br from-rose-50 to-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Overdue</p>
              <p className="mt-2 text-3xl font-bold text-ink">{summary.overdue}</p>
            </div>
            <div className="rounded-[24px] bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Completed</p>
              <p className="mt-2 text-3xl font-bold text-ink">{summary.completed}</p>
            </div>
          </div>
        </header>

        <div className="mt-6">
          <Filters
            filters={filters}
            insuranceCompanies={insuranceCompanies}
            onChange={(field, value) =>
              setFilters((current) => ({
                ...current,
                [field]: value,
              }))
            }
            onClear={() => setFilters({ ...emptyFilters })}
          />
        </div>

        <main className="mt-6 grid gap-6 xl:grid-cols-2">
          {Object.entries(sectionConfig).map(([key, config]) => (
            <section
              key={key}
              className={`rounded-[30px] border p-5 shadow-soft backdrop-blur ${config.shell}`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-ink">{config.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">{config.description}</p>
                </div>
                <span className="rounded-full bg-white/80 px-3 py-1 text-sm font-bold text-slate-600">
                  {sections[key].length}
                </span>
              </div>

              <div className="mt-5 space-y-4">
                {sections[key].length > 0 ? (
                  sections[key].map((caseItem) => (
                    <CaseCard
                      key={caseItem.id}
                      caseItem={caseItem}
                      displayStatus={caseItem.displayStatus}
                      bucket={caseItem.bucket}
                      onView={(item) => setSelectedCaseId(item.id)}
                      onEdit={openEditForm}
                      onDelete={handleDeleteCase}
                    />
                  ))
                ) : (
                  <div className="rounded-[28px] border border-dashed border-slate-200 bg-white/70 p-8 text-center text-sm text-slate-500">
                    No cases in this section right now.
                  </div>
                )}
              </div>
            </section>
          ))}
        </main>
      </div>

      {isFormOpen && (
        <CaseForm
          initialCase={editingCase}
          onSave={handleSaveCase}
          onCancel={closeForm}
        />
      )}

      {selectedCase && (
        <CaseDetailsModal
          caseItem={selectedCase}
          displayStatus={getCaseDisplayStatus(selectedCase)}
          onClose={() => setSelectedCaseId(null)}
          onEdit={(caseItem) => {
            setSelectedCaseId(null);
            openEditForm(caseItem);
          }}
          onDelete={handleDeleteCase}
          onQuickStatusChange={handleQuickStatusChange}
          onSaveNotes={handleSaveNotes}
          onAddHistoryNote={handleAddHistoryNote}
        />
      )}
    </div>
  );
}

app.App = App;
})(window.KARENApp);
