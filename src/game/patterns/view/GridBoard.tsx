import { Cell } from "@/game/patterns/model/model";
import { SortableItem } from "@/game/patterns/view/Draggable";
import { SimpleGrid } from "@mantine/core";

export function GridBoard({
	itemIds,
	cells
}: {
	itemIds: number[];
	cells: Cell[]
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
						cell={cells[id]}
					 />
				))}
			</SimpleGrid>
	);
}

