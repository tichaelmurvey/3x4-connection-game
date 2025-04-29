import { GameContext } from "@/game/patterns/view/Game";
import { GridBoard } from "@/game/patterns/view/GridBoard";
import { DndContext, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, rectSwappingStrategy } from "@dnd-kit/sortable";
import { useContext } from "react";

export default function DragDrop({
	itemIds,
	handleDragEnd,
}: {
	itemIds: number[];
	handleDragEnd: (event: any) => void;
}) {
	const [gameState, gameDispatch] = useContext(GameContext);
	return (
		<DndContext
			collisionDetection={closestCenter}
			autoScroll={false}
			onDragEnd={handleDragEnd}
			sensors={useSensors(
				useSensor(MouseSensor, {
					activationConstraint: {
						distance: 2,
					},
				}),
				useSensor(TouchSensor, {
					activationConstraint: {
						distance: 2,
					},
					delayConstraint: 200,
				}),
				//useSensor(KeyboardSensor)
			)}>
			<SortableContext items={itemIds} strategy={rectSwappingStrategy}>
				<GridBoard itemIds={itemIds} cells={gameState.cells} />
			</SortableContext>
			
		</DndContext>
	);
}
