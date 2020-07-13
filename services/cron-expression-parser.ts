import { DayOfWeek } from "../enums/day-of-week.enum.ts";
import { EmailFrequency } from "../enums/email-frequency.enum.ts";
import { EVERY_CHAR, DEFAULT_HOUR } from "./cron-expression-builder.ts";

const DAY_OF_WEEK_NAME_LENGTH = 1;

export class CronExpressionParser {
  private readonly cronExpression: string;

  constructor(cronExpression: string) {
    this.cronExpression = cronExpression;
  }

  parseEmailFrequency(): EmailFrequency {
    let frequency: EmailFrequency = EmailFrequency.Daily;
    switch (this.cronExpression) {
      case `0 0 ${DEFAULT_HOUR} ${EVERY_CHAR} ${EVERY_CHAR} ?`:
        frequency = EmailFrequency.Daily;
        break;
      case `0 0 ${DEFAULT_HOUR} */1 ${EVERY_CHAR} ?`:
        frequency = EmailFrequency.Daily;
        break;
      case `0 0 ${DEFAULT_HOUR} */2 ${EVERY_CHAR} ?`:
        frequency = EmailFrequency.Every2Days;
        break;
      case `0 0 ${DEFAULT_HOUR} */3 ${EVERY_CHAR} ?`:
        frequency = EmailFrequency.Every3Days;
        break;
      case `0 0 ${DEFAULT_HOUR} */4 ${EVERY_CHAR} ?`:
        frequency = EmailFrequency.Every4Days;
        break;
      case `0 0 ${DEFAULT_HOUR} */5 ${EVERY_CHAR} ?`:
        frequency = EmailFrequency.Every5Days;
        break;
      case `0 0 ${DEFAULT_HOUR} */6 ${EVERY_CHAR} ?`:
        frequency = EmailFrequency.Every6Days;
        break;
      case `0 0 ${DEFAULT_HOUR} ${EVERY_CHAR} ${EVERY_CHAR} ${DayOfWeek.Monday}`:
      case `0 0 ${DEFAULT_HOUR} ${EVERY_CHAR} ${EVERY_CHAR} ${DayOfWeek.Tuesday}`:
      case `0 0 ${DEFAULT_HOUR} ${EVERY_CHAR} ${EVERY_CHAR} ${DayOfWeek.Wednesday}`:
      case `0 0 ${DEFAULT_HOUR} ${EVERY_CHAR} ${EVERY_CHAR} ${DayOfWeek.Thursday}`:
      case `0 0 ${DEFAULT_HOUR} ${EVERY_CHAR} ${EVERY_CHAR} ${DayOfWeek.Friday}`:
      case `0 0 ${DEFAULT_HOUR} ${EVERY_CHAR} ${EVERY_CHAR} ${DayOfWeek.Saturday}`:
      case `0 0 ${DEFAULT_HOUR} ${EVERY_CHAR} ${EVERY_CHAR} ${DayOfWeek.Sunday}`:
        frequency = EmailFrequency.Weekly;
        break;
    }
    return frequency;
  }

  parseWeeklyOnDay(): DayOfWeek {
    const dayOfWeekAsString = this.cronExpression.substring(
      this.cronExpression.length - DAY_OF_WEEK_NAME_LENGTH,
    );
    return Number(dayOfWeekAsString) as DayOfWeek
  }
}
