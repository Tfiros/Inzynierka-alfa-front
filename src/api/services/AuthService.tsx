import { post } from "@/api/ApiClient";
import type {
  LoginRequestDto, RegisterRequestDto, ForgotPasswordRequestDto,
  RefreshTokenRequestDto,
} from "@/shared/types/authTypes/AuthRequestTypes";
import type {
  LoginResponseDto, RegisterResponseDto, ForgotPasswordResponseDto,
  RefreshResponseDto, LogoutResponseDto,
} from "@/shared/types/authTypes/AuthResponseTypes";
class AuthServiceClass {
  private readonly base = "/Login";

  login(data: LoginRequestDto) {
    return post<LoginResponseDto>(`${this.base}`, data);
  }

  register(data: RegisterRequestDto) {
    return post<RegisterResponseDto>(`${this.base}/register`, data);
  }

  forgotPassword(data: ForgotPasswordRequestDto) {
    return post<ForgotPasswordResponseDto>(`${this.base}/forgot-password`, data);
  }

  refresh(data: RefreshTokenRequestDto) {
    return post<RefreshResponseDto>(`${this.base}/refresh`, data);
  }

  logout(data: RefreshTokenRequestDto) {
    return post<LogoutResponseDto>(`${this.base}/logout`, data);
  }
}

const AuthService = new AuthServiceClass();
export default AuthService;
