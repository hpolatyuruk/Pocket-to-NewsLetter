import { IHtmlEmailGenerator } from "./html-email-generator.interface.ts";
import { UserPreferences } from "../models/user-preferences.ts";
import { Link } from "../dto/link.dto.ts";
import { EmailTemplateDto } from "../dto/email-template.dto.ts";
import { engineFactory } from "https://deno.land/x/view_engine/mod.ts";
import { Html5Entities } from "https://deno.land/x/html_entities@v1.0/mod.js";

export class HtmlEmailGenerator implements IHtmlEmailGenerator {

    private readonly handlebarsEngine: any;

    constructor(){
        this.handlebarsEngine = engineFactory.getHandlebarsEngine();
    }

    async generate(userPreferences: UserPreferences, links: Link[]): Promise<string>{
        const emailTemplateDto = new EmailTemplateDto();
        emailTemplateDto.emailAddress = userPreferences.emailAddress;
        emailTemplateDto.linkCountPerEmail = userPreferences.linkCountPerEmail;
        emailTemplateDto.userId = userPreferences.id;
        emailTemplateDto.issueDateString = new Date().toDateString();
        emailTemplateDto.nextIssueDateString = new Date().toDateString();

        let rows: string = '';
        const rowTemplate = await Deno.readTextFile(`${Deno.cwd()}/static/email-template/test-row.html`);
        let rowNo = 1;
        for(const link of links){
            const url = new URL(link.url);
            const renderedRow = this.handlebarsEngine(rowTemplate, {
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
        const htmlTemplate = await Deno.readTextFile(`${Deno.cwd()}/static/email-template/test.html`);
        return Html5Entities.decode(this.handlebarsEngine(htmlTemplate, emailTemplateDto));
    }
}