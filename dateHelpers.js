window.KARENApp = window.KARENApp || {};

(function registerDateHelpers(app) {
  function parseLocalDate(value) {
    if (!value || typeof value !== "string") {
      return null;
    }

    if (value.indexOf("T") !== -1) {
      const parsed = new Date(value);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    const parts = value.split("-").map(Number);
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];

    if (!year || !month || !day) {
      return null;
    }

    return new Date(year, month - 1, day);
  }

  function startOfDay(dateLike) {
    const rawValue = dateLike || new Date();
    const base =
      rawValue instanceof Date ? new Date(rawValue) : parseLocalDate(rawValue);

    if (!base) {
      return null;
    }

    base.setHours(0, 0, 0, 0);
    return base;
  }

  function toISODate(dateLike) {
    const rawValue = dateLike || new Date();
    const date =
      rawValue instanceof Date ? new Date(rawValue) : parseLocalDate(rawValue);

    if (!date) {
      return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function addDays(dateLike, amount) {
    const date =
      dateLike instanceof Date ? new Date(dateLike) : parseLocalDate(dateLike);

    if (!date) {
      return new Date();
    }

    date.setDate(date.getDate() + amount);
    return date;
  }

  function subtractDays(dateLike, amount) {
    return addDays(dateLike, amount * -1);
  }

  function getInternalReminderDate(manualDeadline) {
    if (!manualDeadline) {
      return "";
    }

    return toISODate(subtractDays(manualDeadline, 2));
  }

  function formatDate(value, options) {
    const date = parseLocalDate(value);

    if (!date) {
      return "Not set";
    }

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      ...options,
    }).format(date);
  }

  function formatDateTime(value) {
    const date = parseLocalDate(value);

    if (!date) {
      return "Not set";
    }

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  }

  function isSameDay(first, second) {
    const firstDate = startOfDay(first);
    const secondDate = startOfDay(second);

    if (!firstDate || !secondDate) {
      return false;
    }

    return firstDate.getTime() === secondDate.getTime();
  }

  function isBeforeDay(first, second) {
    const firstDate = startOfDay(first);
    const secondDate = startOfDay(second);

    if (!firstDate || !secondDate) {
      return false;
    }

    return firstDate.getTime() < secondDate.getTime();
  }

  function getCaseDisplayStatus(caseItem) {
    if (!caseItem) {
      return "New";
    }

    if (caseItem.status === "Completed") {
      return "Completed";
    }

    if (caseItem.status === "Overdue") {
      return "Overdue";
    }

    if (caseItem.manualDeadline && isBeforeDay(caseItem.manualDeadline, new Date())) {
      return "Overdue";
    }

    return caseItem.status || "New";
  }

  function getDashboardBucket(caseItem) {
    const displayStatus = getCaseDisplayStatus(caseItem);

    if (displayStatus === "Completed") {
      return "Completed";
    }

    if (displayStatus === "Overdue") {
      return "Overdue";
    }

    const reminderDate = getInternalReminderDate(caseItem.manualDeadline);

    if (!reminderDate) {
      return "Upcoming";
    }

    const today = startOfDay(new Date());
    const tomorrow = addDays(today, 1);
    const reminder = startOfDay(reminderDate);

    if (!reminder || !today) {
      return "Upcoming";
    }

    if (reminder.getTime() <= today.getTime()) {
      return "Today";
    }

    if (isSameDay(reminder, tomorrow)) {
      return "Due Tomorrow";
    }

    return "Upcoming";
  }

  app.helpers = {
    parseLocalDate,
    startOfDay,
    toISODate,
    addDays,
    subtractDays,
    getInternalReminderDate,
    formatDate,
    formatDateTime,
    isSameDay,
    isBeforeDay,
    getCaseDisplayStatus,
    getDashboardBucket,
  };
})(window.KARENApp);
