import type {StandardSchemaV1} from "@standard-schema/spec";
import {InvalidParametersError} from "./invalid-parameters.error.ts";

export function makeFunction<TSchema extends StandardSchemaV1, TResult>(
  schema: TSchema,
  impl: (parsed: StandardSchemaV1.InferOutput<TSchema>) => TResult
) {
  return (params: StandardSchemaV1.InferInput<TSchema>): TResult => {
    const result = schema["~standard"].validate(params);

    if("then" in result) {
      throw new Error("Promises are not supported in results.")
    }

    if(result.issues) {
      throw new InvalidParametersError(result.issues);
    }

    return impl(result.value);
  };
}
