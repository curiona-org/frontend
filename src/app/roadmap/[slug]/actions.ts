import {
  CurionaErrorCodes,
  ERROR_MESSAGES,
  handleCurionaError,
} from "@/lib/error";
import { APIResponse } from "@/lib/services/api.service";
import { RoadmapService } from "@/lib/services/roadmap.service";
import { GetRoadmapOutput } from "@/types/api-roadmap";

const roadmapService = new RoadmapService();

export async function getRoadmapBySlug(
  slug: string
): Promise<APIResponse<GetRoadmapOutput | null>> {
  try {
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
