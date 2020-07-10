import { Link } from "./link.dto.ts";

export class EmailTemplateDto {
  issueDateString: string = "";
  nextIssueDateString: string = "";
  emailAddress: string = "";
  linkCountPerEmail: number = 0;
  userId: string = "";
  links: Link[] = [];
}
