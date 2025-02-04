import config from "../config";
import { API } from "./api";

export type AuthOutput = {
  created: boolean;
  token: string;
  account: {
    id: string;
    email: string;
    name: string;
    avatar: string;
    joinedAt: string;
  };
};

export class AuthService extends API {
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

  async profile() {
    return this.get<AuthOutput["account"]>("/auth/profile");
  }
}
