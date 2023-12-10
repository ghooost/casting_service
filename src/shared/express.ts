export type RequestFreeParams = Record<string, string>;

export type BodyWithStatus = {
  status: string;
};

export const defaultOkResponse = { status: "ok" };
export const defaultWrongResponse = { status: "error" };
