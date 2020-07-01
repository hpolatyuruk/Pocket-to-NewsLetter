import { UserPreferences } from "./../models/user-preferences.ts";

export interface IEmailDigestScheduler {
  schedule(preferences: UserPreferences): void;
}
