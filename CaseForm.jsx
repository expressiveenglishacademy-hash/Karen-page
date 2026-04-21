window.KARENApp = window.KARENApp || {};

(function registerCaseForm(app) {
  const useEffect = React.useEffect;
  const useMemo = React.useMemo;
  const useState = React.useState;
  const formatDate = app.formatDate;
  const getInternalReminderDate = app.getInternalReminderDate;

  const emptyCase = {
    clientName: "",
    dateOfAccident: "",
    insuranceCompany: "",
    policyNumber: "",
    manualDeadline: "",
    notes: "",
    status: "New",
  };

  const statuses = [
    "New",
    "Pending Report",
    "Reported",
    "Claim Opened",
    "Completed",
    "Overdue",
  ];

  function CaseForm({ initialCase, onSave, onCancel }) {
    const [formData, setFormData] = useState(emptyCase);

    useEffect(() => {
      setFormData({
        ...emptyCase,
        ...initialCase,
        notes: initialCase && initialCase.notes ? initialCase.notes : "",
        status: initialCase && initialCase.status ? initialCase.status : "New",
      });
    }, [initialCase]);

    const internalReminderDate = useMemo(
      () => getInternalReminderDate(formData.manualDeadline),
      [formData.manualDeadline],
    );

    function handleChange(event) {
      const { name, value } = event.target;
      setFormData((current) => ({
        ...current,
        [name]: value,
      }));
    }

    function handleSubmit(event) {
      event.preventDefault();
      onSave({
        ...formData,
        clientName: formData.clientName.trim(),
        insuranceCompany: formData.insuranceCompany.trim(),
        policyNumber: formData.policyNumber.trim(),
        notes: formData.notes.trim(),
      });
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
        <div className="modal-card max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-[32px] border border-white/70 bg-white shadow-float">
          <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-100 bg-white/95 px-6 py-5 backdrop-blur">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                KAREN
              </p>
              <h2 className="mt-1 text-2xl font-bold text-ink">
                {initialCase ? "Edit Case" : "Create New Case"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Keep the real deadline clear and let the internal reminder update
                automatically.
              </p>
            </div>

            <button
              type="button"
              onClick={onCancel}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Close
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <label>
                <span className="mb-2 block text-sm font-medium text-slate-600">
                  Client Name
                </span>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  required
                  placeholder="Enter client name"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-spruce focus:bg-white focus:ring-4 focus:ring-mint/60"
                />
              </label>

              <label>
                <span className="mb-2 block text-sm font-medium text-slate-600">
                  Date of Accident
                </span>
                <input
                  type="date"
                  name="dateOfAccident"
                  value={formData.dateOfAccident}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-spruce focus:bg-white focus:ring-4 focus:ring-mint/60"
                />
              </label>

              <label>
                <span className="mb-2 block text-sm font-medium text-slate-600">
                  Insurance Company
                </span>
                <input
                  type="text"
                  name="insuranceCompany"
                  value={formData.insuranceCompany}
                  onChange={handleChange}
                  required
                  placeholder="Enter insurance company"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-spruce focus:bg-white focus:ring-4 focus:ring-mint/60"
                />
              </label>

              <label>
                <span className="mb-2 block text-sm font-medium text-slate-600">
                  Policy Number
                </span>
                <input
                  type="text"
                  name="policyNumber"
                  value={formData.policyNumber}
                  onChange={handleChange}
                  placeholder="Enter policy number"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-spruce focus:bg-white focus:ring-4 focus:ring-mint/60"
                />
              </label>

              <label>
                <span className="mb-2 block text-sm font-medium text-slate-600">
                  Manual Deadline
                </span>
                <input
                  type="date"
                  name="manualDeadline"
                  value={formData.manualDeadline}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-spruce focus:bg-white focus:ring-4 focus:ring-mint/60"
                />
              </label>

              <label>
                <span className="mb-2 block text-sm font-medium text-slate-600">
                  Status
                </span>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-spruce focus:bg-white focus:ring-4 focus:ring-mint/60"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="rounded-[28px] border border-amber-100 bg-gradient-to-r from-sand via-white to-sky-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-500">
                Automatic Reminder
              </p>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-white/90 p-4 shadow-sm">
                  <p className="text-sm font-medium text-slate-500">Manual Deadline</p>
                  <p className="mt-2 text-lg font-bold text-ink">
                    {formData.manualDeadline
                      ? formatDate(formData.manualDeadline)
                      : "Choose a date"}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/90 p-4 shadow-sm">
                  <p className="text-sm font-medium text-slate-500">
                    Internal Reminder Date
                  </p>
                  <p className="mt-2 text-lg font-bold text-ink">
                    {internalReminderDate
                      ? formatDate(internalReminderDate)
                      : "Will appear automatically"}
                  </p>
                </div>
              </div>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-600">
                Notes
              </span>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="5"
                placeholder="Add helpful notes for this case"
                className="w-full rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-spruce focus:bg-white focus:ring-4 focus:ring-mint/60"
              />
            </label>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-2xl border border-slate-200 px-6 py-3 text-base font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-2xl bg-ink px-6 py-3 text-base font-semibold text-white transition hover:bg-slate-800"
              >
                {initialCase ? "Save Changes" : "Create Case"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  app.CaseForm = CaseForm;
})(window.KARENApp);
