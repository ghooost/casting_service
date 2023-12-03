import { Company, MaybeCompany } from "@shared/company";
import { ForbiddenError } from "@shared/error";
import { MaybeUser } from "@shared/user";

export const canManageServiceLevel = (author: MaybeUser) => {
  if (!author) {
    return false;
  }
  return author.isAdmin;
};

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
  return company.owners.has(author);
};

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
  return company.stuff.has(author);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FuncType = (...args: any[]) => any;

// Decorators to construct functions with standart access checks
// to decorate services functions mostly

// turns fn(a, b) into fn(author, a, b)
// throws ForbiddenError if author !isAdmin
export const checkAuthAdmin = <T extends FuncType>(
  fn: T,
  forbidenMessage?: string
) => {
  return (
    author: MaybeUser,
    ...args: Parameters<typeof fn>
  ): ReturnType<typeof fn> => {
    if (!canManageServiceLevel(author)) {
      throw new ForbiddenError(forbidenMessage);
    }
    return fn(...args);
  };
};

// turns fn(a, b) into fn(author, company, a, b)
// throws ForbiddenError if author has no owner access to the company
// (not isAdmin and not in company.owners)
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

// turns fn(a, b) into fn(author, company, a, b)
// throws ForbiddenError if author has no stuff access to the company
// (not isAdmin and not in company.owners and not in company.stuff)
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

// turns fn(company, a, b) into fn(author, company, a, b)
// throws ForbiddenError if author has no stuff access to the company
// (not isAdmin and not in company.owners and not in company.stuff)
// similar with checkAuthOwner, but dedublicates leading company param
export const checkAuthOwnerWithCompany = <T extends FuncWithCompanyType>(
  fn: T,
  forbidenMessage?: string
) => {
  return (
    author: MaybeUser,
    ...args: Parameters<typeof fn>
  ): ReturnType<typeof fn> => {
    const company = args[0] as MaybeCompany;
    if (!company || !canManageCompanyLevel(author, company)) {
      throw new ForbiddenError(forbidenMessage);
    }
    return fn(company, ...args.slice(1));
  };
};

// turns fn(company, a, b) into fn(author, company, a, b)
// throws ForbiddenError if author has no stuff access to the company
// (not isAdmin and not in company.owners and not in company.stuff)
// similar with checkAuthStuff, but dedublicates leading company param
export const checkAuthStuffWithCompany = <T extends FuncWithCompanyType>(
  fn: T,
  forbidenMessage?: string
) => {
  return (
    author: MaybeUser,
    company: MaybeCompany,
    ...args: Parameters<typeof fn>
  ): ReturnType<typeof fn> => {
    if (!company || !canManageStuffLevel(author, company)) {
      throw new ForbiddenError(forbidenMessage);
    }
    return fn(company, ...args);
  };
};
