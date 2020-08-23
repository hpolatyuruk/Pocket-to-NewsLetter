
export class TemplateEngine{
    async render(ctx: any, path: string, data?: object): Promise<void>{
        ctx.response.body = this.replace(await Deno.readTextFile(path), data ?? {});
        ctx.response.headers.set("Content-Type", "text/html; charset=utf-8");
    }
    
    replace(template: string, data: object): string{
        let replacedTemplate = template;
        for (const [key, value] of Object.entries(data)) {
            replacedTemplate = replacedTemplate.replaceAll(`{{${key}}}`, value);
        }
        return replacedTemplate;
    }
}