import { Cell } from "@/game/model/model";
import { CellContext, GameStateContext } from "@/game/view/home/Game";
import { SortableItem } from "@/game/view/puzzle/Draggable";
import { SimpleGrid } from "@mantine/core";
import { memo, useContext, useMemo } from "react";

export function GridBoard({ itemIds }: { itemIds: number[] }) {

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
				<RenderCells itemIds={itemIds} />
			</SimpleGrid>
	);
}

const RenderCells = memo(function RenderCells({ itemIds }: { itemIds: number[] }) {
	const [gameState, gameDispatch] = useContext(GameStateContext);
	const cells = useContext(CellContext);
	if(!cells) return <>...</>;
	const solvedColors = useMemo(
		() =>
			Object.values(gameState.groupStatus).filter(
				(color) => color !== false && color !== "cRainbow"
			),
		[gameState.groupStatus]
	);

	const rainbowLockedColors = useMemo(
		() => `rainbow-with-${solvedColors.join(" rainbow-with-")}`,
		[solvedColors]
	);

	const cellElements = itemIds.map((id) => {
		if(cells[id].groupId === "rainbow"){
			return (
				<CellWrapper
					key={id}
					id={id}
					cell={cells[id]}
					rainbowLockedColors={rainbowLockedColors}
				/>
			)
		}
		return (
		<CellWrapper
			key={id}
			id={id}
			cell={cells[id]}
		/>
	)})
	return cellElements;

})

const CellWrapper = memo(function CellWrapper({ id, cell, rainbowLockedColors="" }: { id: number, cell: Cell, rainbowLockedColors?: string }) {
	return (
		<SortableItem
			key={id}
			{...cell}
			rainbowLockedColors={rainbowLockedColors}
		/>
	)
	}, (prevProps, nextProps) => prevProps.cell.colorName === nextProps.cell.colorName && prevProps.cell.locked === nextProps.cell.locked );


// export function handleProfilerRender(
// 	id: string,
// 	phase: string,
// 	actualDuration: number,
// 	baseDuration: number,
// 	startTime: number,
// 	commitTime: number
// ) {
// 	console.warn(id, phase);
// 	console.log("actualDuration", actualDuration);
// 	console.log("baseDuration", baseDuration);
// }
