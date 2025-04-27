import { SortableItem } from "@/game/gptAttempt/Draggable";
import { Item } from "@/game/gptAttempt/Game";
import { SimpleGrid } from "@mantine/core";

export function GridBoard({
	itemIds,
	items
}: {
	itemIds: number[];
	items: Item[]
}) {
	return (
			<SimpleGrid
				cols={3}
				style={{
					justifyContent: "center",
					alignItems: "stretch",
					gap: 10,
					maxWidth: "500px",
					minWidth: "min(500px, 100%)",
					gridTemplate: "repeat(3, 1fr) / repeat(3, 1fr)",
				}}>
				{itemIds.map((id) => (
					<SortableItem
						key={id}
						id={id}
						item={items[id]}
					 />
				))}
			</SimpleGrid>
	);
}

