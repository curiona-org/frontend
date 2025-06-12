import config from "@/lib/config";
import { APIService } from "@/lib/services/api.service";
import {
  GenerateRoadmapInput,
  GenerateRoadmapOutput,
  GetRoadmapOutput,
  ListRoadmapsOutput,
  RegenerateRoadmapInput,
  RoadmapModerationOuput,
} from "@/types/api-roadmap";
import { GetTopicBySlugOutput } from "@/types/api-topic";

export class RoadmapService {
  private token: string;
  private instance: APIService;

  constructor(token: string) {
    this.token = token;
    this.instance = new APIService(
      config.BACKEND_URL || "http://localhost:3000/api"
    );
  }

  async generateRoadmap(data: GenerateRoadmapInput) {
    return this.instance
      .post<GenerateRoadmapOutput>("/roadmaps", data, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
      .then((res) => res?.data);
  }

  async getRoadmapBySlug(slug: string) {
    const response = await this.instance.get<GetRoadmapOutput>(
      `/roadmaps/${slug}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
    return response.data;
  }

  async regenerateRoadmap(slug: string, data: RegenerateRoadmapInput) {
    return this.instance
      .patch<GenerateRoadmapOutput>(`/roadmaps/${slug}/regenerate`, data, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
      .then((res) => res?.data);
  }

  async deleteRoadmapBySlug(slug: string) {
    return this.instance
      .delete(`/roadmaps/${slug}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
      .then((res) => res?.data);
  }

  async getRoadmapTopicBySlug(slug: string) {
    const response = await this.instance.get<GetTopicBySlugOutput>(
      `/roadmaps/topic/${slug}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
    return response.data;
  }

  async markTopicAsFinished(slug: string) {
    return this.instance
      .patch(`/roadmaps/topic/${slug}/finish`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
      .then((res) => res?.data);
  }

  async markTopicAsIncomplete(slug: string) {
    return this.instance
      .patch(`/roadmaps/topic/${slug}/incomplete`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
      .then((res) => res?.data);
  }

  async listUserRoadmap(page = 1, limit = 6) {
    return this.instance
      .get<ListRoadmapsOutput>(
        `/profile/roadmaps?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      )
      .then((res) => res?.data);
  }

  async listUserFinishedRoadmap(page = 1, limit = 6) {
    return this.instance
      .get<ListRoadmapsOutput>(
        `/profile/roadmaps/finished?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      )
      .then((res) => res?.data);
  }

  async listUserOnProgressRoadmap(page = 1, limit = 6) {
    return this.instance
      .get<ListRoadmapsOutput>(
        `/profile/roadmaps/on-progress?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      )
      .then((res) => res?.data);
  }

  async listCommunityRoadmap(
    page = 1,
    limit = 9,
    search = "",
    orderBy: "oldest" | "newest" = "oldest"
  ) {
    return this.instance
      .get<ListRoadmapsOutput>(
        `/roadmaps?page=${page}&limit=${limit}&search=${search}&order_by=${orderBy}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      )
      .then((res) => res?.data);
  }

  async listBookmarkedRoadmaps(page = 1, limit = 6) {
    return this.instance
      .get<ListRoadmapsOutput>(`/bookmarks?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
      .then((res) => res?.data);
  }

  async bookmarkRoadmap(slug: string) {
    return this.instance
      .post(`/roadmaps/${slug}/bookmark`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
      .then((res) => res?.data);
  }

  async unbookmarkRoadmap(slug: string) {
    return this.instance
      .delete(`/roadmaps/${slug}/bookmark`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
      .then((res) => res?.data);
  }

  async rateRoadmap(slug: string, rating: number, comment: string) {
    return this.instance
      .post(
        `/roadmaps/${slug}/rating`,
        { rating, comment },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      )
      .then((res) => res?.data);
  }

  async promptModeration(prompt: string) {
    return this.instance
      .post<RoadmapModerationOuput>(
        `/roadmaps/moderation`,
        {
          prompt,
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      )
      .then((res) => res?.data);
  }
}
