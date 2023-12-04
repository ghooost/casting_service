import { Applicant } from "src/shared/applicant";
import { Company } from "src/shared/company";
import { Session } from "src/shared/session";
import { User } from "src/shared/user";

function createDataBase() {
  let id = 0;
  return {
    uniqId() {
      return ++id;
    },
    collections: {
      sessions: new Map<Session["id"], Session>(),
      users: new Map<User["id"], User>(),
      companies: new Map<Company["id"], Company>(),
      applicants: new Map<Applicant["id"], Applicant>(),
    },
  };
}

type DataBase = ReturnType<typeof createDataBase>;
type DatabaseCollections = DataBase["collections"];
let globalDataBase: DataBase | null = null;

export const selectCollection = <T extends keyof DatabaseCollections>(
  name: T
): DatabaseCollections[T] => {
  if (!globalDataBase) {
    globalDataBase = createDataBase();
  }
  return globalDataBase.collections[name];
};

export const uniqId = () => {
  if (!globalDataBase) {
    globalDataBase = createDataBase();
  }
  return globalDataBase.uniqId();
};

export const dumpDb = () => {
  console.log(JSON.stringify(globalDataBase));
};
