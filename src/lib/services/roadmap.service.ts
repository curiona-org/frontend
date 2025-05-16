import config from "@/lib/config";
import { APIService } from "@/lib/services/api.service";
import {
  ListRoadmapsOutput,
  GenerateRoadmapOutput,
  GetRoadmapOutput,
} from "@/types/api-roadmap";
import { GetTopicBySlugOutput } from "@/types/api-topic";

export class RoadmapService extends APIService {
  constructor() {
    super(config.BACKEND_URL);
  }

  async listCommunityRoadmap() {
    return this.get<ListRoadmapsOutput>("/roadmaps").then((res) => res?.data);
  }

  async listUserRoadmap() {
    return this.get<ListRoadmapsOutput>("/profile/roadmaps").then(
      (res) => res?.data
    );
  }

  async generateRoadmap(data) {
    return this.post<GenerateRoadmapOutput>("/roadmaps", data).then(
      (res) => res?.data
    );
  }

  async getRoadmapBySlug(slug: string) {
    const response = await this.get<GetRoadmapOutput>(`/roadmaps/${slug}`);
    return response.data;
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
}
