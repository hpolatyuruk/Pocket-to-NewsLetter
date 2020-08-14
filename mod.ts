import "./deps.ts";
import {
  Application,
  HttpError,
  Status,
  Session,
  send,
} from "./deps.ts";
import router from "./routes/routes.ts";
import { AppBootstrapper } from "./services/bootstrapper.ts";

const port: number = parseInt(Deno.env.get("APP_PORT") as string);
const consumerKey = Deno.env.get("POCKET_CONSUMER_KEY");

if (!consumerKey) {
  console.log(`Consumer key is undefined. App is terminated;`);
  Deno.exit(1);
}

const bootStrapper = new AppBootstrapper(consumerKey);
const app = new Application();

// Configuring Session for the Oak framework
const session = new Session({ framework: "oak" });
await session.init();

// Adding the Session middleware. Now every context will include a property
// called session that you can use the get and set functions on
app.use(session.use()(session));

// Error handler middleware
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    if (e instanceof HttpError) {
      ctx.response.status = e.status as any;
      if (e.expose) {
        ctx.response.body = `<!DOCTYPE html>
            <html>
              <body>
                <h1>${e.status} - ${e.message}</h1>
              </body>
            </html>`;
      } else {
        ctx.response.body = `<!DOCTYPE html>
            <html>
              <body>
                <h1>${e.status} - ${Status[e.status]}</h1>
              </body>
            </html>`;
      }
    } else if (e instanceof Error) {
      ctx.response.status = 500;
      ctx.response.body = `<!DOCTYPE html>
            <html>
              <body>
                <h1>500 - Internal Server Error</h1>
              </body>
            </html>`;
      console.log("Unhandled Error:", e.message);
      console.log(e.stack);
    }
  }
});

// Static file handler middleware
app.use(async (ctx, next) => {
  const path = ctx.request.url.pathname;
  if (path.startsWith("/static")) {
    await ctx.send({
      root: `${Deno.cwd()}`,
      index: path,
    });
    return;
  }
  await next();
});

app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", async () => {
  console.log(`Server running on port ${port}`);

  await bootStrapper.start();
});

await app.listen({ port });
