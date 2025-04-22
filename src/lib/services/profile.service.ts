import config from "@/lib/config";
import { APIService } from "@/lib/services/api.service";
import { GetProfileOutput, UpdateProfileOutput } from "@/types/api-profile";

export class ProfileService extends APIService {
  constructor() {
    super(config.BACKEND_URL);
  }

  async profile() {
    return this.get<GetProfileOutput>("/profile").then((res) => res?.data);
  }

  async updateProfile(name: string) {
    return this.patch<UpdateProfileOutput>("/profile", { name }).then(
      (res) => res?.data
    );
  }
}
