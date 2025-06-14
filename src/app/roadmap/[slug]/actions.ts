import { getSession } from "@/app/actions";
import {
  CurionaErrorCodes,
  ERROR_MESSAGES,
  handleCurionaError,
} from "@/lib/error";
import { APIFilters, APIResponse } from "@/lib/services/api.service";
import { RoadmapService } from "@/lib/services/roadmap.service";
import {
  GenerateRoadmapInput,
  GenerateRoadmapOutput,
  GetRoadmapOutput,
  RegenerateRoadmapInput,
  RoadmapModerationOuput,
} from "@/types/api-roadmap";
import { GetTopicBySlugOutput } from "@/types/api-topic";

export async function generateRoadmap(
  data: GenerateRoadmapInput
): Promise<APIResponse<GenerateRoadmapOutput | null>> {
  try {
    const { session } = await getSession();

    if (!session || !session.tokens?.access_token) {
      return {
        success: false,
        message: ERROR_MESSAGES[CurionaErrorCodes.UNAUTHORIZED],
        code: CurionaErrorCodes.UNAUTHORIZED,
        data: null,
      };
    }

    const roadmapService = new RoadmapService(session.tokens.access_token);
    return await roadmapService.generateRoadmap(data);
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

export async function regenerateRoadmap(
  slug: string,
  data: RegenerateRoadmapInput
): Promise<APIResponse<GenerateRoadmapOutput | null>> {
  try {
    const { session } = await getSession();

    if (!session || !session.tokens?.access_token) {
      return {
        success: false,
        message: ERROR_MESSAGES[CurionaErrorCodes.UNAUTHORIZED],
        code: CurionaErrorCodes.UNAUTHORIZED,
        data: null,
      };
    }

    const roadmapService = new RoadmapService(session.tokens.access_token);
    return await roadmapService.regenerateRoadmap(slug, data);
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

export async function promptModeration(
  prompt: string
): Promise<APIResponse<RoadmapModerationOuput | null>> {
  try {
    const { session } = await getSession();

    if (!session || !session.tokens?.access_token) {
      return {
        success: false,
        message: ERROR_MESSAGES[CurionaErrorCodes.UNAUTHORIZED],
        code: CurionaErrorCodes.UNAUTHORIZED,
        data: null,
      };
    }

    const roadmapService = new RoadmapService(session.tokens.access_token);
    return await roadmapService.promptModeration(prompt);
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

export async function getRoadmapBySlug(
  slug: string
): Promise<APIResponse<GetRoadmapOutput | null>> {
  try {
    const roadmapService = new RoadmapService("");
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

export async function listCommunityRoadmaps({
  page = 1,
  limit = 9,
  search = "",
  orderBy = "oldest",
}: Partial<APIFilters>) {
  try {
    const { ok, session } = await getSession();

    if (!ok || !session) {
      const roadmapService = new RoadmapService("");
      return await roadmapService.listCommunityRoadmap(
        page,
        limit,
        search,
        orderBy
      );
    }

    const roadmapService = new RoadmapService(session.tokens.access_token);
    return await roadmapService.listCommunityRoadmap(
      page,
      limit,
      search,
      orderBy
    );
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

export async function listUserRoadmaps({
  page = 1,
  limit = 6,
}: Partial<APIFilters>) {
  try {
    const { session } = await getSession();
    if (!session || !session.tokens?.access_token) {
      return {
        success: false,
        message: ERROR_MESSAGES[CurionaErrorCodes.UNAUTHORIZED],
        code: CurionaErrorCodes.UNAUTHORIZED,
        data: null,
      };
    }
    const roadmapService = new RoadmapService(session.tokens.access_token);
    return await roadmapService.listUserRoadmap(page, limit);
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

export async function listUserOnProgressRoadmaps({
  page = 1,
  limit = 6,
}: Partial<APIFilters>) {
  try {
    const { session } = await getSession();
    if (!session || !session.tokens?.access_token) {
      return {
        success: false,
        message: ERROR_MESSAGES[CurionaErrorCodes.UNAUTHORIZED],
        code: CurionaErrorCodes.UNAUTHORIZED,
        data: null,
      };
    }
    const roadmapService = new RoadmapService(session.tokens.access_token);
    return await roadmapService.listUserOnProgressRoadmap(page, limit);
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

export async function listUserFinishedRoadmaps({
  page = 1,
  limit = 6,
}: Partial<APIFilters>) {
  try {
    const { session } = await getSession();
    if (!session || !session.tokens?.access_token) {
      return {
        success: false,
        message: ERROR_MESSAGES[CurionaErrorCodes.UNAUTHORIZED],
        code: CurionaErrorCodes.UNAUTHORIZED,
        data: null,
      };
    }
    const roadmapService = new RoadmapService(session.tokens.access_token);
    return await roadmapService.listUserFinishedRoadmap(page, limit);
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

export async function listUserBookmarkedRoadmaps({
  page = 1,
  limit = 6,
}: Partial<APIFilters>) {
  try {
    const { session } = await getSession();
    if (!session || !session.tokens?.access_token) {
      return {
        success: false,
        message: ERROR_MESSAGES[CurionaErrorCodes.UNAUTHORIZED],
        code: CurionaErrorCodes.UNAUTHORIZED,
        data: null,
      };
    }
    const roadmapService = new RoadmapService(session.tokens.access_token);
    return await roadmapService.listBookmarkedRoadmaps(page, limit);
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

export async function bookmarkRoadmap(
  slug: string
): Promise<APIResponse<null>> {
  try {
    const { session } = await getSession();

    if (!session || !session.tokens?.access_token) {
      return {
        success: false,
        message: ERROR_MESSAGES[CurionaErrorCodes.UNAUTHORIZED],
        code: CurionaErrorCodes.UNAUTHORIZED,
        data: null,
      };
    }

    const roadmapService = new RoadmapService(session.tokens.access_token);
    return (await roadmapService.bookmarkRoadmap(slug)) as APIResponse<null>;
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

export async function unbookmarkRoadmap(
  slug: string
): Promise<APIResponse<null>> {
  try {
    const { session } = await getSession();

    if (!session || !session.tokens?.access_token) {
      return {
        success: false,
        message: ERROR_MESSAGES[CurionaErrorCodes.UNAUTHORIZED],
        code: CurionaErrorCodes.UNAUTHORIZED,
        data: null,
      };
    }

    const roadmapService = new RoadmapService(session.tokens.access_token);
    return (await roadmapService.unbookmarkRoadmap(slug)) as APIResponse<null>;
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

export async function deleteRoadmapBySlug(
  slug: string
): Promise<APIResponse<null>> {
  try {
    const { session } = await getSession();

    if (!session || !session.tokens?.access_token) {
      return {
        success: false,
        message: ERROR_MESSAGES[CurionaErrorCodes.UNAUTHORIZED],
        code: CurionaErrorCodes.UNAUTHORIZED,
        data: null,
      };
    }

    const roadmapService = new RoadmapService(session.tokens.access_token);
    return (await roadmapService.deleteRoadmapBySlug(
      slug
    )) as APIResponse<null>;
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

export async function rateRoadmap(
  slug: string,
  rating: number,
  comment: string
): Promise<APIResponse<null>> {
  try {
    const { session } = await getSession();

    if (!session || !session.tokens?.access_token) {
      return {
        success: false,
        message: ERROR_MESSAGES[CurionaErrorCodes.UNAUTHORIZED],
        code: CurionaErrorCodes.UNAUTHORIZED,
        data: null,
      };
    }

    const roadmapService = new RoadmapService(session.tokens.access_token);
    return (await roadmapService.rateRoadmap(
      slug,
      rating,
      comment
    )) as APIResponse<null>;
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

/*


  == Topic Actions ==



*/

export async function getRoadmapTopicBySlug(
  slug: string
): Promise<APIResponse<GetTopicBySlugOutput | null>> {
  try {
    const { session } = await getSession();

    if (!session || !session.tokens?.access_token) {
      return {
        success: false,
        message: ERROR_MESSAGES[CurionaErrorCodes.UNAUTHORIZED],
        code: CurionaErrorCodes.UNAUTHORIZED,
        data: null,
      };
    }

    const roadmapService = new RoadmapService(session.tokens.access_token);
    return await roadmapService.getRoadmapTopicBySlug(slug);
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

export async function markTopicAs({
  slug,
  completed,
}: {
  slug: string;
  completed: boolean;
}): Promise<APIResponse<unknown>> {
  try {
    const { session } = await getSession();

    if (!session || !session.tokens?.access_token) {
      return {
        success: false,
        message: ERROR_MESSAGES[CurionaErrorCodes.UNAUTHORIZED],
        code: CurionaErrorCodes.UNAUTHORIZED,
        data: null,
      };
    }

    const roadmapService = new RoadmapService(session.tokens.access_token);

    if (!completed) {
      return await roadmapService.markTopicAsIncomplete(slug);
    }

    return await roadmapService.markTopicAsFinished(slug);
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
