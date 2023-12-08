import { vi } from "vitest";

import data from "./test.mock.json";

import { adapterCompanies } from "@db/companies";
import { adapterSessions } from "@db/sessions";
import { adapterUsers } from "@db/users";
import { Context, RequestWithContext } from "@shared/context";
import { User } from "@shared/user";

export const makeRequest = (
  params: Record<string, unknown>,
  body: Record<string, unknown>,
  context: Context
) => {
  return {
    body,
    context,
    params,
  } as unknown as RequestWithContext;
};

export const makeResponse = () => {
  const statusFn = vi.fn();
  const sendFn = vi.fn();
  const response = {
    status: statusFn,
    send: sendFn,
  };
  statusFn.mockReturnValue(response);
  sendFn.mockReturnValue(response);
  return response;
};

interface FillMockDbProps {
  adapterUsers?: typeof adapterUsers;
  adapterCompanies?: typeof adapterCompanies;
  adapterSessions?: typeof adapterSessions;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deepCopy = (obj: any) => {
  if (typeof obj === "object") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ret = {} as Record<string, any>;
    Object.entries(obj).forEach(([key, value]) => {
      ret[key] = deepCopy(value);
    });
  }
  return obj;
};

export const initMockDb = (
  options: FillMockDbProps
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): [typeof data, (customData?: any) => void] => {
  const readyData = deepCopy(data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resetDb = async (customData?: any) => {
    const newData = customData
      ? (deepCopy(customData) as typeof data)
      : (deepCopy(data) as typeof data);
    newData.companies.map(async (company) => {
      const owners = [] as User[];
      company.owners.forEach((owner) => {
        const user = newData.users.find(({ email }) => email === owner.email);
        if (user) {
          owners.push(user);
        }
      });
      const stuffs = [] as User[];
      company.stuff.forEach((stuff) => {
        const user = newData.users.find(({ email }) => email === stuff.email);
        if (user) {
          stuffs.push(user);
        }
      });
      company.owners = owners;
      company.stuff = stuffs;
    });
    Object.entries(newData).forEach(([key, value]) => {
      readyData[key] = value;
    });

    if (options.adapterUsers) {
      if (options.adapterUsers.isLocked()) {
        throw new Error("users DB adapter should be unlocked");
      }
      await options.adapterUsers.setData(readyData.users);
    }
    if (options.adapterCompanies) {
      if (options.adapterCompanies.isLocked()) {
        throw new Error("companies DB adapter should be unlocked");
      }
      await options.adapterCompanies.setData(readyData.companies);
    }
    if (options.adapterSessions) {
      if (options.adapterSessions.isLocked()) {
        throw new Error("sessions DB adapter should be unlocked");
      }
      await options.adapterSessions.setData(readyData.sessions);
    }
  };
  return [readyData, resetDb];
};
