import { Link } from "../dto/link.dto.ts";
import { UserPreferences } from "../models/user-preferences.ts";

export interface IHtmlEmailGenerator{
    generate(userPreferences: UserPreferences, links: Link[]): Promise<string>;
}