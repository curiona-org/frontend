import config from "@/shared/config";
import { APIService } from "@/shared/services/api-service";

export type AuthOutput = {
  created: boolean;
  access_token: string;
  access_token_expires_at: string;
  account: {
    id: string;
    email: string;
    name: string;
    avatar: string;
    joined_at: Date;
  };
};

export class AuthService extends APIService {
  constructor() {
    super(config.backendURL);
  }

  async loginEmailPassword(email: string, password: string) {
    return this.post<AuthOutput>("/auth", { email, password });
  }

  async loginOAuth(oauthToken: string) {
    return this.post<AuthOutput>("/auth", {
      oauth_token: oauthToken,
    });
  }

  async register(name: string, email: string, password: string) {
    return this.post<AuthOutput>("/auth", { name, email, password });
  }

  async refresh() {
    return this.post<AuthOutput>("/auth/refresh");
  }
}
