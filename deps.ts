export {
    Application,
    HttpError,
    Status,
    Router, 
    Context,
    send,
  } from "https://deno.land/x/oak/mod.ts";
export { Client } from "https://deno.land/x/postgres/mod.ts";
export { Session } from "https://deno.land/x/session/mod.ts";
export { v4 } from "https://deno.land/std/uuid/mod.ts";
export { cron } from "https://deno.land/x/deno_cron/cron.ts";
export { sendMail, IRequestBody } from "https://deno.land/x/sendgrid/mod.ts";
export { Html5Entities } from "https://deno.land/x/html_entities@v1.0/mod.js";
import { config } from "https://deno.land/x/dotenv/mod.ts";

export const ENV = config({path: Deno.env.get("APP_ENV") === 'production' ? '.env' : '.env.dev'});
