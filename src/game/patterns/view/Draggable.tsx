import { Cell } from "@/game/patterns/model/model";
import { GameContext } from "@/game/patterns/view/Game";
import { rectSwappingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Center, Container, Text } from "@mantine/core";
import React, { useContext } from "react";
import useFitText from "use-fit-text";

export function SortableItem({ id, cell }: { id: number; cell: Cell }) {
	const { fontSize, ref: fontSizeRef } = useFitText();
	const [gameState, gameDispatch] = useContext(GameContext);
	const style: React.CSSProperties = {
		fontFamily: "sans-serif",
		fontWeight: 700,
		textTransform: "uppercase",
		height: "100%",
		width: "100%",
		borderRadius: "10px",
		position: "relative",
		textShadow: "3px 3px 10px rgba(255,255,255,.8)",
	};

	function handleClick() {
		gameDispatch({ type: "CHANGE_COLOR", cellId: cell.id });
	}

	const solvedColors = Object.values(gameState.groupStatus).filter((color) => color !== false && color !== "cRainbow");
	const solvedColorsString = solvedColors.join(" rainbow-with-");
	//console.log("colordata", cell.label, cell.colorName, cell.locked, cell.lockedGroup, gameState.groupStatus?[cell.lockedGroup] : "", cell.lockedGroup === "rainbow", solvedColorsString);
	return (
			<ItemFrame cell={cell} id={id}>
				<Center
					component="button"
					onClick={handleClick}
					style={style}
					p="2px"
					className={
						`draggable ${
							cell.colorName
							} ${
							cell.locked ? "locked-" : ""
							}${
							cell.lockedGroup !== null ? gameState.groupStatus[cell.lockedGroup] : ""
							} rainbow-with-${
								cell.lockedGroup === "rainbow" ? solvedColorsString : ""
							}
					`}>
					<Text
						key="label"
						fw="700"
						ref={fontSizeRef}
						style={{
							fontSize,
							width: "100%",
							userSelect: "none",
							textAlign: "center",
						}}>
						{cell.label}
					</Text>
				</Center>
			</ItemFrame>
	);
}

function ItemFrame({
	cell: cell,
	id,
	children,
}: {
	cell: Cell;
	id: number;
	children: React.ReactNode;
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: id,
		data: cell,
		animateLayoutChanges: () => false,
		strategy: rectSwappingStrategy,
	});
	const style: React.CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition,
		width: "100%",
		height: "100%",
		touchAction: "none",
		position: "relative",
	};
	if (isDragging) {
		style.zIndex = 100;
	} else {
		style.zIndex = 0;
	}
	return (
		<Container
			p={0}
			h="100%"
			fluid
			style={style}
			ref={setNodeRef}
			{...attributes}
			{...listeners}
			tabIndex={-1}
			>
			{children}
		</Container>
	);
}

function AccessibleColorDot() {
	return (
		<span
			style={{
				userSelect: "none",
				display: "inline",
				padding: "0px 0px",
				lineHeight: "12px",
				fontSize: "12px",
			}}>
			•
		</span>
	);
}

function getKeyByValue(object: Record<string, any>, value: string) {
	return Object.keys(object).find((key) => object[key] === value);
}
