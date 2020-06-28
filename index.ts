import "https://deno.land/x/dotenv/load.ts";
import { UserPreferences } from "./models/user-preferences.ts";
import { UserPreferencesRepository } from "./repositories/user-preferences.repository.ts";

console.log(`App is running on port ${Deno.env.get("APP_PORT")}`);
