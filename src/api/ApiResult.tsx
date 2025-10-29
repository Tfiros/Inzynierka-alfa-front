import {HttpStatusCode} from "axios";

export interface ApiResult<T = unknown> {
  status: HttpStatusCode;
    message?: string;
    data?: T;
}