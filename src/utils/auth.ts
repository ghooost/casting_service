import { adapterOwners, adapterStuff } from "@db/companies";
import { Company, MaybeCompany } from "@shared/company";
import { ForbiddenError } from "@shared/error";
import { MaybeUser } from "@shared/user";

/**
 * Checks if the given user has the authority to manage service-level operations.
 *
 * @param {MaybeUser} author - The user to be checked for authorization.
 * @returns {boolean} Returns `true` if the user has the authority; otherwise, returns `false`.
 */
export const canManageServiceLevel = (author: MaybeUser) => {
  if (!author) {
    return false;
  }
  return author.isAdmin;
};

/**
 * Checks if the given user has the authority to manage company-level operations.
 *
 * @param {MaybeUser} author - The user to be checked for authorization.
 * @param {MaybeCompany} company - The company to be checked for ownership.
 * @returns {boolean} Returns `true` if the user has the authority or is an owner of the company; otherwise, returns `false`.
 */
export const canManageCompanyLevel = (
  author: MaybeUser,
  company: MaybeCompany
) => {
  if (!author || !company) {
    return false;
  }
  if (canManageServiceLevel(author)) {
    return true;
  }
  return adapterOwners.has(company, author);
};

/**
 * Checks if the given user has the authority to manage stuff-level operations within a company.
 *
 * @param {MaybeUser} author - The user to be checked for authorization.
 * @param {MaybeCompany} company - The company to be checked for ownership.
 * @returns {boolean} Returns `true` if the user has the authority or is an owner/stuff member of the company; otherwise, returns `false`.
 */
export const canManageStuffLevel = (
  author: MaybeUser,
  company: MaybeCompany
) => {
  if (!author || !company) {
    return false;
  }
  if (canManageCompanyLevel(author, company)) {
    return true;
  }
  return adapterStuff.has(company, author);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FuncType = (...args: any[]) => any;

/**
 * Decorator function that checks if the user has administrative authorization
 * before allowing the execution of the provided function.
 *
 * @template T - The type of the function being decorated.
 * @param {T} fn - The function to be decorated.
 * @param {string} [forbiddenMessage] - An optional message to be used in the ForbiddenError if authorization fails.
 * @returns {(...args: Parameters<T>) => ReturnType<T>} A decorated function that checks authorization before execution.
 * @throws {ForbiddenError} Throws a ForbiddenError if the user does not have administrative authorization.
 */
export const checkAuthAdmin = <T extends FuncType>(
  fn: T,
  forbiddenMessage?: string
) => {
  return (
    author: MaybeUser,
    ...args: Parameters<typeof fn>
  ): ReturnType<typeof fn> => {
    if (!canManageServiceLevel(author)) {
      throw new ForbiddenError(forbiddenMessage);
    }
    return fn(...args);
  };
};

/**
 * Decorator function that checks if the user has ownership authorization for a company
 * before allowing the execution of the provided function.
 *
 * @template T - The type of the function being decorated.
 * @param {T} fn - The function to be decorated.
 * @param {string} [forbiddenMessage] - An optional message to be used in the ForbiddenError if authorization fails.
 * @returns {(...args: [MaybeUser, MaybeCompany, ...Parameters<T>]) => ReturnType<T>} A decorated function that checks authorization before execution.
 * @throws {ForbiddenError} Throws a ForbiddenError if the user does not have ownership authorization for the company.
 */
export const checkAuthOwner = <T extends FuncType>(
  fn: T,
  forbiddenMessage?: string
) => {
  return (
    author: MaybeUser,
    company: MaybeCompany,
    ...args: Parameters<typeof fn>
  ): ReturnType<typeof fn> => {
    if (!company || !canManageCompanyLevel(author, company)) {
      throw new ForbiddenError(forbiddenMessage);
    }
    return fn(...args);
  };
};

/**
 * Decorator function that checks if the user has authorization for stuff-level operations within a company
 * before allowing the execution of the provided function.
 *
 * @template T - The type of the function being decorated.
 * @param {T} fn - The function to be decorated.
 * @param {string} [forbiddenMessage] - An optional message to be used in the ForbiddenError if authorization fails.
 * @returns {(...args: [MaybeUser, MaybeCompany, ...Parameters<T>]) => ReturnType<T>} A decorated function that checks authorization before execution.
 * @throws {ForbiddenError} Throws a ForbiddenError if the user does not have authorization for stuff-level operations within the company.
 */
export const checkAuthStuff = <T extends FuncType>(
  fn: T,
  forbiddenMessage?: string
) => {
  return (
    author: MaybeUser,
    company: MaybeCompany,
    ...args: Parameters<typeof fn>
  ): ReturnType<typeof fn> => {
    if (!company || !canManageStuffLevel(author, company)) {
      throw new ForbiddenError(forbiddenMessage);
    }
    return fn(...args);
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FuncWithCompanyType = (company: Company, ...args: any[]) => any;

/**
 * Decorator function that checks if the user has ownership authorization for a company
 * before allowing the execution of the provided function. This version deduplicates
 * the leading company parameter.
 *
 * @template T - The type of the function being decorated.
 * @param {T} fn - The function to be decorated.
 * @param {string} [forbiddenMessage] - An optional message to be used in the ForbiddenError if authorization fails.
 * @returns {(...args: [MaybeUser, ...Parameters<T>]) => ReturnType<T>} A decorated function that checks authorization before execution.
 * @throws {ForbiddenError} Throws a ForbiddenError if the user does not have ownership authorization for the company.
 */
export const checkAuthOwnerWithCompany = <T extends FuncWithCompanyType>(
  fn: T,
  forbiddenMessage?: string
) => {
  return (
    author: MaybeUser,
    ...args: Parameters<typeof fn>
  ): ReturnType<typeof fn> => {
    const company = args[0] as MaybeCompany;
    if (!company || !canManageCompanyLevel(author, company)) {
      throw new ForbiddenError(forbiddenMessage);
    }
    return fn(company, ...args.slice(1));
  };
};

/**
 * Decorator function that checks if the user has authorization for stuff-level operations within a company
 * before allowing the execution of the provided function. This version deduplicates
 * the leading company parameter.
 *
 * @template T - The type of the function being decorated.
 * @param {T} fn - The function to be decorated.
 * @param {string} [forbiddenMessage] - An optional message to be used in the ForbiddenError if authorization fails.
 * @returns {(...args: [MaybeUser, ...Parameters<T>]) => ReturnType<T>} A decorated function that checks authorization before execution.
 * @throws {ForbiddenError} Throws a ForbiddenError if the user does not have authorization for stuff-level operations within the company.
 */
export const checkAuthStuffWithCompany = <T extends FuncWithCompanyType>(
  fn: T,
  forbiddenMessage?: string
) => {
  return (
    author: MaybeUser,
    ...args: Parameters<typeof fn>
  ): ReturnType<typeof fn> => {
    const company = args[0];
    if (!company || !canManageStuffLevel(author, company)) {
      throw new ForbiddenError(forbiddenMessage);
    }
    return fn(company, ...args.slice(1));
  };
};
