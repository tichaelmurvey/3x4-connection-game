import { GameContext, GameState, Item, colors } from "@/game/gptAttempt/Game";
import { GameColor } from "@/game/gptAttempt/gameLogic";
import { rectSwappingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AspectRatio, Box, Center, Container, Group, Text } from "@mantine/core";
import { useContext, useState } from "react";
import useFitText from "use-fit-text";

export function SortableItem({ id, item }: { id: number; item: Item }) {
	//console.log('rendering sortable item', id);
	// const [bgColorIndex, setBgColorIndex] = useState<number | undefined>(
	// 	undefined
	// );
	const [myColor, setMyColor] = useState<keyof GameState["cellData"] | "grey">("grey");
	const { fontSize, ref: fontSizeRef } = useFitText();
	const [gameState, setGameState, colorCycle] = useContext(GameContext);
	const style: React.CSSProperties = {
		//minWidth: "12rem",
		fontFamily: "sans-serif",
		fontWeight: 700,
		textTransform: "uppercase",
		width: "100%",
		height: "100%",
		borderRadius: "10px",
		display: "flex",
		flexDirection: "column",
		alignItems: "stretch",
		justifyContent: "stretch",
		overflow: "clip",
		position: "relative",
		textShadow: '3px 3px 10px rgba(255,255,255,.8)',
		backgroundColor: colors[myColor],

		//zIndex: isDragging ? 10 : "auto", // <-- z-index adjustment here
		// position: isDragging ? "relative" : "static", // <-- ensure z-index applies properly
	};

	function findNextColor(color: GameColor | "grey") : GameColor | "grey" {
		const colorIndex = gameState.colorOrder.indexOf(color);
		const newColor = gameState.colorOrder[(colorIndex + 1) % gameState.colorOrder.length] as GameColor | "grey";
		if (newColor === "grey") return "grey";
		return gameState.openColors[newColor] ? newColor : findNextColor(newColor);
	}


	function handleClick() {
		if(myColor !== "grey" && gameState.openColors[myColor] === false) {
			if(gameState.openColors.rainbow === false) return;
			setMyColor("rainbow");
			setGameState((prevState) => {
				const newState = structuredClone(prevState);
				newState.cellData[myColor].filter((gameItem) => gameItem.label !== item.label);
				newState.cellData.rainbow.push({label: item.label, locked: false});
				return newState;
			});
			return;
		}
		const newColor = findNextColor(myColor);
		setMyColor(newColor as GameColor);
		setGameState((prevState) => {
			const newState = structuredClone(prevState);
			if (myColor !== "grey") {
				newState.cellData[myColor] = newState.cellData[myColor].filter((gameItem) => gameItem.label !== item.label);
			}
			if(newColor !== "grey") {
				newState.cellData[newColor].push({label: item.label, locked: false});
			}
			return newState;
		})
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
		<AspectRatio ratio={1} key={item.id}>
			<ItemFrame item={item} id={id}>
			<Box 
			onClick={handleClick} 
			style={style}
			className={myColor} 
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
						{item.label}
					</Text>
				</Center>
				<Group justify="center" gap="1px" h="12px" p="0">
					{myColor !== "grey" &&
						[...Array(colors.cycle.indexOf(myColor)).keys()].map((num) => (
							<AccessibleColorDot key={`dot${num}`} />
						))}
				</Group>
			</Box>
			</ItemFrame>
		</AspectRatio>
	);
}

function ItemFrame({
	item,
	id,
	children,
}: {
	item: Item;
	id: number;
	children: React.ReactNode;
}) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({
			id: id,
			data: item,
			animateLayoutChanges: () => false,
			strategy: rectSwappingStrategy,
		});
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		//minWidth: "8rem",
		height: "100%",
	};
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