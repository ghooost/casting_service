import { adapterUsers } from "@db/users";
import { ForbiddenError, NotFoundError, ParamsError } from "@shared/error";
import { MaybeUser, User } from "@shared/user";
import { canManageServiceLevel, checkAuthAdmin } from "@utils/auth";
import {
  normalizeBool,
  normalizeEmail,
  normalizeString,
} from "@utils/normalize";
import { maskPrivateData } from "@utils/users";

const coreFilterUsersByEmail = (inEmail: User["email"]) => {
  return adapterUsers.filter(({ email }) => email === inEmail);
};

const coreCreateUser = (data: Omit<User, "id">) => {
  const email = normalizeEmail(data.email);
  const password = normalizeString(data.password);
  const isAdmin = normalizeBool(data.isAdmin);
  if (!email || !password) {
    throw new ParamsError();
  }
  const users = coreFilterUsersByEmail(email);
  if (users.length > 0) {
    throw new ParamsError("email already exists");
  }
  return adapterUsers.add({
    email,
    password,
    isAdmin,
  });
};

const coreGetUserById = (userId: User["id"]) => {
  return adapterUsers.find(userId) ?? null;
};

const coreGetUserByEmail = (email: User["email"]) => {
  const emails = coreFilterUsersByEmail(email);
  if (emails.length < 1) {
    return null;
  }
  return emails[0];
};

const coreCreateInitialUserIfNoUsersAtAll = (
  email: User["email"],
  password: User["password"]
) => {
  if (adapterUsers.isEmpty()) {
    coreCreateUser({ email, password, isAdmin: true });
  }
};

const getUserList = () => {
  return adapterUsers.filter(() => true);
};

const createUser = (data: Omit<User, "id">) => {
  return coreCreateUser(data);
};

const deleteUser = (user: User) => {
  adapterUsers.remove(user);
};

const getUserById = (author: MaybeUser, userId: User["id"]) => {
  const user = adapterUsers.find(userId);
  if (!user) {
    throw new NotFoundError();
  }
  if (!canManageServiceLevel(author) && user !== author) {
    throw new ForbiddenError();
  }
  return maskPrivateData(user);
};

const updateUser = (
  author: MaybeUser,
  user: User,
  data: Partial<Omit<User, "id">>
) => {
  if (!author) {
    throw new ForbiddenError();
  }
  if (!canManageServiceLevel(author) && user !== author) {
    throw new ForbiddenError();
  }
  const normData: Record<string, unknown> = {};
  if (data.email) {
    const email = normalizeEmail(data.email);
    if (email !== user.email) {
      if (!email) {
        throw new ParamsError("wrong email");
      }
      const users = coreFilterUsersByEmail(email);
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
  if (data.isAdmin !== undefined) {
    const isAdmin = normalizeBool(data.isAdmin);
    normData.isAdmin = author.isAdmin ? isAdmin : false;
  }
  return adapterUsers.update(user.id, normData);
};

export const serviceUsers = {
  // no auth control
  coreGetUserById,
  coreGetUserByEmail,
  coreCreateInitialUserIfNoUsersAtAll,

  // standart auth
  getUserList: checkAuthAdmin(getUserList),
  createUser: checkAuthAdmin(createUser),
  deleteUser: checkAuthAdmin(deleteUser),

  // custom auth control
  getUserById,
  updateUser,
};
