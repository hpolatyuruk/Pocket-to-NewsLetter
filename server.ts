import "https://deno.land/x/dotenv/load.ts";
import { UserPreferences } from "./models/user-preferences.ts";
import { UserPreferencesRepository } from "./repositories/user-preferences.repository.ts";
import { PocketAPI } from "./services/pocket-api.ts";
import { EmailDigestScheduler } from "./services/email-digest-scheduler.ts";
import { CronExpressionBuilder } from "./services/cron-expression-builder.ts";
import { EmailSender } from "./services/email-sender.ts";

console.log(`App is running on port ${Deno.env.get("APP_PORT")}`);
