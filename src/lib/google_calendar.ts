const googleCalendarRenderURL = "https://calendar.google.com/calendar/render";

export type GoogleCalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  location?: string;
  description?: string;
  recurrence: "DAILY" | "WEEKLY" | "MONTHLY";
};

export function getGoogleCalendarURL({
  title,
  start,
  end,
  location,
  description,
  recurrence = "WEEKLY",
}: GoogleCalendarEvent): string {
  let recurrenceRule = "RRULE:";
  switch (recurrence) {
    case "DAILY":
      recurrenceRule += "FREQ=DAILY;UNTIL=" + formatDate(end);
      break;
    case "WEEKLY":
      recurrenceRule += "FREQ=WEEKLY;UNTIL=" + formatDate(end) + ";BYDAY=MO";
      break;
    case "MONTHLY":
      recurrenceRule += "FREQ=MONTHLY;UNTIL=" + formatDate(end) + ";BYDAY=1MO";
      break;
    default:
      recurrenceRule = "";
  }

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${formatDate(start)}/${formatDate(end)}`,
    location: location || "",
    details: description || "",
    recur: recurrenceRule,
  });

  return `${googleCalendarRenderURL}?${params.toString()}`;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}${month}${day}T${hours}${minutes}00Z`;
}
