import { GridBoard } from "@/game/view/puzzle/GridBoard";
import { DndContext, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, rectSwappingStrategy } from "@dnd-kit/sortable";
import { memo } from "react";

export const DragDrop = memo(function DragDrop({
	itemIds,
	handleDragEnd,
}: {
	itemIds: number[];
	handleDragEnd: (event: any) => void;
}) {
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
				<GridBoard itemIds={itemIds} />
			</SortableContext>
			
		</DndContext>
	);
});
