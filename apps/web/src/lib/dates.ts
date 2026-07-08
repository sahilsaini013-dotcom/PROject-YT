// The client's "today" in their own timezone, as a yyyy-mm-dd string — the
// format stored in scheduled_date / checked_in_on / logged_on columns.
export function todayISO(timezone: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
