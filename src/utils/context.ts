import { RequestWithPossibleContext } from "@shared/context";
import { ProcessingError } from "@shared/error";

export const selectContext = (request: RequestWithPossibleContext) => {
  if (!request.context) {
    throw new ProcessingError("no context available");
  }
  return request.context;
};
