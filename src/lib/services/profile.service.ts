import { apiClient } from "@/lib/services/api.service";
import { GetProfileOutput, UpdateProfileOutput } from "@/types/api-profile";

export class ProfileService {
  async profile() {
    return apiClient.get<GetProfileOutput>("/profile").then((res) => res?.data);
  }

  async updateProfile(name: string) {
    return apiClient
      .patch<UpdateProfileOutput>("/profile", { name })
      .then((res) => res?.data);
  }
}
