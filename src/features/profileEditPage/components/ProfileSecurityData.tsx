import type {
  UpdateProfileSecurityRequest,
  UserSecurityProfileInfoResponse,
} from "@/shared/api/UserSecurityInfo"

export type SecurityFields = {
  email: string
  dateOfBirth: string
}

//Istnieje tylko po to aby przekszatłacać datę na stringa
export function toDateInputValue(v: unknown): string {
  if (!v) return ""
  if (typeof v === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v
    const d = new Date(v)
    if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10)
    return ""
  }
  const d = v instanceof Date ? v : new Date(v as any)
  if (Number.isNaN(d.getTime())) return ""
  return d.toISOString().slice(0, 10)
}

export function mapSecurityBackendToFields(
  s: UserSecurityProfileInfoResponse
): SecurityFields {
  return {
    email: s.email,
    dateOfBirth: toDateInputValue(s.dateOfBirth),
  }
}

export function mapSecurityToUpdateRequest(
  s: SecurityFields
): UpdateProfileSecurityRequest {
  return {
    email: s.email,
    dateOfBirth: s.dateOfBirth,
  }
}
