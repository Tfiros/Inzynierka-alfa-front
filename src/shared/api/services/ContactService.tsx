import { post } from "@/shared/api/ApiClient"
import type { ContactFormData } from "@/shared/types/contactTypes"

export class ContactService {
  private static readonly base = "/Contact"

  public static readonly sendMessage = async (data: ContactFormData) => {
    return post<null>(this.base, data)
  }
}
