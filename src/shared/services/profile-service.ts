import config from "@/shared/config";
import { APIService } from "@/shared/services/api-service";

export type GetProfileOutput = {
  id: number;
  method: string;
  email: string;
  name: string;
  avatar: string;
  joined_at: Date;
};

export type UpdateProfileOutput = {
  name: string;
  avatar: string;
  updated_at: Date;
};

export class ProfileService extends APIService {
  constructor() {
    super(config.backendURL);
  }

  async profile() {
    return this.get<GetProfileOutput>("/profile");
  }

  async updateProfile(name: string) {
    return this.patch("/profile", { name });
  }
}
