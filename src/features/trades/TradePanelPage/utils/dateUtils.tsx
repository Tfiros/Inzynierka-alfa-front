export const formatDateTimePl = (iso: string) => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"

  return new Intl.DateTimeFormat("pl-PL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d)
}
