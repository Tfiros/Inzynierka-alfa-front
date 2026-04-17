import { post } from "@/shared/api/ApiClient"

export type ContactFormData = {
  name: string
  email: string
  subject: string
  message: string
}

export class ContactService {
  private static readonly base = "/Contact"

  public static readonly sendMessage = async (data: ContactFormData) => {
    return post<null>(this.base, data)
  }
}
