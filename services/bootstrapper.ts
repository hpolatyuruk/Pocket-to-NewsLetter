import { PocketAPI } from "./pocket-api.ts";
import { EmailSender } from "./email-sender.ts";
import { EmailDigestScheduler } from "./email-digest-scheduler.ts";
import { UserPreferencesRepository } from "../repositories/user-preferences.repository.ts";
import { HtmlEmailGenerator } from "./html-email-generator.ts";

export class AppBootstrapper {
  private readonly consumerKey: string;
  private readonly pocketAPI: PocketAPI;
  private readonly emailSender: EmailSender;
  private readonly scheduler: EmailDigestScheduler;
  private readonly htmlEmailGenerator: HtmlEmailGenerator;
  private readonly userPreferencesRepository: UserPreferencesRepository;

  constructor(consumerKey: string) {
    this.consumerKey = consumerKey;
    this.pocketAPI = new PocketAPI(consumerKey);
    this.emailSender = new EmailSender();
    this.htmlEmailGenerator = new HtmlEmailGenerator();
    this.scheduler = new EmailDigestScheduler(this.pocketAPI, this.emailSender, this.htmlEmailGenerator);
    this.userPreferencesRepository = new UserPreferencesRepository();
  }

  async start(): Promise<void> {
    const preferences = await this.userPreferencesRepository.getAll();
    for (const preference of preferences) {
      this.scheduler.schedule(preference);
    }
  }
}
