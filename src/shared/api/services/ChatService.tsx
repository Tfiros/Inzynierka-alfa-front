import { del, get, post, put } from "../ApiClient"
import type {
  ChatMessage,
  ChatReadStateDto,
  ChatThreadListItemDto,
  CreateDmChatResponse,
  EditMessageRequest,
  MarkReadRequest,
  SendMessageRequest,
} from "@/shared/types/chat/ChatDtos"

export class ChatService {
  private static readonly base = "/Chat"

  // POST /Chat/dm/{otherUserId}
  public static readonly createDm = async (otherUserId: number) =>
    post<CreateDmChatResponse>(`${this.base}/dm/${otherUserId}`, {})

  // GET /Chat/threads?page=&pageSize=&search=
  public static readonly getThreads = async (args?: {
    page?: number
    pageSize?: number
    search?: string | null
  }) =>
    get<ChatThreadListItemDto[]>(`${this.base}/threads`, {
      page: args?.page ?? 1,
      pageSize: args?.pageSize ?? 20,
      search: args?.search ?? null,
    })

  // GET /Chat/threads/{chatId}/messages?beforeMessageId=&pageSize=
  public static readonly getMessages = async (args: {
    chatId: number
    beforeMessageId?: number | null
    pageSize?: number
  }) =>
    get<ChatMessage[]>(`${this.base}/threads/${args.chatId}/messages`, {
      beforeMessageId: args.beforeMessageId ?? null,
      pageSize: args.pageSize ?? 50,
    })

  // POST /Chat/threads/{chatId}/messages
  public static readonly sendMessage = async (
    chatId: number,
    req: SendMessageRequest
  ) => post<ChatMessage>(`${this.base}/threads/${chatId}/messages`, req)

  // PUT /Chat/messages/{messageId}
  public static readonly editMessage = async (
    messageId: number,
    req: EditMessageRequest
  ) => put<ChatMessage>(`${this.base}/messages/${messageId}`, req)

  // DELETE /Chat/messages/{messageId}
  public static readonly deleteMessage = async (messageId: number) =>
    del<string>(`${this.base}/messages/${messageId}`)

  // POST /Chat/threads/{chatId}/read
  public static readonly markRead = async (
    chatId: number,
    req?: MarkReadRequest
  ) => post<ChatReadStateDto>(`${this.base}/threads/${chatId}/read`, req ?? {})
}
