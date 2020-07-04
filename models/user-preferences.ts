import { SortType } from "../enums/sort-type.enum.ts";

export class UserPreferences {
  id: string = "";
  pocketUserName: string = "";
  emailAddress: string = "";
  accessToken: string = "";
  linkCountPerEmail: number = 10;
  cronExpression: string = "";
  sortType: SortType = SortType.Newest;
  subscribed: boolean = false;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
}
