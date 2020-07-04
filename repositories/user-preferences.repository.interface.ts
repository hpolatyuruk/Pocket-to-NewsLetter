import { UserPreferences } from "./../models/user-preferences.ts";

export interface IUserPreferencesRepository {
  create(preferences: UserPreferences): Promise<void>;
  update(preferences: UserPreferences): Promise<UserPreferences>;
  delete(preferences: UserPreferences): Promise<void>;
  getByUserName(pocketUserName: string): Promise<UserPreferences>;
  getById(id: string): Promise<UserPreferences>;
  getAll(): Promise<UserPreferences[]>;
}
