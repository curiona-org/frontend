import config from "@/lib/config";
import {
  CurionaErrorCodes,
  ERROR_MESSAGES,
  handleCurionaError,
} from "@/lib/error";
import { decrypt } from "@/lib/helpers/crypto.helper";
import { APIResponse } from "@/lib/services/api.service";
import { RoadmapService } from "@/lib/services/roadmap.service";
import { Session } from "@/lib/session";
import { GetRoadmapOutput } from "@/types/api-roadmap";
import { cookies } from "next/headers";

export async function getRoadmapBySlug(
  slug: string
): Promise<APIResponse<GetRoadmapOutput | null>> {
  try {
    // update session cookie user details
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(config.SESSION_COOKIE_NAME);

    if (!sessionCookie?.value) {
      return {
        success: false,
        message: ERROR_MESSAGES[CurionaErrorCodes.INTERNAL_ERROR],
        code: CurionaErrorCodes.INTERNAL_ERROR,
        data: null,
      };
    }

    const session = await decrypt<Session>(
      decodeURIComponent(sessionCookie.value)
    );

    if (!session) {
      return {
        success: false,
        message: ERROR_MESSAGES[CurionaErrorCodes.INTERNAL_ERROR],
        code: CurionaErrorCodes.INTERNAL_ERROR,
        data: null,
      };
    }

    const roadmapService = new RoadmapService(session.tokens.access_token);
    const result = await roadmapService.getRoadmapBySlug(slug);
    if (!result?.data) {
      return {
        success: false,
        message: ERROR_MESSAGES[CurionaErrorCodes.NOT_FOUND],
        code: CurionaErrorCodes.NOT_FOUND,
        data: null,
      };
    }
    return result;
  } catch (error) {
    const err = handleCurionaError(error);
    return {
      success: false,
      message: err.message,
      code: err.code,
      data: null,
    };
  }
}
