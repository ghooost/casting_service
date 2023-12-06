import { adapterRoles } from "@db/companies";
import { Casting, CastingRole } from "@shared/casting";
import { NotFoundError } from "@shared/error";
import { checkAuthStuff } from "@utils/auth";

const getRolesList = async (casting: Casting) => {
  return await adapterRoles.filter(casting);
};

const getRoleById = async (casting: Casting, roleId: CastingRole["id"]) => {
  const role = await adapterRoles.find(casting, roleId);
  if (!role) {
    throw new NotFoundError();
  }
  return role;
};

const createRole = async (casting: Casting, data: Omit<CastingRole, "id">) => {
  return await adapterRoles.add(casting, data);
};

const updateRole = async (
  casting: Casting,
  role: CastingRole,
  data: Omit<CastingRole, "id">
) => {
  return await adapterRoles.update(casting, role.id, data);
};

const deleteRole = async (casting: Casting, role: CastingRole) => {
  await adapterRoles.remove(casting, role);
};

const reArrangeRoles = async (
  casting: Casting,
  roleIds: CastingRole["id"][]
) => {
  await adapterRoles.reArrange(casting, roleIds);
};

export const serviceCompanies = {
  getCastingList: checkAuthStuff(getRolesList),
  getCastingById: checkAuthStuff(getRoleById),
  createCasting: checkAuthStuff(createRole),
  updateCasting: checkAuthStuff(updateRole),
  deleteCasting: checkAuthStuff(deleteRole),
  reArrangeRoles: checkAuthStuff(reArrangeRoles),
};
