import config from "@/shared/config";
import { APIService } from "@/shared/services/api-service";
import { AuthOutput } from "@/types/api-auth";

export class AuthService extends APIService {
  constructor() {
    super(config.backendURL);
  }

  async loginEmailPassword(email: string, password: string) {
    return this.post<AuthOutput>("/auth", { email, password })
      .then((res) => res?.data)
      .catch((err) => {
        throw err?.response?.data;
      });
  }

  async loginOAuth(oauthToken: string) {
    return this.post<AuthOutput>("/auth", { oauth_token: oauthToken })
      .then((res) => res?.data)
      .catch((err) => {
        throw err?.response;
      });
  }

  async register(name: string, email: string, password: string) {
    return this.post<AuthOutput>("/auth", { name, email, password })
      .then((res) => res?.data)
      .catch((err) => {
        throw err?.response?.data;
      });
  }

  async refresh() {
    return this.post<AuthOutput>("/auth/refresh")
      .then((res) => res?.data)
      .catch((err) => {
        throw err?.response?.data;
      });
  }
}
