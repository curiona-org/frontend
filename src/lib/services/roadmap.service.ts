import config from "@/lib/config";
import { APIService } from "@/lib/services/api.service";
import { ListRoadmapsOutput, GenerateRoadmapOutput } from "@/types/api-roadmap";

export class RoadmapService extends APIService {
  constructor() {
    super(config.BACKEND_URL);
  }

  async listCommunityRoadmap() {
    return this.get<ListRoadmapsOutput>("/roadmaps").then((res) => res?.data);
  }

  async listUserRoadmap() {
    return this.get<ListRoadmapsOutput>("/profile/roadmaps").then((res) => res?.data);
  }

  async generateRoadmap(data) {
    return this.post<GenerateRoadmapOutput>("/roadmaps", data).then((res) => res?.data);
  } 
}
