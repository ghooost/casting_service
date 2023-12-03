import { uniqId } from "@db/index";
import { Casting, CastingField } from "@shared/casting";
import { NotFoundError } from "@shared/error";
import { checkAuthStuff } from "@utils/auth";

const getFieldsList = (casting: Casting) => {
  return Array.from(casting.fields);
};

const getFieldById = (casting: Casting, fieldId: CastingField["id"]) => {
  const field = Array.from(casting.fields).find(({ id }) => id === fieldId);
  if (!field) {
    throw new NotFoundError();
  }
  return field;
};

const createField = (casting: Casting, data: Omit<CastingField, "id">) => {
  const field: CastingField = {
    ...data,
    id: uniqId(),
  };
  casting.fields.add(field);
  return field;
};

const updateField = (field: CastingField, data: Omit<CastingField, "id">) => {
  field.inputType = data.inputType;
  field.isRequired = data.isRequired;
  field.inputType = data.inputType;
  return field;
};

const deleteField = (casting: Casting, field: CastingField) => {
  casting.fields.delete(field);
};

const reArrangeFields = (casting: Casting, fieldIds: CastingField["id"][]) => {
  const dict: [CastingField["id"], CastingField][] = Array.from(
    casting.fields
  ).map((data) => [data.id, data]);
  const fields = new Map<CastingField["id"], CastingField>(dict);
  const newFields = new Set<CastingField>();
  for (const fieldId of fieldIds) {
    const field = fields.get(fieldId);
    if (field) {
      newFields.add(field);
    }
  }
  casting.fields = newFields;
};

export const serviceCompanies = {
  getFieldsList: checkAuthStuff(getFieldsList),
  getFieldById: checkAuthStuff(getFieldById),
  createField: checkAuthStuff(createField),
  updateField: checkAuthStuff(updateField),
  deleteField: checkAuthStuff(deleteField),
  reArrangeFields: checkAuthStuff(reArrangeFields),
};
