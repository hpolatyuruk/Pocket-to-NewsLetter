import { SortType } from "../enums/sort-type.enum.ts";

export class UserPreferences {
  pocketUserName: string = "";
  emailAddress: string = "";
  accessToken: string = "";
  linkCountPerDigest: number = 10;
  cronExpression: string = "";
  sortType: SortType = SortType.Newest;
  subscribed: boolean = false;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
}
