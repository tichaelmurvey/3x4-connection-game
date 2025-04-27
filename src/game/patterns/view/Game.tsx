import { Feedback, Solution } from "@/game/gptAttempt/gameLogic";
import puzzles from "@/game/patterns/data/puzzles.json";
import { gameConfig } from "@/game/patterns/model/config";
import {
	GameState,
	initialGameState,
	PuzzleSolution,
} from "@/game/patterns/model/model";
import { Action, gameUpdate } from "@/game/patterns/update/gameUpdate";
import DragDrop from "@/game/patterns/view/DragDrop";
import { DragEndEvent } from "@dnd-kit/core";
import { arraySwap } from "@dnd-kit/sortable";
import {
	Blockquote,
	Button,
	Container,
	Group,
	InputError,
	Stack,
	Text,
} from "@mantine/core";
import { createContext, useReducer, useState } from "react";

export const GameContext = createContext<
	[GameState, React.ActionDispatch<[action: Action]>]
>(null as any);

export function Game() {
	const [gameState, gameDispatch] = useReducer(gameUpdate, initialGameState);

	const [itemIds, setItemIds] = useState<number[]>(
		Array.from({ length: 9 }, (_, i) => i)
	);
	console.log("rendering game", gameState);

	function handleDragEnd(event: DragEndEvent) {
		console.log("handleDragEnd", event);
		const { active, over } = event;
		if (!active || !active.data || !over || !over.data) {
			return;
		}
		if (active.id !== over.id) {
			setItemIds((itemIds) => {
				const oldIndex = itemIds.indexOf(active.id as number);
				const newIndex = itemIds.indexOf(over.id as number);

				return arraySwap(itemIds, oldIndex, newIndex);
			});
		}
	}

	async function startGame() {
		//timeout
		await new Promise((resolve) => setTimeout(resolve, 500));
		gameDispatch({
			type: "INIT",
			puzzle: puzzles.puzzles[0] as PuzzleSolution,
			initialGameState,
			gameConfig,
		});
	}
	// function handleSubmitAnswers() {
	// 	const feedback = checkAnswers(gameState);
	// 	console.log("feedback", feedback);
	// 	if (feedback.status === "error") {
	// 		setErrorMessage(feedback.errorMessage);
	// 	}
	// 	else {
	// 		setErrorMessage(undefined);
	// 	}
	// 	if (feedback.status === "completed") {
	// 		setWinData(feedback);
	// 	} else {
	// 		//lock all items which have been solved
	// 		const newState = structuredClone(gameState);
	// 		for (const color in newState.cellData) {
	// 			if (!isActiveColor(color)) continue;
	// 			if(feedback[color]) {
	// 				newState.cellData[color].forEach((item) => item.locked = true);
	// 				newState.openColors[color] = false;
	// 			}
	// 		}
	// 		console.log("newState", newState);
	// 		setGameState(newState);
	// 	}
	// }

	return (
		<Container size="xl">
			<Stack align="center" justify="flex-start">
				<link rel="stylesheet" href="rainbow.scss" />
				<h1>Fog of Four</h1>
				<p>Connect the groups of 3 to find the pivotal word</p>
				<InputError>{gameState.submitError}</InputError>
				{gameState.won ? "You've won!" : null}
				{gameState.phase === "play" ||
				gameState.phase === "won" ||
				gameState.phase === "lost" ? (
					<>
						<GameContext.Provider value={[gameState, gameDispatch]}>
							<DragDrop
								itemIds={itemIds}
								handleDragEnd={handleDragEnd}
							/>
						</GameContext.Provider>
						<GuessCounter
							guesses={gameState.guessesRemaining}
							maxGuesses={gameState.maxGuesses}
						/>
						<Group justify="center">
							<Button
								variant="outline"
								onClick={() =>
									gameDispatch({ type: "CLEAR_CELLS" })
								}>
								Deselect All
							</Button>

							<Button
								disabled={!gameState.submitValid}
								onClick={() =>
									gameDispatch({ type: "SUBMIT" })
								}>
								Submit
							</Button>
						</Group>
					</>
				) : null}
				{gameState.phase === "init" ? (
					<Container size="xl">
						<Button onClick={() => startGame()}>Start Game</Button>
					</Container>
				) : null}
			</Stack>
		</Container>
	);
}

export function WinMessage({
	solution,
	feedback: winData,
}: {
	solution: Solution;
	feedback: Feedback;
}) {
	const colorsAndConnections = Object.keys(winData)
		.map((color) => {
			const feedbackProp = winData[color as keyof Feedback];
			if (
				typeof feedbackProp === "string" &&
				feedbackProp.includes("line") &&
				Object.keys(solution).includes(feedbackProp)
			) {
				return {
					color,
					connection: solution[feedbackProp as keyof Solution],
				};
			}
		})
		.filter(
			(obj) =>
				obj && obj.color !== undefined && obj.connection !== undefined
		) as unknown as { color: string; connection: string }[];

	if (colorsAndConnections.length === 0) return null;
	return (
		<>
			{colorsAndConnections.map(({ color, connection }) => (
				<Blockquote color={color}>{connection}</Blockquote>
			))}
		</>
	);
}

function GuessCounter({
	guesses,
	maxGuesses,
}: {
	guesses: number;
	maxGuesses: number;
}) {
	let guessBulbs = "";
	for (let i = 0; i < maxGuesses; i++) {
		if (i < guesses) {
			guessBulbs += "💡";
		} else {
			guessBulbs += "💥";
		}
	}
	return (
		<Group justify="center">
			<Text>Guesses: {guessBulbs}</Text>
		</Group>
	);
}
