import {
	closestCenter,
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";

import { Item } from "./Item";
import { SortableItem } from "./SortableItem";

export function SortableFromDocs() {
	const [activeId, setActiveId] = useState<string | number | null>(null);
	const [items, setItems] = useState(["1", "2", "3"]);
	const [pool, setPool] = useState(["hat", "cat"]);
	const [collections, setCollections] = useState({
		items,
		pool
	});
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);
	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}>
			<SortableContext
				key='grid'
				items={items}
				strategy={verticalListSortingStrategy}>
				{items.map((id) => (
					<SortableItem key={id} id={id} value={undefined} style={{
						border: "1px solid red",
					}}/>
				))}
			</SortableContext>
			<SortableContext
				key='pool'
				items={pool}
				strategy={verticalListSortingStrategy}>
				{pool.map((id) => (
					<SortableItem key={id} id={id} value={undefined} style={{
						border: "1px solid red",
					}}/>
				))}
			</SortableContext>

			<DragOverlay>
				{activeId ? <Item id={String(activeId)} /> : null}
			</DragOverlay>
		</DndContext>
	);

	function handleDragStart(event: DragStartEvent) {
		const { active } = event;

		setActiveId(active.id);
	}

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		console.log('drag end', active.id, over?.id)

		if (over && active.id !== over.id) {
			setItems((items) => {
				const oldIndex = items.indexOf(String(active.id));
				const newIndex = items.indexOf(String(over.id));

				return arrayMove(items, oldIndex, newIndex);
			});
		}

		setActiveId(null);
	}
}
