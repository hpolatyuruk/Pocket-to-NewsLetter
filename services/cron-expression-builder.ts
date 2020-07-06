import { DayOfWeek } from "../enums/day-of-week.enum.ts";

export const EVERY_CHAR = "*";
export const DEFAULT_HOUR = "6";

export class CronExpressionBuilder {
  private secondPart: string = EVERY_CHAR;
  private minutePart: string = EVERY_CHAR;
  private hourPart: string = EVERY_CHAR;
  private dayOfMonthPart: string = EVERY_CHAR;
  private monthPart: string = EVERY_CHAR;
  private dayOfWeekPart: string = EVERY_CHAR;

  private constructor(private readonly cronExpression: string) {
    const parts = cronExpression.split(" ");

    this.secondPart = parts[0];
    this.minutePart = parts[1];
    this.hourPart = parts[2];
    this.dayOfMonthPart = parts[3];
    this.monthPart = parts[4];
    this.dayOfWeekPart = parts[5];
  }

  public static createNew(): CronExpressionBuilder {
    const cronExpression: string = this.buildExpressionString(
      EVERY_CHAR,
      EVERY_CHAR,
      EVERY_CHAR,
      EVERY_CHAR,
      EVERY_CHAR,
      EVERY_CHAR,
    );
    return new CronExpressionBuilder(cronExpression);
  }

  public daily(): CronExpressionBuilder {
    this.secondPart = "0";
    this.minutePart = "0";
    this.hourPart = DEFAULT_HOUR;
    this.dayOfMonthPart = EVERY_CHAR;
    this.monthPart = EVERY_CHAR;
    this.dayOfWeekPart = "?";
    return this;
  }

  public everyNDay(nDay: number): CronExpressionBuilder {
    this.secondPart = "0";
    this.minutePart = "0";
    this.hourPart = DEFAULT_HOUR;
    this.dayOfMonthPart = nDay === 1 ? EVERY_CHAR : `*/${nDay}`;
    this.monthPart = EVERY_CHAR;
    this.dayOfWeekPart = "?";
    return this;
  }

  public weekly(dayOfWeek: DayOfWeek): CronExpressionBuilder {
    this.secondPart = "0";
    this.minutePart = "0";
    this.hourPart = DEFAULT_HOUR;
    this.dayOfMonthPart = EVERY_CHAR;
    this.monthPart = EVERY_CHAR;
    this.dayOfWeekPart = dayOfWeek;
    return this;
  }

  public build(): string {
    return CronExpressionBuilder.buildExpressionString(
      this.secondPart,
      this.minutePart,
      this.hourPart,
      this.dayOfMonthPart,
      this.monthPart,
      this.dayOfWeekPart,
    );
  }

  // region private(s)

  private static buildExpressionString(
    second: string,
    minute: string,
    hour: string,
    dayOfMonth: string,
    month: string,
    dayOfWeek: string,
  ): string {
    return `${second} ${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
  }

  //endregion
}
