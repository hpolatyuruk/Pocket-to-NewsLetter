import { v4, Router, Context, ENV } from "../deps.ts";
import { PocketAPI } from "../services/pocket-api.ts";
import { PocketAPIException } from "./../services/pocket-api.ts";
import { UserPreferencesRepository } from "./../repositories/user-preferences.repository.ts";
import { UserPreferencesDto } from "./../dto/user-preferences.dto.ts";
import { UserPreferences } from "../models/user-preferences.ts";
import { EmailFrequency } from "../enums/email-frequency.enum.ts";
import { CronExpressionBuilder } from "./../services/cron-expression-builder.ts";
import { SortType } from "../enums/sort-type.enum.ts";
import { DayOfWeek } from "../enums/day-of-week.enum.ts";
import { ModelMapper } from "../services/model-to-dto-mapper.ts";
import { TemplateEngine } from "../services/template-engine.ts";

const router = new Router();
const pocketAPI = new PocketAPI(ENV.POCKET_CONSUMER_KEY as string);
const userPreferencesRepository = new UserPreferencesRepository();
const templateEngine = new TemplateEngine();

router.get("/", async (ctx: any) => {
  if (
    await ctx.session.get("username") !== undefined &&
    await ctx.session.get("accessToken") !== undefined
  ) {
    const pocketUserName = await ctx.session.get("username");
    const userPreferences = await userPreferencesRepository.getByUserName(
      pocketUserName,
    );
    if(userPreferences){
      await templateEngine.render(ctx, `${Deno.cwd()}/static/preferences.html`, ModelMapper.toDto(userPreferences));
      return;
    }
  }
  await templateEngine.render(ctx, `${Deno.cwd()}/static/index.html`);
});

router.get("/preferences", async (ctx: any) => {
  const id = ctx.request.url.searchParams.get("token");

  if (!id) {
    ctx.response.status = 400;
    ctx.response.bod = "400 Bad Request!";
    return;
  }

  const preferences = await userPreferencesRepository.getById(id);
  if (!preferences) {
    ctx.response.redirect("/");
    return;
  }
  await templateEngine.render(ctx, `${Deno.cwd()}/static/preferences.html`, ModelMapper.toDto(preferences));
  return;
});

router.get("/login", async (ctx: any) => {
  const requestToken = await pocketAPI.getRequestToken();
  await ctx.session.set("requestToken", requestToken);
  ctx.response.redirect(
    `https://getpocket.com/auth/authorize?` +
      `request_token=${requestToken}` +
      `&redirect_uri=http://localhost:8000/authorize/callback`,
  );
});

router.get("/authorize/callback", async (ctx: any) => {
  try {
    const requestToken = await ctx.session.get("requestToken");
    const res = await pocketAPI.getUserAccesstoken(requestToken);
    const username = res.username;
    const accessToken = res.access_token;
    await ctx.session.set("username", username);
    await ctx.session.set("accessToken", accessToken);
    let userPreferences = await userPreferencesRepository.getByUserName(
      username,
    );
    if (userPreferences) {
      userPreferences.accessToken = accessToken;
      await userPreferencesRepository.update(userPreferences);
      await templateEngine.render(ctx, `${Deno.cwd()}/static/preferences.html`, ModelMapper.toDto(userPreferences));
      return;
    }
    const dto = new UserPreferencesDto();
    dto.pocketUserName = username;
    dto.emailAddress = "";
    dto.emailFrequency = EmailFrequency.Daily;
    dto.linkCountPerEmail = 10;
    dto.sortType = SortType.Newest;
    dto.subscribed = true;
    dto.weeklyOnDay = DayOfWeek.Monday;
    await templateEngine.render(ctx, `${Deno.cwd()}/static/preferences.html`, dto);
  } catch (e) {
    if (e instanceof PocketAPIException) {
      if (e.code === 182) { // User rejected code.
        ctx.render("rejected", {});
        return;
      }
    }
    ctx.render("error", {});
  }
});

router.post("/save-preferences", async (ctx: any) => {
  if (!ctx.request.hasBody) {
    ctx.response.status = 400;
    ctx.response.body = {
      success: false,
      msg: "No data",
    };
    return;
  }

  const result = ctx.request.body({ type: "json" });
  const dto: UserPreferencesDto = await result.value;
  
  if (!dto.pocketUserName || dto.pocketUserName.trim() === "") {
    ctx.response.status = 400;
    ctx.response.body = {
      success: false,
      msg: "Pocket user name can not be empty!",
    };
    return;
  }

  let cronExpression = "";
  const cronExpressionBuilder = CronExpressionBuilder.createNew();

  switch (dto.emailFrequency) {
    case EmailFrequency.Daily:
      cronExpression = cronExpressionBuilder.daily().build();
      break;
    case EmailFrequency.Weekly:
      cronExpression = cronExpressionBuilder.weekly(dto.weeklyOnDay).build();
      break;
    case EmailFrequency.Every2Days:
      cronExpression = cronExpressionBuilder.everyNDay(2).build();
      break;
    case EmailFrequency.Every3Days:
      cronExpression = cronExpressionBuilder.everyNDay(3).build();
      break;
    case EmailFrequency.Every4Days:
      cronExpression = cronExpressionBuilder.everyNDay(4).build();
      break;
    case EmailFrequency.Every5Days:
      cronExpression = cronExpressionBuilder.everyNDay(5).build();
      break;
    case EmailFrequency.Every6Days:
      cronExpression = cronExpressionBuilder.everyNDay(6).build();
      break;
    default:
      cronExpression = cronExpressionBuilder.daily().build();
  }

  let exists = true;
  let userPreferences = await userPreferencesRepository.getByUserName(
    dto.pocketUserName,
  );

  if (!userPreferences) {
    exists = false;
    userPreferences = new UserPreferences();
    userPreferences.id = v4.generate();
    userPreferences.accessToken = await ctx.session.get("accessToken");
  }
  userPreferences.pocketUserName = dto.pocketUserName;
  userPreferences.createdAt = new Date();
  userPreferences.emailAddress = dto.emailAddress;
  userPreferences.linkCountPerEmail = dto.linkCountPerEmail;
  userPreferences.sortType = dto.sortType;
  userPreferences.subscribed = dto.subscribed;
  userPreferences.cronExpression = cronExpression;

  if (exists) {
    userPreferences.updatedAt = new Date();
    await userPreferencesRepository.update(userPreferences);
  } else {
    userPreferences.createdAt = new Date();
    await userPreferencesRepository.create(userPreferences);
  }

  ctx.response.status = 200;
  ctx.response.body = {
    success: true,
  };
});

router.get("/privacy", async (context: any) => {
  await templateEngine.render(context, `${Deno.cwd()}/static/privacy.html`);
});

router.get("/faq", async (context: any) => {
  await templateEngine.render(context, `${Deno.cwd()}/static/faq.html`);
});

router.get("/favicon.ico", async (context: any) => {
  await context.send({
    root: `${Deno.cwd()}/static/images`,
    index: "favicon.ico",
  });
});

export default router;
