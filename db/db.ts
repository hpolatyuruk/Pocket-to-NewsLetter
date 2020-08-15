import { Client, ENV } from "../deps.ts";

class Database {
  public readonly client: Client;

  constructor() {
    this.client = new Client({
      user: ENV.POSTGRES_USER,
      password: ENV.POSTGRES_PASSWORD,
      database: ENV.POSTGRES_DB,
      hostname: ENV.POSTGRES_HOST,
      port: parseInt(ENV.POSTGRES_PORT as string),
    });
  }
}

export default new Database().client;
