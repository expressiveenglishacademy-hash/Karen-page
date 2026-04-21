export function parseLocalDate(value) {
  if (!value || typeof value !== "string") {
    return null;
  }

  if (value.includes("T")) {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

export function startOfDay(dateLike = new Date()) {
  const base =
    dateLike instanceof Date ? new Date(dateLike) : parseLocalDate(dateLike);

  if (!base) {
    return null;
  }

  base.setHours(0, 0, 0, 0);
  return base;
}

export function toISODate(dateLike = new Date()) {
  const date =
    dateLike instanceof Date ? new Date(dateLike) : parseLocalDate(dateLike);

  if (!date) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function addDays(dateLike, amount) {
  const date =
    dateLike instanceof Date ? new Date(dateLike) : parseLocalDate(dateLike);

  if (!date) {
    return new Date();
  }

  date.setDate(date.getDate() + amount);
  return date;
}

export function subtractDays(dateLike, amount) {
  return addDays(dateLike, amount * -1);
}

export function getInternalReminderDate(manualDeadline) {
  if (!manualDeadline) {
    return "";
  }

  return toISODate(subtractDays(manualDeadline, 2));
}

export function formatDate(value, options) {
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

export function formatDateTime(value) {
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

export function isSameDay(first, second) {
  const firstDate = startOfDay(first);
  const secondDate = startOfDay(second);

  if (!firstDate || !secondDate) {
    return false;
  }

  return firstDate.getTime() === secondDate.getTime();
}

export function isBeforeDay(first, second) {
  const firstDate = startOfDay(first);
  const secondDate = startOfDay(second);

  if (!firstDate || !secondDate) {
    return false;
  }

  return firstDate.getTime() < secondDate.getTime();
}

export function getCaseDisplayStatus(caseItem) {
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

export function getDashboardBucket(caseItem) {
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
