import { Link } from "../dto/link.dto.ts";

export interface IEmailSender {
  send(emailAddress: string, subject: string, htmlContent: string): Promise<void>;
}
