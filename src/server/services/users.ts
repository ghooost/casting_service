import { adapterUsers } from "@db/users";
import { NotFoundError, ParamsError } from "@shared/error";
import { User } from "@shared/user";
import {
  checkAuthAdmin,
  checkAuthOwner,
  checkAuthSelf,
  checkAuthSelfWithUser,
} from "@utils/auth";
import {
  normalizeBool,
  normalizeEmail,
  normalizeString,
} from "@utils/normalize";

const coreFilterUsersByEmail = async (inEmail: User["email"]) => {
  return await adapterUsers.filter(({ email }) => email === inEmail);
};

const coreCreateUser = async (data: Omit<User, "id">) => {
  const email = normalizeEmail(data.email);
  const password = normalizeString(data.password);
  const isAdmin = normalizeBool(data.isAdmin);
  if (!email || !password) {
    throw new ParamsError();
  }
  const users = await coreFilterUsersByEmail(email);
  if (users.length > 0) {
    throw new ParamsError("email already exists");
  }
  return await adapterUsers.add({
    email,
    password,
    isAdmin,
  });
};

const coreGetUserById = async (userId: User["id"]) => {
  return (await adapterUsers.find(userId)) ?? null;
};

const coreGetUserByEmail = async (email: User["email"]) => {
  const emails = await coreFilterUsersByEmail(email);
  if (emails.length < 1) {
    return null;
  }
  return emails[0];
};

const coreCreateInitialUserIfNoUsersAtAll = async (
  email: User["email"],
  password: User["password"]
) => {
  if (await adapterUsers.isEmpty()) {
    await coreCreateUser({ email, password, isAdmin: true });
  }
};

const getUserList = async () => {
  return await adapterUsers.filter(() => true);
};

const createUser = async (data: Omit<User, "id">) => {
  return await coreCreateUser(data);
};

const deleteUser = async (user: User) => {
  await adapterUsers.remove(user);
};

const getUserById = async (userId: User["id"]) => {
  const user = await adapterUsers.find(userId);
  if (!user) {
    throw new NotFoundError();
  }
  return user;
};

const updateUser = async (user: User, data: Partial<Omit<User, "id">>) => {
  const normData: Record<string, unknown> = {};
  if (data.email) {
    const email = normalizeEmail(data.email);
    if (email !== user.email) {
      if (!email) {
        throw new ParamsError("wrong email");
      }
      const users = await coreFilterUsersByEmail(email);
      if (users.length > 0 && users[0].id !== user.id) {
        throw new ParamsError("email already exists");
      }
      normData.email = email;
    }
  }
  if (data.password) {
    const password = normalizeString(data.password);
    if (password && user.password !== password) {
      normData.password = password;
    }
  }
  return await adapterUsers.update(user.id, normData);
};

export const serviceUsers = {
  // no auth control
  coreGetUserById,
  coreGetUserByEmail,
  coreCreateInitialUserIfNoUsersAtAll,

  // standart auth
  getUserList: checkAuthAdmin(getUserList),
  createUser: checkAuthAdmin(createUser),
  updateUser: checkAuthAdmin(updateUser),
  deleteUser: checkAuthAdmin(deleteUser),
  getUserById: checkAuthAdmin(getUserById),

  createCompanyUser: checkAuthOwner(createUser),
  updateCompanyUser: checkAuthOwner(updateUser),
  getCompanyUserById: checkAuthOwner(getUserById),

  updateSelfUser: checkAuthSelfWithUser(updateUser),
  getSelfUserById: checkAuthSelf(getUserById),
};
