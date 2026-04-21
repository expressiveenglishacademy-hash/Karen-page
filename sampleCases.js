window.KARENApp = window.KARENApp || {};

(function registerSampleCases(app) {
  const addDays = app.addDays;
  const toISODate = app.toISODate;

  function buildHistoryEntry(text, createdAt) {
    return {
      id: `${new Date(createdAt).getTime()}-${Math.random().toString(36).slice(2, 8)}`,
      text: text,
      createdAt: new Date(createdAt).toISOString(),
    };
  }

  function getSampleCases() {
    const now = new Date();

    function shift(days) {
      return addDays(now, days);
    }

    return [
      {
        id: "case-maria-lopez",
        clientName: "Maria Lopez",
        dateOfAccident: toISODate(shift(-18)),
        insuranceCompany: "Bright Harbor Insurance",
        policyNumber: "BH-3021948",
        manualDeadline: toISODate(shift(2)),
        notes:
          "Rear-end collision. Waiting on final intake packet before report is sent.",
        status: "Pending Report",
        dateReported: "",
        dateCreated: toISODate(shift(-5)),
        lastUpdated: shift(-1).toISOString(),
        history: [
          buildHistoryEntry("Case created and intake documents requested.", shift(-5)),
          buildHistoryEntry("Police report number added to file.", shift(-3)),
        ],
      },
      {
        id: "case-jordan-ellis",
        clientName: "Jordan Ellis",
        dateOfAccident: toISODate(shift(-7)),
        insuranceCompany: "Northline Casualty",
        policyNumber: "NC-7719042",
        manualDeadline: toISODate(shift(3)),
        notes:
          "Slip-and-fall incident. Caller confirmed claim documents will be uploaded this afternoon.",
        status: "New",
        dateReported: "",
        dateCreated: toISODate(shift(-2)),
        lastUpdated: shift(-1).toISOString(),
        history: [
          buildHistoryEntry("Case created from phone intake.", shift(-2)),
        ],
      },
      {
        id: "case-linda-park",
        clientName: "Linda Park",
        dateOfAccident: toISODate(shift(-24)),
        insuranceCompany: "Summit Mutual",
        policyNumber: "SM-0092153",
        manualDeadline: toISODate(shift(5)),
        notes:
          "Claim already reported. Keep file open until carrier confirms next steps.",
        status: "Reported",
        dateReported: toISODate(shift(-1)),
        dateCreated: toISODate(shift(-9)),
        lastUpdated: shift(-1).toISOString(),
        history: [
          buildHistoryEntry("Initial intake completed.", shift(-9)),
          buildHistoryEntry("Carrier contacted and claim reported.", shift(-1)),
        ],
      },
      {
        id: "case-arthur-price",
        clientName: "Arthur Price",
        dateOfAccident: toISODate(shift(-15)),
        insuranceCompany: "Skyline Assurance",
        policyNumber: "SA-1853340",
        manualDeadline: toISODate(shift(8)),
        notes:
          "Follow-up needed on witness statement before claim can move to next step.",
        status: "Claim Opened",
        dateReported: toISODate(shift(-4)),
        dateCreated: toISODate(shift(-11)),
        lastUpdated: shift(-2).toISOString(),
        history: [
          buildHistoryEntry("Claim reported to carrier.", shift(-4)),
          buildHistoryEntry("Claim number received from insurance company.", shift(-2)),
        ],
      },
      {
        id: "case-devon-brooks",
        clientName: "Devon Brooks",
        dateOfAccident: toISODate(shift(-10)),
        insuranceCompany: "Bright Harbor Insurance",
        policyNumber: "BH-6624011",
        manualDeadline: toISODate(shift(-1)),
        notes:
          "No confirmation received before deadline. Needs immediate follow-up with supervisor.",
        status: "Pending Report",
        dateReported: "",
        dateCreated: toISODate(shift(-6)),
        lastUpdated: shift(0).toISOString(),
        history: [
          buildHistoryEntry("Reminder call placed to client.", shift(-3)),
          buildHistoryEntry("Deadline passed without completion.", shift(0)),
        ],
      },
      {
        id: "case-sophia-bennett",
        clientName: "Sophia Bennett",
        dateOfAccident: toISODate(shift(-31)),
        insuranceCompany: "Northline Casualty",
        policyNumber: "NC-4462012",
        manualDeadline: toISODate(shift(-4)),
        notes:
          "Report accepted and supporting documents uploaded. File is closed.",
        status: "Completed",
        dateReported: toISODate(shift(-8)),
        dateCreated: toISODate(shift(-15)),
        lastUpdated: shift(-2).toISOString(),
        history: [
          buildHistoryEntry("Claim reported successfully.", shift(-8)),
          buildHistoryEntry("Case marked complete after confirmation email.", shift(-2)),
        ],
      },
    ];
  }

  app.getSampleCases = getSampleCases;
})(window.KARENApp);
