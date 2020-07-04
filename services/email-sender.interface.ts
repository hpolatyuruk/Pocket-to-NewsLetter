import { Link } from "../dto/link.dto.ts";

export interface IEmailSender {
  send(emailAddress: string, links: Link[]): Promise<void>;
}
