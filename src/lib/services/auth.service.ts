import config from "@/lib/config";
import { APIService } from "@/lib/services/api.service";
import { AuthOutput, AuthRefreshOutput } from "@/types/api-auth";

export class AuthService extends APIService {
  constructor() {
    super(config.BACKEND_URL);
  }

  async loginEmailPassword(data: { email: string; password: string }) {
    return this.post<AuthOutput>("/auth", data).then((res) => res?.data);
  }

  async loginOAuth(oauthToken: string) {
    return this.post<AuthOutput>("/auth", { oauth_token: oauthToken }).then(
      (res) => res?.data
    );
  }

  async register(data: { name: string; email: string; password: string }) {
    return this.post<AuthOutput>("/auth", data).then((res) => res?.data);
  }

  async refresh() {
    return this.post<AuthRefreshOutput>("/auth/refresh").then(
      (res) => res?.data
    );
  }
}
