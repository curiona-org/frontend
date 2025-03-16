import { Account } from "./account";

export type AuthOutput = {
  created: boolean;
  access_token: string;
  access_token_expires_at: string;
  account: Account;
};
