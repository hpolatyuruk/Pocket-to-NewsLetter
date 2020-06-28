import { Link } from "../models/link.ts";

export interface IEmailSender{
    send(emailAddress: string, links: Link[]): Promise<void>;
}