import { DayOfWeek } from "../enums/day-of-week.enum.ts";

export class DateUtils {
  public static getThreeLetterDayName(dayOfWeek: DayOfWeek): string {
    let threeLetterDayName: string = "";

    switch (dayOfWeek) {
      case DayOfWeek.Sunday:
        threeLetterDayName = "SUN";
        break;
      case DayOfWeek.Monday:
        threeLetterDayName = "MON";
        break;
      case DayOfWeek.Tuesday:
        threeLetterDayName = "TUE";
        break;
      case DayOfWeek.Wednesday:
        threeLetterDayName = "WED";
        break;
      case DayOfWeek.Thursday:
        threeLetterDayName = "THU";
        break;
      case DayOfWeek.Friday:
        threeLetterDayName = "FRI";
        break;
      case DayOfWeek.Saturday:
        threeLetterDayName = "SAT";
        break;
    }
    return threeLetterDayName;
  }
}
