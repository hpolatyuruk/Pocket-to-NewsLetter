import { EmailFrequency } from "../enums/email-frequency.enum.ts";
import { SortType } from "../enums/sort-type.enum.ts";
import { DayOfWeek } from "../enums/day-of-week.enum.ts";

export class UserPreferencesDto {
  id: string = "";
  pocketUserName: string = "";
  emailAddress: string = "";
  linkCountPerEmail: number = 10;
  emailFrequency: EmailFrequency = EmailFrequency.Daily;
  weeklyOnDay: DayOfWeek = DayOfWeek.Monday;
  sortType: SortType = SortType.Newest;
  subscribed: boolean = false;
}
