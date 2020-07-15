import { IEmailSender } from "./email-sender.interface.ts";
import { Link } from "../dto/link.dto.ts";
import { SmtpClient } from "https://deno.land/x/smtp/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
import { sendMail, IRequestBody } from "https://deno.land/x/sendgrid/mod.ts";

export class EmailSender implements IEmailSender {
  async send(emailAddress: string, subject: string, htmlContent: string): Promise<void> {

    const { 
      SMTP_SERVER, 
      SMTP_PORT, 
      SMTP_USERNAME, 
      SMTP_PASSWORD,
      SENDGRID_API_KEY } = Deno.env.toObject();

    // const connectConfig: any = {
    //   hostname: SMTP_SERVER,
    //   port: Number(SMTP_PORT),
    //   username: SMTP_USERNAME,
    //   password: SMTP_PASSWORD,
    // };

    // const client = new SmtpClient();
    // await client.connectTLS(connectConfig);

    // await client.send({
    //   from: SMTP_USERNAME,
    //   to: emailAddress,
    //   subject: subject,
    //   content: htmlContent,
    // });

    // await client.close();

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
    
    let response = await sendMail(mail, { apiKey: SENDGRID_API_KEY });
    console.log(response);
  }
}
