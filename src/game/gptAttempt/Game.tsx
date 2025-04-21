import {
	DndContext,
	DragEndEvent,
	DragStartEvent,
	useDraggable,
	useDroppable,
} from "@dnd-kit/core";
import {
	AspectRatio,
	Card,
	Center,
	Container,
	SimpleGrid,
	Stack,
	Title,
} from "@mantine/core";
import React, { useState } from "react";

const initialPool = Array.from({ length: 9 }, (_, i) => ({
	id: `pool-${i}`,
	label: `example${i + 1}`,
}));
const initialGame = Array.from({ length: 9 }, (_, i) => ({
	id: `game-${i}`,
	label: "",
}));

type Item = {
	id: string;
	label: string;
};

function DraggableCard({ item, activeId }: { item: Item, activeId: string | null }) {
	const { attributes, listeners, setNodeRef, transform, isDragging } =
		useDraggable({ id: item.id });

	const style: React.CSSProperties = {
		transform: transform
			? `translate3d(${transform.x}px, ${transform.y}px, 0)`
			: undefined,
		opacity: isDragging ? 0.8 : 1,
		cursor: "grab",
		// width: "100%",
		// height: "100%",
		zIndex: isDragging ? 10 : "auto", // <-- z-index adjustment here
		position: item.id === activeId ? "relative" : "static", // <-- ensure z-index applies properly
	};

	if (!item.label) {
		return null;
	}

	return (
		<AspectRatio ratio={1}>
			<div ref={setNodeRef} style={style} {...listeners} {...attributes}>
				<Card
					shadow="lg"
					style={{
						height: "100%",
						width: "100%",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						fontSize: 18,
						backgroundColor: "#f0f0f0",
					}}>
					{item.label}
				</Card>
			</div>
		</AspectRatio>
	);
}

function DroppableSlot({
	item,
	activeId,
	isGameGrid,
}: {
	item: Item;
	activeId: string | null;
	isGameGrid: boolean;
}) {
	const { isOver, setNodeRef } = useDroppable({ id: item.id });
	const isActive = activeId !== null;
	const shouldHighlight = isGameGrid && isActive;
	const borderWidth = 8;
	const style: React.CSSProperties = {
		position: "relative",
		backgroundColor: item.id === activeId ? "#efa234" : 
		isOver ? "#1a9975" : undefined,
		height: "100%",
		borderRadius: "20px",
		border:
			item.label
				? "0"
				: shouldHighlight
				? `${borderWidth}px dashed rgb(149, 127, 127)`
				: `${borderWidth}px dashed #aaaaaa`,

		transition: "background-color 0.2s, border-color 0.2s",
	};

	return (
		<div ref={setNodeRef} style={style}>
			{item.label ? <DraggableCard item={item} activeId={activeId} /> :

			<AspectRatio ratio={1} >
				<Card
					padding="md"
					bg="none"
					style={{
						height: "100%",
						width: "100%",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						
					}}></Card>
			</AspectRatio>}
		</div>
	);
}

function GridBoard({
	items,
	activeId,
	isGameGrid,
}: {
	items: Item[];
	activeId: string | null;
	isGameGrid: boolean;
}) {
	return (
		<AspectRatio ratio={1}>
			{/* <Center w="100%" h="100%"> */}
			<SimpleGrid
				cols={3}
				style={{
					justifyContent: "center",
					alignItems: "center",
				}}>
				{items.map((item) => (
					<DroppableSlot
						key={item.id}
						item={item}
						activeId={activeId}
						isGameGrid={isGameGrid}
					/>
				))}
			</SimpleGrid>
			{/* </Center> */}
		</AspectRatio>
	);
}

export function Game() {
	const [poolItems, setPoolItems] = useState<Item[]>(initialPool);
	const [gameItems, setGameItems] = useState<Item[]>(initialGame);
	const [activeId, setActiveId] = useState<string | null>(null);

	const findItemById = (id: string) => {
		const poolIndex = poolItems.findIndex((item) => item.id === id);
		if (poolIndex !== -1) return { location: "pool", index: poolIndex };
		const gameIndex = gameItems.findIndex((item) => item.id === id);
		if (gameIndex !== -1) return { location: "game", index: gameIndex };
		return null;
	};

	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(String(event.active.id));
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		setActiveId(null);
		if (!over) return;

		const activeItem = findItemById(String(active.id));
		const overItem = findItemById(String(over.id));

		if (!activeItem || !overItem) return;

		const newPool = [...poolItems];
		const newGame = [...gameItems];

		if (activeItem.location === "pool" && overItem.location === "pool") {
			[newPool[activeItem.index], newPool[overItem.index]] = [
				newPool[overItem.index],
				newPool[activeItem.index],
			];
		} else if (
			activeItem.location === "pool" &&
			overItem.location === "game"
		) {
			[newPool[activeItem.index], newGame[overItem.index]] = [
				newGame[overItem.index],
				newPool[activeItem.index],
			];
		} else if (
			activeItem.location === "game" &&
			overItem.location === "pool"
		) {
			[newGame[activeItem.index], newPool[overItem.index]] = [
				newPool[overItem.index],
				newGame[activeItem.index],
			];
		} else if (
			activeItem.location === "game" &&
			overItem.location === "game"
		) {
			[newGame[activeItem.index], newGame[overItem.index]] = [
				newGame[overItem.index],
				newGame[activeItem.index],
			];
		}

		setPoolItems(newPool);
		setGameItems(newGame);
	};

	return (
		<Container>
			<DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
				<Center>
					<Stack align="stretch">
						<Title my="md">Pool</Title>
						<GridBoard
							items={poolItems}
							activeId={activeId}
							isGameGrid={false}
						/>
						<Title my="md">Game</Title>
						<GridBoard
							items={gameItems}
							activeId={activeId}
							isGameGrid={true}
						/>
					</Stack>
				</Center>
			</DndContext>
		</Container>
	);
}
