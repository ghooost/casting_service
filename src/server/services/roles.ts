import { uniqId } from "@db/index";
import { Casting, CastingRole } from "@shared/casting";
import { NotFoundError } from "@shared/error";
import { checkAuthStuff } from "@utils/auth";

const getRolesList = (casting: Casting) => {
  return Array.from(casting.roles);
};

const getRoleById = (casting: Casting, roleId: CastingRole["id"]) => {
  const role = Array.from(casting.roles).find(({ id }) => id === roleId);
  if (!role) {
    throw new NotFoundError();
  }
  return role;
};

const createRole = (casting: Casting, data: Omit<CastingRole, "id">) => {
  const role: CastingRole = {
    id: uniqId(),
    title: data.title,
  };
  casting.roles.add(role);
  return role;
};

const updateRole = (role: CastingRole, data: Omit<CastingRole, "id">) => {
  role.title = data.title;
  return role;
};

const deleteRole = (casting: Casting, role: CastingRole) => {
  casting.roles.delete(role);
};

const reArrangeRoles = (casting: Casting, roleIds: CastingRole["id"][]) => {
  const dict: [CastingRole["id"], CastingRole][] = Array.from(
    casting.roles
  ).map((data) => [data.id, data]);
  const roles = new Map<CastingRole["id"], CastingRole>(dict);
  const newRoles = new Set<CastingRole>();
  for (const fieldId of roleIds) {
    const role = roles.get(fieldId);
    if (role) {
      newRoles.add(role);
    }
  }
  casting.roles = newRoles;
};

export const serviceCompanies = {
  getCastingList: checkAuthStuff(getRolesList),
  getCastingById: checkAuthStuff(getRoleById),
  createCasting: checkAuthStuff(createRole),
  updateCasting: checkAuthStuff(updateRole),
  deleteCasting: checkAuthStuff(deleteRole),
  reArrangeRoles: checkAuthStuff(reArrangeRoles),
};
