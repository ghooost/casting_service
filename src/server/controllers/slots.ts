import express from "express";

import { serviceSlots } from "@services/slots";
import { Casting, CastingSlot } from "@shared/casting";
import { Company } from "@shared/company";
import { NotFoundError, ProcessingError } from "@shared/error";
import { BodyWithStatus, RequestFreeParams } from "@shared/express";
import { MaybeUser } from "@shared/user";
import { selectContext } from "@utils/context";
import { getCastingByParam, getCompanyByParam } from "@utils/params";

interface SlotIdParams extends RequestFreeParams {
  companyId: string;
  castingId: string;
  slotId: string;
}

export const getSlotByParam = async (
  author: MaybeUser,
  company: Company,
  casting: Casting,
  param: string
) => {
  const slotId = parseInt(param);
  if (!slotId) {
    throw new NotFoundError();
  }
  const slot = await serviceSlots.getSlotById(author, company, casting, slotId);
  if (!slot) {
    throw new NotFoundError();
  }
  return slot;
};

const decodeParams = async (request: express.Request<SlotIdParams>) => {
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

export const SlotList: express.RequestHandler<
  SlotIdParams,
  CastingSlot[]
> = async (request, response) => {
  const { author, company, casting } = await decodeParams(request);
  const slots = await serviceSlots.getSlotsList(author, company, casting);
  response.status(200).send(slots);
};

export const slotGet: express.RequestHandler<
  SlotIdParams,
  CastingSlot
> = async (request, response) => {
  const { author, company, casting } = await decodeParams(request);
  const slot = await serviceSlots.getSlotById(
    author,
    company,
    casting,
    parseInt(request.params.slotId)
  );
  response.status(200).send(slot);
};

export const slotCreate: express.RequestHandler<
  SlotIdParams,
  CastingSlot,
  Omit<CastingSlot, "id">
> = async (request, response) => {
  const { author, company, casting } = await decodeParams(request);
  const slot = await serviceSlots.createSlot(
    author,
    company,
    casting,
    request.body
  );
  response.status(200).send(slot);
};

export const slotUpdate: express.RequestHandler<
  SlotIdParams,
  CastingSlot,
  Omit<CastingSlot, "id">
> = async (request, response) => {
  const { author, company, casting } = await decodeParams(request);
  const slot = await serviceSlots.getSlotById(
    author,
    company,
    casting,
    parseInt(request.params.slotId)
  );

  const result = await serviceSlots.updateSlot(
    author,
    company,
    casting,
    slot,
    request.body
  );

  if (!result) {
    throw new ProcessingError();
  }

  response.status(200).send(result);
};

export const slotDelete: express.RequestHandler<
  SlotIdParams,
  BodyWithStatus
> = async (request, response) => {
  const { author, company, casting } = await decodeParams(request);
  const slot = await serviceSlots.getSlotById(
    author,
    company,
    casting,
    parseInt(request.params.SlotId)
  );
  serviceSlots.deleteSlot(author, company, casting, slot);
  response.sendStatus(200);
};
