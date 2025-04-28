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
					//alignItems: "stretch",
					gap: 10,
					width: "min(500px, 100%)",
					minWidth: "min(500px, 90%)",
					height: "min(500px, 90vw)",
					gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
					gridTemplateRows: "repeat(3, minmax(0, 1fr))",
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

