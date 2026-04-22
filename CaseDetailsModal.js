window.KARENApp = window.KARENApp || {};

(function registerCaseDetailsModal(app) {
  const useEffect = React.useEffect;
  const useMemo = React.useMemo;
  const useState = React.useState;
  const formatDate = app.helpers.formatDate;
  const formatDateTime = app.helpers.formatDateTime;
  const getInternalReminderDate = app.helpers.getInternalReminderDate;

  const badgeStyles = {
    New: "bg-sky-100 text-sky-700",
    "Pending Report": "bg-amber-100 text-amber-700",
    Reported: "bg-teal-100 text-teal-700",
    "Claim Opened": "bg-indigo-100 text-indigo-700",
    Completed: "bg-emerald-100 text-emerald-700",
    Overdue: "bg-rose-100 text-rose-700",
  };

  function DetailBlock(props) {
    const label = props.label;
    const value = props.value;
    const emphasis = props.emphasis;

    return (
      <div className="rounded-2xl bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          {label}
        </p>
        <p
          className={`mt-2 ${
            emphasis ? "text-lg font-bold text-ink" : "text-sm font-medium text-slate-700"
          }`}
        >
          {value}
        </p>
      </div>
    );
  }

  function CaseDetailsModal(props) {
    const caseItem = props.caseItem;
    const displayStatus = props.displayStatus;
    const onClose = props.onClose;
    const onEdit = props.onEdit;
    const onDelete = props.onDelete;
    const onQuickStatusChange = props.onQuickStatusChange;
    const onSaveNotes = props.onSaveNotes;
    const onAddHistoryNote = props.onAddHistoryNote;

    const [notesDraft, setNotesDraft] = useState(caseItem.notes || "");
    const [historyDraft, setHistoryDraft] = useState("");

    useEffect(() => {
      setNotesDraft(caseItem.notes || "");
      setHistoryDraft("");
    }, [caseItem]);

    const reminderDate = useMemo(
      () => getInternalReminderDate(caseItem.manualDeadline),
      [caseItem.manualDeadline],
    );

    const sortedHistory = useMemo(
      () =>
        [...(caseItem.history || [])].sort(
          (left, right) => new Date(right.createdAt) - new Date(left.createdAt),
        ),
      [caseItem.history],
    );

    const notesChanged = notesDraft.trim() !== (caseItem.notes || "").trim();

    function handleSaveNotes() {
      onSaveNotes(caseItem.id, notesDraft);
    }

    function handleAddHistory() {
      if (!historyDraft.trim()) {
        return;
      }

      onAddHistoryNote(caseItem.id, historyDraft);
      setHistoryDraft("");
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
        <div className="modal-card flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-float">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-white/95 px-6 py-5 backdrop-blur">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                Case Details
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold text-ink">{caseItem.clientName}</h2>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    badgeStyles[displayStatus] || badgeStyles.New
                  }`}
                >
                  {displayStatus}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Close
            </button>
          </div>

          <div className="grid flex-1 gap-0 overflow-hidden lg:grid-cols-[1.1fr,0.9fr]">
            <div className="overflow-y-auto p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <DetailBlock
                  label="Manual Deadline"
                  value={formatDate(caseItem.manualDeadline)}
                  emphasis
                />
                <DetailBlock
                  label="Internal Reminder"
                  value={formatDate(reminderDate)}
                  emphasis
                />
                <DetailBlock
                  label="Insurance Company"
                  value={caseItem.insuranceCompany || "Not set"}
                />
                <DetailBlock
                  label="Policy Number"
                  value={caseItem.policyNumber || "Not set"}
                />
                <DetailBlock
                  label="Date of Accident"
                  value={formatDate(caseItem.dateOfAccident)}
                />
                <DetailBlock
                  label="Date Reported"
                  value={
                    caseItem.dateReported
                      ? formatDate(caseItem.dateReported)
                      : "Not reported yet"
                  }
                />
                <DetailBlock
                  label="Date Created"
                  value={formatDate(caseItem.dateCreated)}
                />
                <DetailBlock
                  label="Last Updated"
                  value={formatDateTime(caseItem.lastUpdated)}
                />
              </div>

              {displayStatus === "Overdue" && (
                <div className="mt-5 rounded-[28px] border border-rose-200 bg-rose-50 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-500">
                    Overdue
                  </p>
                  <p className="mt-2 text-base text-rose-700">
                    The real deadline has passed and this case is not completed.
                  </p>
                </div>
              )}

              <div className="mt-6 rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => onQuickStatusChange(caseItem.id, "Reported")}
                    disabled={caseItem.status === "Reported" || displayStatus === "Completed"}
                    className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Mark Reported
                  </button>

                  <button
                    type="button"
                    onClick={() => onQuickStatusChange(caseItem.id, "Completed")}
                    disabled={displayStatus === "Completed"}
                    className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Mark Completed
                  </button>

                  <button
                    type="button"
                    onClick={() => onEdit(caseItem)}
                    className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    Edit Case
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(caseItem.id)}
                    className="rounded-2xl border border-rose-200 px-5 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                  >
                    Delete Case
                  </button>
                </div>
              </div>
            </div>

            <aside className="overflow-y-auto border-t border-slate-100 bg-mist p-6 lg:border-l lg:border-t-0">
              <section className="rounded-[28px] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-ink">Case Notes</h3>
                    <p className="text-sm text-slate-500">
                      Update the main notes whenever new information comes in.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    disabled={!notesChanged}
                    className="rounded-2xl bg-spruce px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Save Notes
                  </button>
                </div>

                <textarea
                  value={notesDraft}
                  onChange={(event) => setNotesDraft(event.target.value)}
                  rows="6"
                  className="mt-4 w-full rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-spruce focus:bg-white focus:ring-4 focus:ring-mint/60"
                />
              </section>

              <section className="mt-5 rounded-[28px] bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-ink">Add History Note</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Keep a simple timeline of updates and follow-ups.
                </p>

                <textarea
                  value={historyDraft}
                  onChange={(event) => setHistoryDraft(event.target.value)}
                  rows="4"
                  placeholder="Add a quick update to the case history"
                  className="mt-4 w-full rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-spruce focus:bg-white focus:ring-4 focus:ring-mint/60"
                />

                <button
                  type="button"
                  onClick={handleAddHistory}
                  className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Add to History
                </button>
              </section>

              <section className="mt-5 rounded-[28px] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-ink">History</h3>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                    {sortedHistory.length} entries
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {sortedHistory.length > 0 ? (
                    sortedHistory.map((entry) => (
                      <div
                        key={entry.id}
                        className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                      >
                        <p className="text-sm font-medium text-slate-700">
                          {entry.text}
                        </p>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                          {formatDateTime(entry.createdAt)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
                      No history notes yet.
                    </div>
                  )}
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  app.CaseDetailsModal = CaseDetailsModal;
})(window.KARENApp);
