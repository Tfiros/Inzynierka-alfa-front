const successRateFormatter = new Intl.NumberFormat("pl-PL", {
  style: "percent",
  maximumFractionDigits: 1,
})

const ratingFormatter = new Intl.NumberFormat("pl-PL", {
  maximumFractionDigits: 1,
})

export const formatRating = (rating: number) => ratingFormatter.format(rating)
export const formatSuccessRating = (rate: number) =>
  successRateFormatter.format(rate)

export const initials = (name?: string, fallback = "U") =>
  (
    name
      ?.split(/\s+/)
      .map((p) => p[0])
      .slice(0, 2)
      .join("") || fallback
  ).toUpperCase()
