import express from "express";

import { serviceSlots } from "@services/slots";
import { CastingSlot } from "@shared/casting";
import { ProcessingError } from "@shared/error";
import { BodyWithStatus, RequestFreeParams } from "@shared/express";
import { selectContext } from "@utils/context";
import {
  getCastingByParam,
  getCompanyByParam,
  getSlotByParam,
} from "@utils/params";

interface SlotIdParams extends RequestFreeParams {
  companyId: string;
  castingId: string;
  slotId: string;
}

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
  const slot = await getSlotByParam(
    author,
    company,
    casting,
    request.params.castingId
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
  const slot = await getSlotByParam(
    author,
    company,
    casting,
    request.params.castingId
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
  const slot = await getSlotByParam(
    author,
    company,
    casting,
    request.params.castingId
  );
  serviceSlots.deleteSlot(author, company, casting, slot);
  response.sendStatus(200);
};
