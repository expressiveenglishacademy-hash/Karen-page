import React from "react";

export default function Filters({
  filters,
  insuranceCompanies,
  onChange,
  onClear,
}) {
  return (
    <section className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-soft backdrop-blur">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-ink">Find the right case fast</h2>
          <p className="text-sm text-slate-500">
            Search by client and narrow the list by company, deadline, or status.
          </p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
        >
          Clear Filters
        </button>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-5">
        <label className="lg:col-span-2">
          <span className="mb-2 block text-sm font-medium text-slate-600">
            Search client name
          </span>
          <input
            type="text"
            value={filters.search}
            onChange={(event) => onChange("search", event.target.value)}
            placeholder="Type a client name"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-700 outline-none transition focus:border-spruce focus:bg-white focus:ring-4 focus:ring-mint/60"
          />
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium text-slate-600">
            Insurance company
          </span>
          <select
            value={filters.insuranceCompany}
            onChange={(event) => onChange("insuranceCompany", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-700 outline-none transition focus:border-spruce focus:bg-white focus:ring-4 focus:ring-mint/60"
          >
            <option value="">All companies</option>
            {insuranceCompanies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="mb-2 block text-sm font-medium text-slate-600">Status</span>
          <select
            value={filters.status}
            onChange={(event) => onChange("status", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-700 outline-none transition focus:border-spruce focus:bg-white focus:ring-4 focus:ring-mint/60"
          >
            <option value="">All statuses</option>
            <option value="New">New</option>
            <option value="Pending Report">Pending Report</option>
            <option value="Reported">Reported</option>
            <option value="Claim Opened">Claim Opened</option>
            <option value="Completed">Completed</option>
            <option value="Overdue">Overdue</option>
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5">
          <label>
            <span className="mb-2 block text-sm font-medium text-slate-600">
              Deadline from
            </span>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(event) => onChange("dateFrom", event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-700 outline-none transition focus:border-spruce focus:bg-white focus:ring-4 focus:ring-mint/60"
            />
          </label>

          <label>
            <span className="mb-2 block text-sm font-medium text-slate-600">
              Deadline to
            </span>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(event) => onChange("dateTo", event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-700 outline-none transition focus:border-spruce focus:bg-white focus:ring-4 focus:ring-mint/60"
            />
          </label>
        </div>
      </div>
    </section>
  );
}
