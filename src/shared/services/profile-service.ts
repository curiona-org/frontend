import config from "@/shared/config";
import { APIService } from "@/shared/services/api-service";
import { GetProfileOutput, UpdateProfileOutput } from "@/types/api-profile";

export class ProfileService extends APIService {
  constructor() {
    super(config.backendURL);
  }

  async profile() {
    return this.get<GetProfileOutput>("/profile")
      .then((res) => res?.data)
      .catch((err) => {
        throw err?.response?.data;
      });
  }

  async updateProfile(name: string) {
    return this.patch<UpdateProfileOutput>("/profile", { name })
      .then((res) => res?.data)
      .catch((err) => {
        throw err?.response?.data;
      });
  }
}
