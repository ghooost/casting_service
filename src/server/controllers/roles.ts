import express from "express";

import { serviceRoles } from "@services/roles";
import { Casting, CastingRole } from "@shared/casting";
import { Company } from "@shared/company";
import { NotFoundError, ProcessingError } from "@shared/error";
import { BodyWithStatus, RequestFreeParams } from "@shared/express";
import { MaybeUser } from "@shared/user";
import { selectContext } from "@utils/context";
import { getCastingByParam, getCompanyByParam } from "@utils/params";

interface RoleIdParams extends RequestFreeParams {
  companyId: string;
  castingId: string;
  roleId: string;
}

export const getRoleByParam = async (
  author: MaybeUser,
  company: Company,
  casting: Casting,
  param: string
) => {
  const roleId = parseInt(param);
  if (!roleId) {
    throw new NotFoundError();
  }
  const role = await serviceRoles.getRoleById(author, company, casting, roleId);
  if (!role) {
    throw new NotFoundError();
  }
  return role;
};

const decodeParams = async (request: express.Request<RoleIdParams>) => {
  const { author } = selectContext(request);
  const company = await getCompanyByParam(author, request.params.companyId);
  const casting = await getCastingByParam(
    author,
    company,
    request.params.castingId
  );
  return {
    author,
    company,
    casting,
  };
};

export const roleList: express.RequestHandler<
  RoleIdParams,
  CastingRole[]
> = async (request, response) => {
  const { author, company, casting } = await decodeParams(request);
  const roles = await serviceRoles.getRolesList(author, company, casting);
  response.status(200).send(roles);
};

export const roleGet: express.RequestHandler<
  RoleIdParams,
  CastingRole
> = async (request, response) => {
  const { author, company, casting } = await decodeParams(request);
  const role = await serviceRoles.getRoleById(
    author,
    company,
    casting,
    parseInt(request.params.roleId)
  );
  response.status(200).send(role);
};

export const roleCreate: express.RequestHandler<
  RoleIdParams,
  CastingRole,
  Omit<CastingRole, "id">
> = async (request, response) => {
  const { author, company, casting } = await decodeParams(request);
  const role = await serviceRoles.createRole(
    author,
    company,
    casting,
    request.body
  );
  response.status(200).send(role);
};

export const roleUpdate: express.RequestHandler<
  RoleIdParams,
  CastingRole,
  Omit<CastingRole, "id">
> = async (request, response) => {
  const { author, company, casting } = await decodeParams(request);
  const role = await serviceRoles.getRoleById(
    author,
    company,
    casting,
    parseInt(request.params.roleId)
  );

  const result = await serviceRoles.updateRole(
    author,
    company,
    casting,
    role,
    request.body
  );

  if (!result) {
    throw new ProcessingError();
  }

  response.status(200).send(result);
};

export const roleDelete: express.RequestHandler<
  RoleIdParams,
  BodyWithStatus
> = async (request, response) => {
  const { author, company, casting } = await decodeParams(request);
  const role = await serviceRoles.getRoleById(
    author,
    company,
    casting,
    parseInt(request.params.roleId)
  );
  serviceRoles.deleteRole(author, company, casting, role);
  response.sendStatus(200);
};
