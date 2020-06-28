export class UserPreferences {
  pocketUserName: string = "";
  emailAddress: string = "";
  accessToken: string = "";
  linkCountPerDigest: number = 10;
  cronExpression: string = "";
  subscribed: boolean = false;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
}
