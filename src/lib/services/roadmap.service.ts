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

export class RoadmapService extends APIService {
  constructor() {
    super(config.BACKEND_URL);
  }

  async generateRoadmap(data: GenerateRoadmapInput) {
    return this.post<GenerateRoadmapOutput>("/roadmaps", data).then(
      (res) => res?.data
    );
  }

  async getRoadmapBySlug(slug: string) {
    const response = await this.get<GetRoadmapOutput>(`/roadmaps/${slug}`);
    return response.data;
  }

  async regenerateRoadmap(slug: string, data: RegenerateRoadmapInput) {
    return this.patch<GenerateRoadmapOutput>(
      `/roadmaps/${slug}/regenerate`,
      data
    ).then((res) => res?.data);
  }

  async deleteRoadmapBySlug(slug: string) {
    return this.delete(`/roadmaps/${slug}`).then((res) => res?.data);
  }

  async getRoadmapTopicBySlug(slug: string) {
    const response = await this.get<GetTopicBySlugOutput>(
      `/roadmaps/topic/${slug}`
    );
    return response.data;
  }

  async markTopicAsFinished(slug: string) {
    return this.patch(`/roadmaps/topic/${slug}/finish`).then(
      (res) => res?.data
    );
  }

  async markTopicAsIncomplete(slug: string) {
    return this.patch(`/roadmaps/topic/${slug}/incomplete`).then(
      (res) => res?.data
    );
  }

  async listUserRoadmap(page = 1, limit = 6) {
    return this.get<ListRoadmapsOutput>(
      `/profile/roadmaps?page=${page}&limit=${limit}`
    ).then((res) => res?.data);
  }

  async listUserFinishedRoadmap(page = 1, limit = 6) {
    return this.get<ListRoadmapsOutput>(
      `/profile/roadmaps/finished?page=${page}&limit=${limit}`
    ).then((res) => res?.data);
  }

  async listUserOnProgressRoadmap(page = 1, limit = 6) {
    return this.get<ListRoadmapsOutput>(
      `/profile/roadmaps/on-progress?page=${page}&limit=${limit}`
    ).then((res) => res?.data);
  }

  async listCommunityRoadmap(
    page = 1,
    limit = 9,
    search = "",
    orderBy: "oldest" | "newest" = "oldest"
  ) {
    return this.get<ListRoadmapsOutput>(
      `/roadmaps?page=${page}&limit=${limit}&search=${search}&order_by=${orderBy}`
    ).then((res) => res?.data);
  }

  async listBookmarkedRoadmaps(page = 1, limit = 6) {
    return this.get<ListRoadmapsOutput>(
      `/bookmarks?page=${page}&limit=${limit}`
    ).then((res) => res?.data);
  }

  async bookmarkRoadmap(slug: string) {
    return this.post(`/roadmaps/${slug}/bookmark`).then((res) => res?.data);
  }

  async unbookmarkRoadmap(slug: string) {
    return this.delete(`/roadmaps/${slug}/bookmark`);
  }

  async rateRoadmap(slug: string, rating: number, comment: string) {
    return this.post(`/roadmaps/${slug}/rating`, { rating, comment }).then(
      (res) => res?.data
    );
  }

  async promptModeration(prompt: string) {
    return this.post<RoadmapModerationOuput>(`/roadmaps/moderation`, {
      prompt,
    }).then((res) => res?.data);
  }
}
