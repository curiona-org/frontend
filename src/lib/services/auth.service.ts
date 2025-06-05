import { apiClient } from "@/lib/services/api.service";
import { AuthOutput, AuthRefreshOutput } from "@/types/api-auth";

export class AuthService {
  async loginEmailPassword(data: { email: string; password: string }) {
    return apiClient
      .post<AuthOutput>("/auth", data, { withCredentials: true })
      .then((res) => res?.data);
  }

  async loginOAuth(oauthToken: string) {
    return apiClient
      .post<AuthOutput>("/auth", { oauth_token: oauthToken })
      .then((res) => res?.data);
  }

  async register(data: { name: string; email: string; password: string }) {
    return apiClient.post<AuthOutput>("/auth", data).then((res) => res?.data);
  }

  async refresh(token: string) {
    return apiClient
      .post<AuthRefreshOutput>(
        "/auth/refresh",
        {},
        {
          withCredentials: true,
          headers: {
            Cookie: `refresh_token=${token}`,
          },
        }
      )
      .then((res) => res?.data);
  }
}
