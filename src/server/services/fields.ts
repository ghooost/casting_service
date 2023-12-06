import { adapterFields } from "@db/companies";
import { Casting, CastingField } from "@shared/casting";
import { NotFoundError } from "@shared/error";
import { checkAuthStuff } from "@utils/auth";

const getFieldsList = async (casting: Casting) => {
  return await adapterFields.filter(casting);
};

const getFieldById = async (casting: Casting, fieldId: CastingField["id"]) => {
  const field = await adapterFields.find(casting, fieldId);
  if (!field) {
    throw new NotFoundError();
  }
  return field;
};

const createField = async (
  casting: Casting,
  data: Omit<CastingField, "id">
) => {
  return await adapterFields.add(casting, data);
};

const updateField = async (
  casting: Casting,
  field: CastingField,
  data: Omit<CastingField, "id">
) => {
  return await adapterFields.update(casting, field.id, data);
};

const deleteField = async (casting: Casting, field: CastingField) => {
  await adapterFields.remove(casting, field);
};

const reArrangeFields = async (
  casting: Casting,
  fieldIds: CastingField["id"][]
) => {
  await adapterFields.reArrange(casting, fieldIds);
};

export const serviceCompanies = {
  getFieldsList: checkAuthStuff(getFieldsList),
  getFieldById: checkAuthStuff(getFieldById),
  createField: checkAuthStuff(createField),
  updateField: checkAuthStuff(updateField),
  deleteField: checkAuthStuff(deleteField),
  reArrangeFields: checkAuthStuff(reArrangeFields),
};
