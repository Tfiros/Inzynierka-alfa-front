import type { ApiResult } from "@/api/ApiResult"
import type {
  MiddlemanJobDto,
  MiddlemanStatsDto,
  MiddlemanTab,
} from "@/shared/types/middlemanTypes/MiddlemanTypes"

// TODO: podepiac pod realne endpointy tak jak w UserManagementService
export class MiddlemanService {
  public static readonly getStats = async (): Promise<
    ApiResult<MiddlemanStatsDto>
  > => {
    // mock
    return {
      isSuccess: true,
      status: 200,
      message: "",
      data: { total: 247, finished: 231, mineActive: 1, available: 3 },
    }
  }

  public static readonly getJobs = async (
    tab: MiddlemanTab
  ): Promise<ApiResult<MiddlemanJobDto[]>> => {
    // mock pod oba widoki
    const available: MiddlemanJobDto[] = [
      {
        id: "T-2024-002",
        createdAt: "2024-11-16T11:15:00Z",
        status: "Planned",
        middlemanFeeCoins: 150,
        leftParty: {
          nickname: "Piotr Wiśniewski",
          gameOrCategory: "Fortnite",
          itemTitle: "Konto Fortnite (150 skinów)",
          itemSubtitle: "Full access, email dostępny, brak banów",
        },
        rightParty: {
          nickname: "Marta Lewandowska",
          gameOrCategory: "Nintendo",
          itemTitle: "Nintendo Switch OLED",
          itemSubtitle:
            "Stan idealny, gwarancja 6 miesięcy, oryginalne opakowanie",
        },
      },
      {
        id: "T-2024-003",
        createdAt: "2024-11-15T14:20:00Z",
        status: "Planned",
        middlemanFeeCoins: 500,
        leftParty: {
          nickname: "Tomasz Kamiński",
          gameOrCategory: "Magic: The Gathering",
          itemTitle: "Black Lotus (Alpha)",
          itemSubtitle: "PSA 9, certyfikat autentyczności",
        },
        rightParty: {
          nickname: "Katarzyna Zielińska",
          gameOrCategory: "Magic: The Gathering",
          itemTitle: "Komplet Power Nine",
          itemSubtitle: "Unlimited edition, stan NM-EX",
        },
      },
    ]

    const mine: MiddlemanJobDto[] = [
      {
        id: "T-2024-001",
        createdAt: "2024-11-16T10:30:00Z",
        status: "InProgress",
        middlemanFeeCoins: 50,
        scheduledAt: "2024-11-17T15:00:00Z",
        leftParty: {
          nickname: "Jan Kowalski",
          gameOrCategory: "CS2",
          itemTitle: "AK-47 | Redline (Field-Tested)",
          itemSubtitle: "StatTrak™, 4x Sticker Katowice 2014",
        },
        rightParty: {
          nickname: "Anna Nowak",
          gameOrCategory: "CS2",
          itemTitle: "M4A4 | Asiimov (Well-Worn)",
          itemSubtitle: "Float 0.40, czysty wygląd",
        },
      },
    ]

    const finished: MiddlemanJobDto[] = []

    const data =
      tab === "available" ? available : tab === "mine" ? mine : finished

    return { isSuccess: true, status: 200, message: "", data }
  }

  public static readonly assignToMe = async (
    jobId: string
  ): Promise<ApiResult<string>> => {
    // TODO: POST/PATCH do API
    return { isSuccess: true, status: 200, message: "", data: "ok" }
  }

  public static readonly changeDate = async (
    jobId: string,
    scheduledAtIso: string
  ): Promise<ApiResult<string>> => {
    // TODO
    return { isSuccess: true, status: 200, message: "", data: "ok" }
  }

  public static readonly changeStatus = async (
    jobId: string,
    status: string
  ): Promise<ApiResult<string>> => {
    // TODO
    return { isSuccess: true, status: 200, message: "", data: "ok" }
  }
}
