import { selectCollection, uniqId } from "@db/index";
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
  const usersCollection = selectCollection("users");
  return Array.from(usersCollection.values()).filter(
    ({ email }) => email === inEmail
  );
};

const coreCreateUser = (data: Omit<User, "id">) => {
  console.log("coreCreateUser", data);
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
  const user = {
    email,
    password,
    isAdmin,
    id: uniqId(),
  };
  const usersCollection = selectCollection("users");
  usersCollection.set(user.id, user);
  return user;
};

const coreGetUserById = (userId: User["id"]) => {
  const usersCollection = selectCollection("users");
  return usersCollection.get(userId) ?? null;
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
  const usersCollection = selectCollection("users");
  if (usersCollection.size > 0) {
    return;
  }
  coreCreateUser({ email, password, isAdmin: true });
};

const getUserList = () => {
  const usersCollection = selectCollection("users");
  return Array.from(usersCollection.values());
};

const createUser = (data: Omit<User, "id">) => {
  return coreCreateUser(data);
};

const deleteUser = (user: User) => {
  const usersCollection = selectCollection("users");
  usersCollection.delete(user.id);
};

const getUserById = (author: MaybeUser, userId: User["id"]) => {
  const usersCollection = selectCollection("users");
  const user = usersCollection.get(userId);
  if (!user) {
    throw new NotFoundError();
  }
  if (!canManageServiceLevel(author) && user !== author) {
    throw new ForbiddenError();
  }
  return maskPrivateData(user);
};

const updateUser = (author: MaybeUser, user: User, data: Omit<User, "id">) => {
  if (!author) {
    throw new ForbiddenError();
  }
  if (!canManageServiceLevel(author) && user !== author) {
    throw new ForbiddenError();
  }
  const email = normalizeEmail(data.email);
  const password = normalizeString(data.password);
  const isAdmin = normalizeBool(data.isAdmin);
  if (email !== user.email) {
    if (!email) {
      throw new ParamsError("wrong email");
    }
    const users = coreFilterUsersByEmail(email);
    if (users.length > 0 && users[0].id !== user.id) {
      throw new ParamsError("email already exists");
    }
    user.email = email;
  }
  if (password && user.password !== password) {
    user.password = password;
  }
  user.isAdmin = author.isAdmin ? isAdmin : false;
  return maskPrivateData(user);
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
