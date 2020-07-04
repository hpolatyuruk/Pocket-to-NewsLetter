import { cron } from "https://deno.land/x/deno_cron/cron.ts";
import { PocketAPI } from "./pocket-api.ts";
import { IEmailDigestScheduler } from "./email-digest-scheduler.interface.ts";
import { IEmailSender } from "./email-sender.interface.ts";
import { UserPreferences } from "./../models/user-preferences.ts";

export class EmailDigestScheduler implements IEmailDigestScheduler {
  constructor(
    private readonly pocketAPI: PocketAPI,
    private readonly emailSender: IEmailSender,
  ) {}

  schedule(
    preferences: UserPreferences,
  ): void {
    if (preferences.subscribed === false) {
      console.log(
        `User ${preferences.emailAddress} unsubscribed. Skipped scheduling.`,
      );
    }

    cron(preferences.cronExpression, async () => {
      const links = await this.pocketAPI.getLinks(
        preferences.accessToken,
        preferences.linkCountPerEmail,
        preferences.sortType,
      );
      if (!links || links.length === 0) return;
      await this.emailSender.send(preferences.emailAddress, links);
    });
  }
}
