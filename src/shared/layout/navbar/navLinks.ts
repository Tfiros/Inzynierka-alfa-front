export type NavbarLink = { to: string; label: string }

export const publicLinks: NavbarLink[] = [
  { to: "/marketplace", label: "Oferty" },
  { to: "/faqs", label: "FAQs" },
  { to: "/statute", label: "Regulamin" },
  { to: "/contact", label: "Kontakt" },
]

export function userLinks(
  isAdmin: boolean,
  isMiddleman: boolean
): NavbarLink[] {
  const links: NavbarLink[] = []
  if (isAdmin) {
    links.push({ to: "/itemManagement", label: "Zarządzanie przedmiotami" })
    links.push({ to: "/userManagement", label: "Użytkownicy" })
  }
  if (isMiddleman) {
    links.push({ to: "/tradePanel", label: "Panel pośrednika" })
  } else {
    links.push({ to: "/tradePanel", label: "Panel wymian" })
  }

  return links.concat(publicLinks)
}
