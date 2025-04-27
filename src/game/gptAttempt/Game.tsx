import CheckButtons from "@/game/gptAttempt/Checkline";
import { checkAnswers, Feedback, isActiveColor, shuffle, Solution } from "@/game/gptAttempt/gameLogic";
import { GridBoard } from "@/game/gptAttempt/GridBoard";
import {
	closestCenter,
	DndContext,
	DragEndEvent,
	DragOverEvent,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arraySwap,
	rectSwappingStrategy,
	SortableContext
} from "@dnd-kit/sortable";
import { Blockquote, Container, InputError, Stack } from "@mantine/core";
import { createContext, useEffect, useRef, useState } from "react";

export const solution: Solution = {
	rainbow: {
		words: ["Rainbow"],
	},
	line1: {
		words: ["Tricolour", "Nordic Cross"],
		connection: "Flag patterns",
	},
	line2: {
		words: ["Major scale", "Week"],
		connection: "Sets of seven",
	},
	line3: {
		words: ["Witch", "Brain"],
		connection: "Song topics in The Wizard of Oz",
	},
	line4: {
		words: ["Internet", "Love"],
		connection: "Types of Connection",
	},
};

export const words = Object.keys(solution).flatMap((key) => solution[key as keyof Solution].words);


export type Item = {
	id: string;
	index: number;
	label: string;
	locked?: boolean;
};

export const colors = {
	pink: "#FFC1CF",
	yellow: "#E8FFB7",
	purple: "#E2A0FF",
	blue: "#C4F5FC",
	green: "#B7FFD8",
	grey: "#F2F2F2",
	rainbow: "transparent",
	cycle: [] as string[]
};

const initialGameItems = Array.from({ length: 9 }, (_, i) => ({
	id: `game-${i}-${words[i]}`,
	index: i,
	label: words[i],
	color: colors.grey,
}));

const initialIds = [
	0,1,2,3,4,5,6,7,8
];

colors.cycle = ["grey", "green", "yellow", "pink", "blue", "rainbow"];


export type GameStateItem = {
	label: string;
	locked?: boolean;
}

export type GameState = {
	cellData: {
		pink: GameStateItem[];
		yellow: GameStateItem[];
		green: GameStateItem[];
		blue: GameStateItem[];
		rainbow: GameStateItem[];
	}
	openColors: {
		pink: boolean;
		yellow: boolean;
		green: boolean;
		blue: boolean;
		rainbow: boolean;
	},
	colorOrder: string[];
}

export const GameContext = createContext<[GameState, React.Dispatch<React.SetStateAction<GameState>>, string[]]>(null as any);

export function Game() {
	const gameItems = useRef<Item[]>(initialGameItems);
	const [itemIds, setItemIds] = useState<number[]>([]);
	const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
	const [winData, setWinData] = useState<Feedback | undefined>(undefined);
	const [colorCycle, setColorCycle] = useState<string[]>(colors.cycle);
	useEffect(() => {
		console.log("itemIds effect", itemIds);
		setItemIds(shuffle(initialIds));
	}, []);

	const [gameState, setGameState] = useState<GameState>({
		cellData: {green: [],
		yellow: [],
		pink: [],
		blue: [],
		rainbow: []},
		openColors: {
			green: true,
			yellow: true,
			pink: true,
			blue: true,
			rainbow: true
		},
		colorOrder: ["grey","green", "yellow", "pink", "blue", "rainbow"]
	});
	console.log("rendering game", gameState);
	function handleDragOver(event: DragOverEvent) {
		console.log("handleDragOver", event);
	}
	function handleDragEnd(event: DragEndEvent) {
		console.log("handleDragEnd", event);
		const { active, over } = event;
		if (!active || !active.data || !over || !over.data) {
			return;
		}
		// const activeData = active.data as unknown as Item;
		// const overData = over.data as unknown as Item;
		if (active.id !== over.id) {
			setItemIds((itemIds) => {
				const oldIndex = itemIds.indexOf(active.id as number);
				const newIndex = itemIds.indexOf(over.id as number);

				return arraySwap(itemIds, oldIndex, newIndex);
			});
		}
	}
	function handleSubmitAnswers() {
		const feedback = checkAnswers(gameState);
		console.log("feedback", feedback);
		if (feedback.status === "error") {
			setErrorMessage(feedback.errorMessage);
		}
		else {
			setErrorMessage(undefined);
		}
		if (feedback.status === "completed") {
			setWinData(feedback);
		} else {
			//lock all items which have been solved
			const newState = structuredClone(gameState);
			for (const color in newState.cellData) {
				if (!isActiveColor(color)) continue;
				if(feedback[color]) {
					newState.cellData[color].forEach((item) => item.locked = true);
					newState.openColors[color] = false;
				}
			}
			console.log("newState", newState);
			setGameState(newState);
		}
	}

	return (
		<Container size="xl">
			<Stack align="center" justify="flex-start">
			<link rel="stylesheet" href="rainbow.scss" />
			<h1>Fog of Four</h1>
			<p>Connect the groups of 3 to find the pivotal word</p>
			<InputError>{errorMessage}</InputError>
			{winData ? <WinMessage solution={solution} feedback={winData} /> : null}
			<GameContext.Provider value={[gameState, setGameState, colorCycle]}>
			<DndContext
				collisionDetection={closestCenter}
				autoScroll={false}
				// onDragStart = {handleDragStart}
				onDragOver = {handleDragOver}
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
					useSensor(KeyboardSensor)
				)}
				>
				<SortableContext
					items={itemIds}
					strategy={rectSwappingStrategy}>
					<GridBoard itemIds={itemIds} items={gameItems.current} />
				</SortableContext>
				<CheckButtons checkAnswers={handleSubmitAnswers} />
			</DndContext>
			</GameContext.Provider>
			</Stack>
		</Container>
	);
}

export function WinMessage({solution, feedback: winData} : {solution: Solution, feedback: Feedback}) {
	const colorsAndConnections = Object.keys(winData).map((color) => {
		const feedbackProp = winData[color as keyof Feedback]
		if(typeof feedbackProp === "string" && feedbackProp.includes("line") && Object.keys(solution).includes(feedbackProp)) {
			return {color, connection: solution[feedbackProp as keyof Solution]};
		}
	}).filter((obj) => obj && obj.color !== undefined && obj.connection !== undefined) as unknown as {color: string, connection: string}[];

	if (colorsAndConnections.length === 0) return null;
	return (
		<>
		{colorsAndConnections.map(({color, connection}) => (<Blockquote color={color}>{connection}</Blockquote>))}
		</>
	);
}