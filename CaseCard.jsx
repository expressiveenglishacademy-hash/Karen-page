window.KARENApp = window.KARENApp || {};

(function registerCaseCard(app) {
  const formatDate = app.formatDate;
  const getInternalReminderDate = app.getInternalReminderDate;

  const badgeStyles = {
    New: "bg-sky-100 text-sky-700",
    "Pending Report": "bg-amber-100 text-amber-700",
    Reported: "bg-teal-100 text-teal-700",
    "Claim Opened": "bg-indigo-100 text-indigo-700",
    Completed: "bg-emerald-100 text-emerald-700",
    Overdue: "bg-rose-100 text-rose-700",
  };

  const frameStyles = {
    Today: "border-amber-200",
    "Due Tomorrow": "border-sky-200",
    Upcoming: "border-slate-200",
    Overdue: "border-rose-200",
    Completed: "border-emerald-200",
  };

  function getInitials(name) {
    return name
      .split(" ")
      .slice(0, 2)
      .map((part) => (part[0] ? part[0].toUpperCase() : ""))
      .join("");
  }

  function CaseCard({
    caseItem,
    displayStatus,
    bucket,
    onView,
    onEdit,
    onDelete,
  }) {
    const reminderDate = getInternalReminderDate(caseItem.manualDeadline);
    const notePreview =
      caseItem.notes.length > 120
        ? `${caseItem.notes.slice(0, 120)}...`
        : caseItem.notes || "No notes yet.";

    return (
      <article
        className={`group rounded-[28px] border bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-soft ${frameStyles[bucket] || frameStyles.Upcoming}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 via-white to-mint text-lg font-extrabold text-ink shadow-inner">
              {getInitials(caseItem.clientName)}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold text-ink">
                {caseItem.clientName}
              </h3>
              <p className="truncate text-sm text-slate-500">
                {caseItem.insuranceCompany}
              </p>
            </div>
          </div>

          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${badgeStyles[displayStatus] || badgeStyles.New}`}
          >
            {displayStatus}
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Manual Deadline
            </p>
            <p className="mt-2 text-base font-semibold text-ink">
              {formatDate(caseItem.manualDeadline)}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Internal Reminder
            </p>
            <p className="mt-2 text-base font-semibold text-ink">
              {formatDate(reminderDate)}
            </p>
          </div>
        </div>

        {displayStatus === "Overdue" && (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            Deadline passed. This case needs attention now.
          </div>
        )}

        <div className="mt-4 space-y-2 text-sm text-slate-600">
          <p>
            <span className="font-semibold text-slate-700">Policy:</span>{" "}
            {caseItem.policyNumber || "Not added"}
          </p>
          <p>
            <span className="font-semibold text-slate-700">Accident:</span>{" "}
            {formatDate(caseItem.dateOfAccident)}
          </p>
          <p>
            <span className="font-semibold text-slate-700">Notes:</span>{" "}
            {notePreview}
          </p>
          {caseItem.dateReported && (
            <p>
              <span className="font-semibold text-slate-700">Reported:</span>{" "}
              {formatDate(caseItem.dateReported)}
            </p>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onView(caseItem)}
            className="flex-1 rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            View
          </button>
          <button
            type="button"
            onClick={() => onEdit(caseItem)}
            className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(caseItem.id)}
            className="rounded-2xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
          >
            Delete
          </button>
        </div>
      </article>
    );
  }

  app.CaseCard = CaseCard;
})(window.KARENApp);
