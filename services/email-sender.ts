import { IEmailSender } from "./email-sender.interface.ts";
import { Link } from "../models/link.ts";
import { SmtpClient } from "https://deno.land/x/smtp/mod.ts";
import "https://deno.land/x/dotenv/load.ts";


const client = new SmtpClient();
const { SMTP_SERVER, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD } = Deno.env.toObject();

const connectConfig: any = {
    hostname: SMTP_SERVER,
    port: Number(SMTP_PORT),
    username: SMTP_USERNAME,
    password: SMTP_PASSWORD,
};

export class EmailSender implements IEmailSender {
    async send(emailAddress: string, links: Link[]): Promise<void> {
        await client.connectTLS(connectConfig);
          
        await client.send({
            from: SMTP_USERNAME,
            to: emailAddress,
            subject: "Mail Title",
            content: links[0].url,
        });
          
        await client.close();

       // return new Promise<void> ( 
       //  TODO(sedat) : write reject and resolve functions   );
    }
}

