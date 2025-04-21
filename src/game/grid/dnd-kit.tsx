import Draggable from "@/game/grid/Draggable";
import Droppable from "@/game/grid/Droppable";
import { DndContext, DragOverlay, DragStartEvent } from "@dnd-kit/core";

import { Group, Paper, Text } from "@mantine/core";
import { useState } from "react";

const mockdata = [
	{ title: "Credit cards", color: "violet" },
	{ title: "Banks nearby", color: "indigo" },
	{ title: "Transfers", color: "blue" },
	{ title: "Refunds", color: "green" },
	{ title: "Receipts", color: "teal" },
	{ title: "Taxes", color: "cyan" },
	{ title: "Reports", color: "pink" },
	{ title: "Payments", color: "red" },
	{ title: "Cashback", color: "orange" },
];

export default function Grid() {
	const items = mockdata.map((item) => (
		<Draggable key={item.title} title={item.title}>
			<Paper
				className="item"
				p="md"
				style={{ boxShadow: "0 0 5px 0 #AAA", borderRadius: "10px" }}>
				<Text size="m" mt={7}>
					{item.title}
				</Text>
			</Paper>
		</Draggable>
	));

	const slots = mockdata.map((item) => (
		<Droppable key={item.title} title={item.title}>
			<Paper h="8em" w="8em" bg="lightgrey"></Paper>
		</Droppable>
	));

	const [activeId, setActiveId] = useState<string | null>(null);

	return (
		<DndContext 
		onDragStart={handleDragStart} 
		onDragEnd={handleDragEnd}
		>
			<Group>{items}</Group>
			<Group>
				<DragOverlay>
					<Paper
						h="8em"
						w="8em"
						className="item"
						p="md"
						style={{
							border: "2px solid red",
							boxShadow: "0 0 5px 0 #AAA",
							borderRadius: "10px",
						}}>
						<Text size="m" mt={7}>
							{activeId}
						</Text>
					</Paper>
				</DragOverlay>
			</Group>
		</DndContext>
	);

	function handleDragStart(event: DragStartEvent) {
		setActiveId(event.active.id as string);
	}

	function handleDragEnd() {
		setActiveId(null);
	}
}
