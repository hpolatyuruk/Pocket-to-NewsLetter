import { IEmailSender } from "./email-sender.interface.ts";
import { Link } from "../dto/link.dto.ts";
import "../deps.ts";
import { sendMail, IRequestBody } from "../deps.ts";

export class EmailSender implements IEmailSender {
  async send(emailAddress: string, subject: string, htmlContent: string): Promise<void> {

    const { 
      SMTP_SERVER, 
      SMTP_PORT, 
      SMTP_USERNAME, 
      SMTP_PASSWORD,
      SENDGRID_API_KEY } = Deno.env.toObject();

    let mail: IRequestBody = {
        personalizations: [
        {
            subject: "SendGrid Test Email",
            to: [{ name: "Pocket Digest", email: emailAddress }],
        },
        ],
        from: { email: SMTP_USERNAME },
        content: [
        { type: "text/html", value: htmlContent },
        ],
    };

    await sendMail(mail, { apiKey: SENDGRID_API_KEY });
  }
}
