import { UserPreferences } from "./../models/user-preferences.ts";
import { UserPreferencesDto } from "../dto/user-preferences.dto.ts";
import { CronExpressionParser } from "./cron-expression-parser.ts";
import { DayOfWeek } from "../enums/day-of-week.enum.ts";
import { EmailFrequency } from "../enums/email-frequency.enum.ts";

export class ModelMapper {
  static toDto(userPreferences: UserPreferences) {
    const parser = new CronExpressionParser(userPreferences.cronExpression);
    const dto = new UserPreferencesDto();
    dto.id = userPreferences.id;
    dto.emailAddress = userPreferences.emailAddress;
    dto.emailFrequency = parser.parseEmailFrequency();
    dto.linkCountPerEmail = userPreferences.linkCountPerEmail;
    dto.pocketUserName = userPreferences.pocketUserName;
    dto.sortType = userPreferences.sortType;
    dto.subscribed = userPreferences.subscribed;
    dto.weeklyOnDay = DayOfWeek.Monday;
    if (dto.emailFrequency === EmailFrequency.Weekly) {
      dto.weeklyOnDay = parser.parseWeeklyOnDay();
    }
    return dto;
  }
}
