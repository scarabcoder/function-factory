import {type StandardSchemaV1} from "@standard-schema/spec";

export class InvalidParametersError extends Error {
  constructor(public readonly issues: ReadonlyArray<StandardSchemaV1.Issue>) {
    super(`Invalid parameters: ${issues.map(issue => issue.message).join(", ")}`);
    this.name = InvalidParametersError.name;
  }
}
