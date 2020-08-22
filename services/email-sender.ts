import { IEmailSender } from "./email-sender.interface.ts";
import "../deps.ts";
import { sendMail, IRequestBody, ENV } from "../deps.ts";

export class EmailSender implements IEmailSender {
  async send(emailAddress: string, subject: string, htmlContent: string): Promise<void> {

    let mail: IRequestBody = {
        personalizations: [
        {
            subject: "SendGrid Test Email",
            to: [{ name: "Pocket Digest", email: emailAddress }],
        },
        ],
        from: { email: ENV.SENDER_EMAIL },
        content: [
        { type: "text/html", value: htmlContent },
        ],
    };
    await sendMail(mail, { apiKey: ENV.SENDGRID_API_KEY });
  }
}
