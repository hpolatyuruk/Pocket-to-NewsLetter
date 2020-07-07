import { Router, Context } from "https://deno.land/x/oak/mod.ts";
import { PocketAPI } from "../services/pocket-api.ts";
import { PocketAPIException } from "./../services/pocket-api.ts";
import { UserPreferencesRepository } from "./../repositories/user-preferences.repository.ts";
import { UserPreferencesDto } from "./../dto/user-preferences.dto.ts";
import { UserPreferences } from "../models/user-preferences.ts";
import { EmailFrequency } from "../enums/email-frequency.enum.ts";
import { CronExpressionBuilder } from "./../services/cron-expression-builder.ts";
import { SortType } from "../enums/sort-type.enum.ts";
import { DayOfWeek } from "../enums/day-of-week.enum.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";
import { ModelMapper } from "../services/model-to-dto-mapper.ts";

const router = new Router();
const pocketAPI = new PocketAPI(Deno.env.get("POCKET_CONSUMER_KEY") as string);
const userPreferencesRepository = new UserPreferencesRepository();

router.get("/", async (ctx: any) => {
  if (
    await ctx.state.session.set("username") !== undefined &&
    await ctx.state.session.get("accessToken") !== undefined
  ) {
    const pocketUserName = await ctx.state.session.set("username");
    const userPreferences = await userPreferencesRepository.getByUserName(
      pocketUserName,
    );
    ctx.render("preferences", userPreferences);
    return;
  }
  await ctx.send({
    root: `${Deno.cwd()}/static`,
    index: "index.html",
  });
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
  ctx.render("preferences", ModelMapper.toDto(preferences));
  return;
});

router.get("/login", async (ctx: any) => {
  const requestToken = await pocketAPI.getRequestToken();
  await ctx.state.session.set("requestToken", requestToken);
  ctx.response.redirect(
    `https://getpocket.com/auth/authorize?` +
      `request_token=${requestToken}` +
      `&redirect_uri=http://localhost:3000/authorize/callback`,
  );
});

router.get("/authorize/callback", async (ctx: any) => {
  try {
    const requestToken = await ctx.state.session.get("requestToken");
    const res = await pocketAPI.getUserAccesstoken(requestToken);
    const username = res.username;
    const accessToken = res.access_token;
    await ctx.state.session.set("username", username);
    await ctx.state.session.set("accessToken", accessToken);
    let userPreferences = await userPreferencesRepository.getByUserName(
      username,
    );
    if (userPreferences) {
      userPreferences.accessToken = accessToken;
      await userPreferencesRepository.update(userPreferences);
      ctx.render("preferences", ModelMapper.toDto(userPreferences));
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
    ctx.render("preferences", dto);
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

  const dto: UserPreferencesDto = (await ctx.request.body()).value;

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
    userPreferences.accessToken = await ctx.state.session.get("accessToken");
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

export default router;
