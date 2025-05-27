import { apiClient } from "@/lib/services/api.service";
import {
  GenerateRoadmapOutput,
  GetRoadmapOutput,
  ListRoadmapsOutput,
} from "@/types/api-roadmap";
import { GetTopicBySlugOutput } from "@/types/api-topic";

export class RoadmapService {
  async listCommunityRoadmap(
    page = 1,
    limit = 9,
    search = "",
    orderBy: "oldest" | "newest" = "oldest"
  ) {
    let path = `/roadmaps?page=${page}&limit=${limit}&order_by=${orderBy}`;
    if (search) {
      path += `&search=${encodeURIComponent(search)}`;
    }
    return apiClient.get<ListRoadmapsOutput>(path).then((res) => res?.data);
  }

  async listUserRoadmap(page = 1, limit = 6) {
    return apiClient
      .get<ListRoadmapsOutput>(`/profile/roadmaps?page=${page}&limit=${limit}`)
      .then((res) => res?.data);
  }

  async generateRoadmap(data) {
    return apiClient
      .post<GenerateRoadmapOutput>("/roadmaps", data)
      .then((res) => res?.data);
  }

  async getRoadmapBySlug(slug: string) {
    const response = await apiClient.get<GetRoadmapOutput>(
      `/roadmaps/${slug}`,
      {},
      { withCredentials: true }
    );
    return response.data;
  }

  async getRoadmapTopicBySlug(slug: string) {
    const response = await apiClient.get<GetTopicBySlugOutput>(
      `/roadmaps/topic/${slug}`
    );
    return response.data;
  }

  async markTopicAsFinished(slug: string) {
    return apiClient
      .patch(`/roadmaps/topic/${slug}/finish`)
      .then((res) => res?.data);
  }

  async markTopicAsIncomplete(slug: string) {
    return apiClient
      .patch(`/roadmaps/topic/${slug}/incomplete`)
      .then((res) => res?.data);
  }

  async listBookmarkedRoadmaps() {
    return apiClient.get(`/bookmarks`).then((res) => res?.data);
  }

  async bookmarkRoadmap(slug: string) {
    return apiClient
      .post(`/roadmaps/${slug}/bookmark`)
      .then((res) => res?.data);
  }

  async unbookmarkRoadmap(slug: string) {
    return apiClient.delete(`/roadmaps/${slug}/bookmark`);
  }

  async regenerateRoadmap(slug: string) {
    return apiClient
      .patch(`/roadmaps/${slug}/regenerate`)
      .then((res) => res?.data);
  }
}
