import config from "@/lib/config";
import { APIService } from "@/lib/services/api.service";
import { GetProfileOutput, UpdateProfileOutput } from "@/types/api-profile";

export class ProfileService {
  private token: string;
  private instance: APIService;

  constructor(token: string) {
    this.token = token;
    this.instance = new APIService(
      config.BACKEND_URL || "http://localhost:3000/api"
    );
  }

  async profile() {
    return this.instance
      .get<GetProfileOutput>(
        "/profile",
        {},
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      )
      .then((res) => res?.data);
  }

  async updateProfile(name: string) {
    return this.instance
      .patch<UpdateProfileOutput>(
        "/profile",
        { name },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      )
      .then((res) => res?.data);
  }
}
