
export class TemplateEngine{
    async render(ctx: any, path: string, data?: object): Promise<void>{
        let html = await Deno.readTextFile(path);
        for (const [key, value] of Object.entries(data ?? {})) {
            html = html.replace(`{{${key}}}`, value);
        }
        ctx.response.body = html;
        ctx.response.headers.set("Content-Type", "text/html; charset=utf-8");
    }
    
    replace(template: string, data: object): string{
        let replacedTemplate = template;
        for (const [key, value] of Object.entries(data)) {
            replacedTemplate = replacedTemplate.replace(`{{${key}}}`.replace(' ', ''), value);
        }
        return replacedTemplate;
    }
}