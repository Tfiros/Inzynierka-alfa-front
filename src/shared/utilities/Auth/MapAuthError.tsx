import type { RawBodyResponse } from "@/shared/types/authTypes/AuthErrorTypes"

export function mapAuthError(e: any): { title: string; desc?: string } {
  const r = e as Partial<RawBodyResponse>
  const code = r.message ?? "auth_error"

  const desc =
    r.details?.error_description ??
    r.details?.text ??
    r.details?.error ??
    r.details?.extra?.error ??
    undefined

  switch (code) {
    case "auth0_signup_failed":
      return { title: "Rejestracja nie powiodła się", desc }
    case "auth0_token_failed":
      return { title: "Logowanie nie powiodło się", desc }
    case "auth0_refresh_failed":
      return { title: "Odświeżenie sesji nie powiodło się", desc }
    case "auth0_change_password_failed":
      return { title: "Reset hasła nie powiódł się", desc }
    case "auth0_revoke_failed":
      return { title: "Wylogowanie nie powiodło się", desc }
    default:
      return { title: "Błąd uwierzytelniania", desc }
  }
}
