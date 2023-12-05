import { ProcessingError } from "@shared/error";
import { updateObject } from "@utils/objects";

interface TypeWithID {
  id: number | string;
}

export const makeApiForMap = <C extends TypeWithID>(
  collection: Map<C["id"], C>,
  getDefaultItem: () => C,
  initId: number = 0,
  // this lock preserves setData calling
  // to avoid resetting of 'productive' collections
  // unlock it in api instances
  // you create with your local test collections
  // in tests
  isLocked: boolean = true
) => {
  let localId = initId;
  return {
    filter(fn?: (data: C) => boolean) {
      const items = Array.from(collection.values());
      if (!fn) {
        return items;
      }
      return items.filter(fn);
    },

    has(item: C) {
      return collection.has(item.id);
    },

    hasId(itemId: C["id"]) {
      return collection.has(itemId);
    },

    find(itemId: C["id"]) {
      return collection.get(itemId) ?? null;
    },

    update(itemId: C["id"], data: Partial<C>) {
      const item = collection.get(itemId);
      if (!item) {
        return null;
      }
      return updateObject(item, data);
    },

    add(data: Partial<Omit<C, "id">>) {
      const item = {
        ...getDefaultItem(),
        ...data,
        id: ++localId,
      };
      collection.set(item.id, item);
      return item;
    },

    remove(item: C) {
      collection.delete(item.id);
      return item;
    },

    isEmpty() {
      return collection.size === 0;
    },

    setData(data: C[]) {
      if (isLocked) {
        throw new ProcessingError("Call setData for a locked API");
      }
      collection.clear();
      data.forEach((item) => collection.set(item.id, item));
    },
  };
};

export const makeChildArrayApi = <P, C extends TypeWithID>(
  getCollection: (parent: P) => C[]
) => {
  return {
    filter(parent: P, fn?: (data: C) => boolean) {
      const items = getCollection(parent);
      if (!fn) {
        return items;
      }
      return items.filter(fn);
    },

    has(parent: P, item: C) {
      return getCollection(parent).includes(item);
    },

    hasId(parent: P, itemId: C["id"]) {
      return (
        getCollection(parent).find(({ id }) => id === itemId) !== undefined
      );
    },

    find(parent: P, itemId: C["id"]) {
      return getCollection(parent).find(({ id }) => id === itemId) ?? null;
    },

    update(parent: P, itemId: C["id"], data: Partial<C>) {
      const collection = getCollection(parent);
      const item = collection.find(({ id }) => id === itemId);
      if (!item) {
        return null;
      }
      return updateObject(item, data);
    },

    reArrange(parent: P, itemIds: C["id"][]) {
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

    isEmpty(parent: P) {
      return getCollection(parent).length === 0;
    },
  };
};

export const makeChildArrayApiLinkable = <P, C extends TypeWithID>(
  getCollection: (parent: P) => C[]
) => {
  return {
    ...makeChildArrayApi(getCollection),
    link(parent: P, item: C) {
      getCollection(parent).push(item);
      return item;
    },

    unlink(parent: P, item: C) {
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
    add(parent: P, data: Partial<Omit<C, "id">>) {
      const item = {
        ...getDefaultItem(),
        ...data,
        id: ++localId,
      };
      getCollection(parent).push(item);
      return item;
    },

    remove(parent: P, item: C) {
      const collection = getCollection(parent);
      const index = collection.indexOf(item);
      if (index > -1) {
        collection.splice(index, 1);
      }
    },
  };
};
