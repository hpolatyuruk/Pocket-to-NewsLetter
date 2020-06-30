import { Client } from "https://deno.land/x/postgres/mod.ts";
import { IUserPreferencesRepository } from "./user-preferences.repository.interface.ts";
import { UserPreferences } from "../models/user-preferences.ts";
import client from "../db/db.ts";

export class UserPreferencesRepository implements IUserPreferencesRepository {
  async create(preferences: UserPreferences): Promise<void> {
    try {
      await client.connect();
      const result = await client.query(
        "INSERT INTO userpreferences(pocketusername, emailaddress, accesstoken, linkcountperdigest, cronexpression, subscribed, createdat) VALUES($1, $2, $3, $4, $5, $6, $7);",
        preferences.pocketUserName,
        preferences.emailAddress,
        preferences.accessToken,
        preferences.linkCountPerDigest,
        preferences.cronExpression,
        preferences.subscribed,
        new Date(),
      );
      console.log(result.rows);
    } finally {
      await client.end();
    }
  }

  async update(preferences: UserPreferences): Promise<UserPreferences> {
    try {
      await client.connect();
      const result = await client.query(
        "UPDATE userpreferences SET emailaddress = $2, accesstoken = $3, linkcountperdigest = $4, cronexpression = $5, subscribed= $6, updatedat = $7 WHERE pocketusername = $1;",
        preferences.pocketUserName,
        preferences.emailAddress,
        preferences.accessToken,
        preferences.linkCountPerDigest,
        preferences.cronExpression,
        preferences.subscribed,
        preferences.updatedAt,
      );
      return preferences;
    } finally {
      await client.end();
    }
  }

  async delete(preferences: UserPreferences): Promise<void> {
    try {
      await client.connect();
      const result = await client.query(
        "DELETE FROM userpreferences WHERE pocketusername = $1;",
        preferences.pocketUserName,
      );
    } finally {
      await client.end();
    }
  }

  async get(pocketUserName: string): Promise<UserPreferences> {
    try {
      await client.connect();
      const result = await client.query(
        "SELECT * FROM userpreferences WHERE pocketusername = $1",
        pocketUserName,
      );
      return this.mapUserPreferencese(result)[0];
    } finally {
      await client.end();
    }
  }

  async getAll(): Promise<UserPreferences[]> {
    try {
      await client.connect();
      const result = await client.query("SELECT * FROM userpreferences");
      return this.mapUserPreferencese(result);
    } finally {
      await client.end();
    }
  }

  private mapUserPreferencese(result: any): UserPreferences[] {
    const array: UserPreferences[] = [];
    if (result.rowCount === 0) return array;

    const cols = result.rowDescription.columns;

    result.rows.map((row: any) => {
      const userPreferences = new UserPreferences();
      userPreferences.pocketUserName =
        row[this.getColIndexByName(cols, "pocketusername")];
      userPreferences.accessToken =
        row[this.getColIndexByName(cols, "accesstoken")];
      userPreferences.cronExpression =
        row[this.getColIndexByName(cols, "cronexpression")];
      userPreferences.emailAddress =
        row[this.getColIndexByName(cols, "emailaddress")];
      userPreferences.linkCountPerDigest =
        row[this.getColIndexByName(cols, "linkcountperdigest")];
      userPreferences.sortType = row[this.getColIndexByName(cols, "sorttype")];
      userPreferences.subscribed =
        row[this.getColIndexByName(cols, "subscribed")];
      userPreferences.createdAt =
        row[this.getColIndexByName(cols, "createdat")];
      userPreferences.updatedAt =
        row[this.getColIndexByName(cols, "updatedat")];
      array.push(userPreferences);
    });
    return array;
  }

  private getColIndexByName(cols: any, name: string): number {
    return cols.filter((col: any) => col.name === name)[0].index - 1;
  }
}
