import { adapterFields } from "@db/companies";
import { Casting, CastingField } from "@shared/casting";
import { NotFoundError } from "@shared/error";
import { checkAuthStuff } from "@utils/auth";

const getFieldsList = (casting: Casting) => {
  return adapterFields.filter(casting);
};

const getFieldById = (casting: Casting, fieldId: CastingField["id"]) => {
  const field = adapterFields.find(casting, fieldId);
  if (!field) {
    throw new NotFoundError();
  }
  return field;
};

const createField = (casting: Casting, data: Omit<CastingField, "id">) => {
  return adapterFields.add(casting, data);
};

const updateField = (
  casting: Casting,
  field: CastingField,
  data: Omit<CastingField, "id">
) => {
  return adapterFields.update(casting, field.id, data);
};

const deleteField = (casting: Casting, field: CastingField) => {
  adapterFields.remove(casting, field);
};

const reArrangeFields = (casting: Casting, fieldIds: CastingField["id"][]) => {
  adapterFields.reArrange(casting, fieldIds);
};

export const serviceCompanies = {
  getFieldsList: checkAuthStuff(getFieldsList),
  getFieldById: checkAuthStuff(getFieldById),
  createField: checkAuthStuff(createField),
  updateField: checkAuthStuff(updateField),
  deleteField: checkAuthStuff(deleteField),
  reArrangeFields: checkAuthStuff(reArrangeFields),
};
