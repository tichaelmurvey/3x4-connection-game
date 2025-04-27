import { DraggableCard } from "@/game/gptAttempt/Draggable";
import { colors, Item } from "@/game/gptAttempt/Game";
import { useDroppable } from "@dnd-kit/react";
import { AspectRatio, Card } from "@mantine/core";
import React from "react";

export function DroppableSlot({
	index, item, activeId, isGameGrid,
}: {
	index: number;
	item: Item;
	activeId: string | null;
	isGameGrid: boolean;
}) {
	const { isDropTarget: isOver, ref } = useDroppable({ id: item.id, data: item });
	const isActive = activeId !== null;
	const borderWidth = 8;
	const style: React.CSSProperties = {
		//gridRow: index === 0 && isGameGrid ? "span 4" : undefined,
		backgroundColor: item.id === activeId ? colors.grey :
			isOver ? isGameGrid ? colors.grid[index] : colors.grey : undefined,
		// height: "100%",
		borderRadius: "20px",
		position: "relative",
		border: item.label
			? "0"
			: isGameGrid
				? `${borderWidth}px dashed ${colors.grid[index]}`
				: `${borderWidth}px dashed ${colors.green}`,
		transition: "background-color 0.2s, border-color 0.2s, opacity 0.2s",
		opacity: !isActive && !item.label ? 0.7 : 1,
	};

	return (
		<div ref={ref} style={style}>
			{item.label ? <DraggableCard item={item} activeId={activeId} index={index} isGameGrid={isGameGrid} /> :

				<AspectRatio ratio={1}>
					<Card
						padding="md"
						bg="none"
						style={{
							// height: "100%",
							//width: "100%",
						}}></Card>
				</AspectRatio>}
		</div>
	);
}