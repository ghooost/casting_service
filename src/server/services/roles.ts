import { adapterRoles } from "@db/companies";
import { Casting, CastingRole } from "@shared/casting";
import { NotFoundError } from "@shared/error";
import { checkAuthStuff } from "@utils/auth";

const getRolesList = (casting: Casting) => {
  return adapterRoles.filter(casting);
};

const getRoleById = (casting: Casting, roleId: CastingRole["id"]) => {
  const role = adapterRoles.find(casting, roleId);
  if (!role) {
    throw new NotFoundError();
  }
  return role;
};

const createRole = (casting: Casting, data: Omit<CastingRole, "id">) => {
  return adapterRoles.add(casting, data);
};

const updateRole = (
  casting: Casting,
  role: CastingRole,
  data: Omit<CastingRole, "id">
) => {
  return adapterRoles.update(casting, role.id, data);
};

const deleteRole = (casting: Casting, role: CastingRole) => {
  adapterRoles.remove(casting, role);
};

const reArrangeRoles = (casting: Casting, roleIds: CastingRole["id"][]) => {
  adapterRoles.reArrange(casting, roleIds);
};

export const serviceCompanies = {
  getCastingList: checkAuthStuff(getRolesList),
  getCastingById: checkAuthStuff(getRoleById),
  createCasting: checkAuthStuff(createRole),
  updateCasting: checkAuthStuff(updateRole),
  deleteCasting: checkAuthStuff(deleteRole),
  reArrangeRoles: checkAuthStuff(reArrangeRoles),
};
