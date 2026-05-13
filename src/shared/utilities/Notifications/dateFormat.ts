export const formatNotificationDate = (date: string) =>
  new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
