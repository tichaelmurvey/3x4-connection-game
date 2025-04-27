import { viewConfig } from "@/game/patterns/model/config";
import { Cell } from "@/game/patterns/model/model";
import { GameContext } from "@/game/patterns/view/Game";
import { rectSwappingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AspectRatio, Box, Center, Container, Text } from "@mantine/core";
import React, { useContext } from "react";
import useFitText from "use-fit-text";

export function SortableItem({ id, cell }: { id: number; cell: Cell }) {
	//console.log('rendering sortable item', id);
	// const [bgColorIndex, setBgColorIndex] = useState<number | undefined>(
	// 	undefined
	// );
	// const [myColor, setMyColor] = useState<keyof GameState["cellData"] | "grey">("grey");
	const { fontSize, ref: fontSizeRef } = useFitText();
	const [gameState, gameDispatch] = useContext(GameContext);
	const style: React.CSSProperties = {
		//minWidth: "12rem",
		fontFamily: "sans-serif",
		fontWeight: 700,
		textTransform: "uppercase",
		width: "100%",
		height: "100%",
		//borderRadius: "10px",
		display: "flex",
		flexDirection: "column",
		alignItems: "stretch",
		justifyContent: "stretch",
		overflow: "clip",
		position: "relative",
		textShadow: '3px 3px 10px rgba(255,255,255,.8)',
	};
	if(cell.colorName !== "cRainbow"){
		style.backgroundColor = cell.locked ? viewConfig.colors[cell.colorName] : viewConfig.colors.cNeutral;
		style.border = cell.locked ? "none" : `10px solid ${viewConfig.colors[cell.colorName]}`;
	}
	function handleClick() {
		gameDispatch({ type: "CHANGE_COLOR", cellId: cell.id });
	}

	// useEffect (() => {
	// 	const myNewColor = bgColorIndex !== undefined ? getKeyByValue(colors, colorCycle[bgColorIndex]) as keyof GameState: null;
	// 	console.log("updating gamestate", bgColorIndex, myColor, myNewColor);
	// 	if (!myColor) {
	// 		console.log("returning early");
	// 		return;
	// 	}
	// 	if (myNewColor === myColor || !myNewColor) {
	// 		console.log("new color not found");
	// 		return;
	// 	}
	// 	setGameState((prevState) => {
	// 		const newGameState = {...prevState};
	// 		if (myColor !== "grey") {
	// 			newGameState[myColor] = newGameState[myColor].filter((gameItem) => gameItem.label !== item.label);
	// 		}
	// 		newGameState[myNewColor].push(item);
	// 		return newGameState;
	// 		})
	// 	setMyColor(myNewColor);

	// }, [bgColorIndex]);
	
	return (
		<AspectRatio ratio={1} key={cell.id}>
			<ItemFrame cell={cell} id={id}>
			<Box 
			onClick={handleClick} 
			style={style}
			className={`${cell.colorName}${cell.lockedGroup === "rainbow" ? "-locked" : gameState.groupStatus[cell.lockedGroup] || ""}`}
			>
				<div />
				<Center
					style={{
						flexGrow: 10,
						textAlign: "center",
						userSelect: "none",
					}}>
					<Text
						key="label"
						ref={fontSizeRef}
						fw="700"
						style={{
							fontSize,
							userSelect: "none",
						}}>
						{cell.label}
					</Text>
				</Center>
				{/* <Group justify="center" gap="1px" h="12px" p="0">
					{myColor !== "grey" &&
						[...Array(colors.cycle.indexOf(myColor)).keys()].map((num) => (
							<AccessibleColorDot key={`dot${num}`} />
						))}
				</Group> */}
			</Box>
			</ItemFrame>
		</AspectRatio>
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
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
		useSortable({
			id: id,
			data: cell,
			animateLayoutChanges: () => false,
			strategy: rectSwappingStrategy,
		});
	const style : React.CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition,
		//minWidth: "8rem",
		height: "100%",
		position: "relative",
	};
	if(isDragging) {
		style.zIndex = 100;
	} else {
		style.zIndex = 0;
	}
	return <Container p={0} h="100%" fluid style={style} ref={setNodeRef} {...attributes} {...listeners}>{children}</Container>;
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

function getKeyByValue(object : Record<string, any>, value : string) {
	return Object.keys(object).find(key => object[key] === value);
  }