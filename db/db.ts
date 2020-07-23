import { Client } from "../deps.ts";

class Database {
  public readonly client: Client;

  constructor() {
    this.client = new Client({
      user: Deno.env.get("DB_USER"),
      password: Deno.env.get("DB_PASSWORD"),
      database: Deno.env.get("DB_NAME"),
      hostname: Deno.env.get("DB_HOST"),
      port: parseInt(Deno.env.get("DB_PORT") as string),
    });
  }
}

export default new Database().client;
