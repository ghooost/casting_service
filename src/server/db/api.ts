import { ProcessingError } from "@shared/error";
import { updateObject } from "@utils/objects";

interface TypeWithID {
  id: number | string;
}

type GeneratorId = () => number | string;
// DB api made async to prepare services to work
// with real async DBs.
export const makeApiForMap = <C extends TypeWithID>(
  collection: Map<C["id"], C>,
  getDefaultItem: () => C,
  // this lock preserves setData calling
  // to avoid resetting of 'productive' collections
  // unlock it in api instances
  // you create with your local test collections
  // in tests
  isLocked: boolean = true,
  // could be start number value or a function to
  // generate number or string keys
  initId: number | GeneratorId = 0
) => {
  let localId = initId;
  return {
    async filter(fn?: (data: C) => boolean | Promise<boolean>) {
      const items = Array.from(collection.values());
      if (!fn) {
        return items;
      }
      return (
        await Promise.all(
          items.map(async (item) => ({ item, resolver: await fn(item) }))
        )
      )
        .filter(({ resolver }) => resolver)
        .map(({ item }) => item);
    },

    async has(item: C) {
      return collection.has(item.id);
    },

    async hasId(itemId: C["id"]) {
      return collection.has(itemId);
    },

    async find(itemId: C["id"]) {
      return collection.get(itemId) ?? null;
    },

    async update(itemId: C["id"], data: Partial<C>) {
      const item = collection.get(itemId);
      if (!item) {
        return null;
      }
      return updateObject(item, data);
    },

    async add(data: Partial<Omit<C, "id">>) {
      const id = typeof localId === "number" ? ++localId : localId();

      const item = {
        ...getDefaultItem(),
        ...data,
        id,
      };
      collection.set(item.id, item);
      return item;
    },

    async remove(item: C) {
      collection.delete(item.id);
      return item;
    },

    async isEmpty() {
      return collection.size === 0;
    },

    async setData(data: C[]) {
      if (isLocked) {
        throw new ProcessingError("Call setData for a locked API");
      }
      collection.clear();
      let maxId = 0;
      data.forEach((item) => {
        collection.set(item.id, item);
        if (typeof item.id === "number" && item.id > maxId) {
          maxId = item.id;
        }
      });
      if (typeof localId === "number") {
        localId = maxId;
      }
    },

    isLocked() {
      return isLocked;
    },
  };
};

export const makeChildArrayApi = <P, C extends TypeWithID>(
  getCollection: (parent: P) => C[]
) => {
  return {
    async filter(parent: P, fn?: (data: C) => boolean) {
      const items = getCollection(parent);
      if (!fn) {
        return items;
      }
      return items.filter(fn);
    },

    async has(parent: P, item: C) {
      return getCollection(parent).includes(item);
    },

    async hasId(parent: P, itemId: C["id"]) {
      return (
        getCollection(parent).find(({ id }) => id === itemId) !== undefined
      );
    },

    async find(parent: P, itemId: C["id"]) {
      return getCollection(parent).find(({ id }) => id === itemId) ?? null;
    },

    async update(parent: P, itemId: C["id"], data: Partial<C>) {
      const collection = getCollection(parent);
      const item = collection.find(({ id }) => id === itemId);
      if (!item) {
        return null;
      }
      return updateObject(item, data);
    },

    async reArrange(parent: P, itemIds: C["id"][]) {
      const collection = getCollection(parent);
      const dict = new Map<C["id"], C>(
        collection.map((item) => [item.id, item])
      );
      collection.splice(0, collection.length);
      itemIds.forEach((id) => {
        const value = dict.get(id);
        if (value) {
          collection.push(value);
        }
      });
    },

    async isEmpty(parent: P) {
      return getCollection(parent).length === 0;
    },
  };
};

export const makeChildArrayApiLinkable = <P, C extends TypeWithID>(
  getCollection: (parent: P) => C[]
) => {
  return {
    ...makeChildArrayApi(getCollection),
    async link(parent: P, item: C) {
      getCollection(parent).push(item);
      return item;
    },

    async unlink(parent: P, item: C) {
      const collection = getCollection(parent);
      const index = collection.indexOf(item);
      if (index > -1) {
        collection.splice(index, 1);
      }
    },
  };
};

export const makeChildArrayApiEditable = <P, C extends TypeWithID>(
  getCollection: (parent: P) => C[],
  getDefaultItem: () => C,
  initId: number = 0
) => {
  let localId = initId;
  return {
    ...makeChildArrayApi(getCollection),
    async add(parent: P, data: Partial<Omit<C, "id">>) {
      const item = {
        ...getDefaultItem(),
        ...data,
        id: ++localId,
      };
      getCollection(parent).push(item);
      return item;
    },

    async remove(parent: P, item: C) {
      const collection = getCollection(parent);
      const index = collection.indexOf(item);
      if (index > -1) {
        collection.splice(index, 1);
      }
    },
  };
};
