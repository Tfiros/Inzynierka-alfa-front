import { NavLink } from "react-router-dom"

export const NavItem = ({ to, label }: { to: string; label: string }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `transition-colors hover:text-foreground ${
          isActive ? "text-foreground" : "text-foreground/70"
        }`
      }
    >
      {label}
    </NavLink>
  )
}
