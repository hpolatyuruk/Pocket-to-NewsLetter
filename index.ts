import "https://deno.land/x/dotenv/load.ts";
import { UserPreferences } from "./models/user-preferences.ts";
import { UserPreferencesRepository } from "./repositories/user-preferences.repository.ts";

console.log(`App is running on port ${Deno.env.get("APP_PORT")}`);

const preferences = new UserPreferences();
preferences.pocketUserName = "hpolatyuruk";
preferences.accessToken = "asd";
preferences.cronExpression = "* * * * *";
preferences.emailAddress = "huseyin@hey.com";
preferences.linkCountPerDigest = 10;
preferences.subscribed = true;

const userPreferencesRepository = new UserPreferencesRepository();
//await userPreferencesRepository.create(preferences);
//preferences.pocketUserName = "amina";
//await userPreferencesRepository.create(preferences);
//preferences.emailAddress = "h.polatyuruk@gmail.com";
//await userPreferencesRepository.update(preferences);

const pref = await userPreferencesRepository.get("hpolatyuruk");
console.log(pref);
console.log(await userPreferencesRepository.getAll());
