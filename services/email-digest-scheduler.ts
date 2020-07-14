import { cron } from "https://deno.land/x/deno_cron/cron.ts";
import { PocketAPI } from "./pocket-api.ts";
import { IEmailDigestScheduler } from "./email-digest-scheduler.interface.ts";
import { IEmailSender } from "./email-sender.interface.ts";
import { UserPreferences } from "./../models/user-preferences.ts";
import { IHtmlEmailGenerator } from "./html-email-generator.interface.ts";

export class EmailDigestScheduler implements IEmailDigestScheduler {
  constructor(
    private readonly pocketAPI: PocketAPI,
    private readonly emailSender: IEmailSender,
    private readonly htmlEmailGenerator: IHtmlEmailGenerator,
  ) {}

  schedule(
    preferences: UserPreferences,
  ): void {

    if (preferences.subscribed === false) {
      console.log(
        `User ${preferences.emailAddress} unsubscribed. Skipped scheduling.`,
      );
      return;
    }

    cron(preferences.cronExpression, async () => {
      const links = await this.pocketAPI.getLinks(
        preferences.accessToken,
        preferences.linkCountPerEmail,
        preferences.sortType,
      );
      if (!links || links.length === 0) return;
      const htmlContent = await this.htmlEmailGenerator.generate(preferences, links);
      await this.emailSender.send(preferences.emailAddress, "Test Subject", htmlContent);
    });
  }
}
