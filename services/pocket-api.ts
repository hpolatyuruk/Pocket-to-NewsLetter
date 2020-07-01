import { Link } from "./../models/link.ts";
import { SortType } from "../enums/sort-type.enum.ts";

export class PocketAPIException extends Error {
  public readonly code: number;
  public readonly url: string;

  constructor(message: string, code: number, url: string) {
    super(message);
    this.code = code;
    this.url = url;
  }
}

export class PocketAPI {
  private readonly consumerKey: string;

  constructor(consumerKey: string) {
    this.consumerKey = consumerKey;
  }

  async getRequestToken(): Promise<string> {
    const data: any = {
      consumer_key: this.consumerKey,
      redirect_uri: "pocketapp1234:authorizationFinished",
    };
    return (await this.send(
      "https://getpocket.com/v3/oauth/request",
      "POST",
      data,
    ))
      .code;
  }

  async getUserAccesstoken(requestToken: string): Promise<any> {
    const data: any = {
      consumer_key: this.consumerKey,
      code: requestToken,
    };
    return await this.send(
      "https://getpocket.com/v3/oauth/authorize",
      "POST",
      data,
    );
  }

  async getLinks(
    accessToken: string,
    count: number = 10,
    sort: SortType,
  ): Promise<Link[]> {
    const data: any = {
      consumer_key: this.consumerKey,
      access_token: accessToken,
      count: count,
      detailType: "simple",
      sort: sort,
    };

    const resObj = await this.send(
      "https://getpocket.com/v3/get",
      "POST",
      data,
    );

    if (resObj.list === []) return [];

    const links: Link[] = [];
    const linksIds = Object.keys(resObj.list);

    for (const id of linksIds) {
      const linkObj = resObj.list[id];
      links.push(
        new Link(linkObj.item_id, linkObj.given_url, linkObj.given_title),
      );
    }
    return links;
  }

  async archiveLinks(accessToken: string, links: Link[]): Promise<void> {
    const actions = [];

    for (const link of links) {
      actions.push({
        action: "archive",
        item_id: link.id,
      });
    }

    let url = "https://getpocket.com/v3/send?actions=";
    url += encodeURIComponent(JSON.stringify(actions));
    url += `&access_token=${accessToken}`;
    url += `&consumer_key=${this.consumerKey}`;

    await this.send(url, "GET");
  }

  private async send(
    url: string,
    method: string = "POST",
    data?: any,
  ): Promise<any> {
    const fetchData: RequestInit = {
      method: method,
      body: data && JSON.stringify(data),
    };

    if (method === "POST") {
      fetchData.headers = {
        "Content-Type": "application/json; charset=UTF-8",
        "X-Accept": "application/json",
      };
    }

    const res = await fetch(url, fetchData);

    if (res.status !== 200) {
      const msg: string = res.headers.get("x-error") as string;
      const code: number = parseInt(res.headers.get("x-error-code") as string);
      throw new PocketAPIException(msg, code, url);
    }
    return await res.json();
  }
}
