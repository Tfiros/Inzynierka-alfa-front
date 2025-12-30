import { post } from "@/api/ApiClient"
import type {
  LoginRequestDto,
  RegisterRequestDto,
  ForgotPasswordRequestDto,
} from "@/shared/types/authTypes/AuthRequestTypes"
import type {
  LoginResponseDto,
  RegisterResponseDto,
  ForgotPasswordResponseDto,
  RefreshResponseDto,
  LogoutResponseDto,
} from "@/shared/types/authTypes/AuthResponseTypes"

export class AuthService {
  private static readonly base = "/Auth"

  public static readonly login = async (data: LoginRequestDto) =>
    post<LoginResponseDto>(`${this.base}/login`, data)

  public static readonly register = async (data: RegisterRequestDto) =>
    post<RegisterResponseDto>(`${this.base}/register`, data)

  public static readonly forgotPassword = async (
    data: ForgotPasswordRequestDto
  ) => post<ForgotPasswordResponseDto>(`${this.base}/forgot-password`, data)

  public static readonly refresh = async () =>
    post<RefreshResponseDto>(`${this.base}/refresh`)

  public static readonly logout = async () =>
    post<LogoutResponseDto>(`${this.base}/logout`)
}
