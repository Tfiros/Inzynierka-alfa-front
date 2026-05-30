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
