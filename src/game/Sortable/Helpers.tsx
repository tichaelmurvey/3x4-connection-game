import { UniqueIdentifier } from "@dnd-kit/core";

 export function findContainer(id: UniqueIdentifier, items: any) {
	console.log("finding container")
	if (id in items) {
	  return id;
	}

	return Object.keys(items).find((key) => items[key].includes(id));
  }