import { parsePhoneNumber } from "libphonenumber-js";

export const trimWhitespaces = (value: string) => value.trim();

export const trimNonLetters = (value: string) => {
  return value.replace(/^[\W]+|[\W]+$/g, "");
};
export const normalizeString = (value: string) => trimWhitespaces(value);

export const normalizePhone = (value: string) => {
  const phoneNumber = parsePhoneNumber(value, "RU");
  if (!phoneNumber) {
    return null;
  }
  if (!phoneNumber.isPossible()) {
    return null;
  }
  return phoneNumber.formatInternational();
};

export const normalizeEmail = (value: string) => {
  const email = trimNonLetters(value).toLocaleLowerCase();
  const validRegex =
    /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)*$/;
  if (!validRegex.test(email)) {
    return "";
  }
  return email;
};

export const normalizeBool = (value: boolean | string | number) => {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "number") {
    return value !== 0;
  }
  if (value === "" || value === "false") {
    return false;
  }
  return true;
};
