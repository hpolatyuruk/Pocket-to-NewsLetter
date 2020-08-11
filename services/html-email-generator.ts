import { IHtmlEmailGenerator } from "./html-email-generator.interface.ts";
import { UserPreferences } from "../models/user-preferences.ts";
import { Link } from "../dto/link.dto.ts";
import { EmailTemplateDto } from "../dto/email-template.dto.ts";
// import { engineFactory } from "../deps.ts";
import { Html5Entities } from "../deps.ts";
import { TemplateEngine } from "./template-engine.ts";

export class HtmlEmailGenerator implements IHtmlEmailGenerator {

    //private readonly handlebarsEngine: any;
    private readonly templateEngine: TemplateEngine;

    constructor(){
        //this.handlebarsEngine = engineFactory.getHandlebarsEngine();
        this.templateEngine = new TemplateEngine();
    }

    async generate(userPreferences: UserPreferences, links: Link[]): Promise<string>{
        const emailTemplateDto = new EmailTemplateDto();
        emailTemplateDto.emailAddress = userPreferences.emailAddress;
        emailTemplateDto.linkCountPerEmail = userPreferences.linkCountPerEmail;
        emailTemplateDto.userId = userPreferences.id;
        emailTemplateDto.issueDateString = new Date().toDateString();
        emailTemplateDto.nextIssueDateString = new Date().toDateString();

        let rows: string = '';
        const rowTemplate = await Deno.readTextFile(`${Deno.cwd()}/static/email-template/template-row.html`);
        let rowNo = 1;
        for(const link of links){
            const url = new URL(link.url);
            const renderedRow = this.templateEngine.replace(rowTemplate, {
                rowNo: rowNo,
                url: link.url,
                title: link.title ? link.title : link.url,
                hostname: url.hostname,
                protocol: url.protocol,
                savedOn: link.savedOn.toDateString(),
            });
            rows += renderedRow;
            rowNo++;
        }

        emailTemplateDto.rows = rows;
        const htmlTemplate = await Deno.readTextFile(`${Deno.cwd()}/static/email-template/template.html`);
        return Html5Entities.decode(this.templateEngine.replace(htmlTemplate, emailTemplateDto));
    }
}