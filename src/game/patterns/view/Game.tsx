import { gameConfig, viewConfig } from "@/game/patterns/model/config";
import {
	GameState,
	initialGameState,
	PuzzleSolution,
} from "@/game/patterns/model/model";
import { Action, gameUpdate } from "@/game/patterns/update/gameUpdate";
import ChoosePuzzle from "@/game/patterns/view/ChoosePuzzle";
import DragDrop from "@/game/patterns/view/DragDrop";
import { DragEndEvent } from "@dnd-kit/core";
import { arraySwap } from "@dnd-kit/sortable";
import {
	Button,
	Group,
	InputError,
	Paper,
	Stack,
	Text,
	Title
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

	function startGame(puzzle: PuzzleSolution) {
		gameDispatch({
			type: "INIT",
			puzzle,
			initialGameState,
			gameConfig,
		});
	}

	return (
		<Stack align="center" justify="flex-start" gap="sm">
			<link rel="stylesheet" href="rainbow.scss" />
			<Title order={1}>One to Free Four</Title>
			<Text>Connect the groups of 3 to find the pivotal word</Text>
			{gameState.phase === "play" ||
			gameState.phase === "won" ||
			gameState.phase === "lost" ? (
				<>
				<InputError>{gameState.submitError}</InputError>
			{gameState.won && gameState.puzzleSolution ? (
				<WinMessage gameState={gameState} />
			) : null}
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
							onClick={() => gameDispatch({ type: "SUBMIT" })}>
							Submit
						</Button>
					</Group>
				</>
			) : null}
			{gameState.phase === "init" ? (
				<Stack align="center" justify="center">
					<ChoosePuzzle startGame={startGame} />
					{/* <Button onClick={() => startGame()}>Start Game</Button> */}
				</Stack>
			) : null}
		</Stack>
	);
}

export function WinMessage({ gameState }: { gameState: GameState }) {
	const connections = gameState.puzzleSolution!.connections;
	const style: React.CSSProperties = {
		width: "100%",
	};
	return (
		<Group justify="stretch" align="stretch" gap="xs">
			{connections.map((connection, i) => (
				<Paper
					key={i}
					fw={500}
					p="sm"
					style={style}
					bg={
						viewConfig.colors[
							gameState.groupStatus[i] || "cNeutral"
						]
					}>
					{connection}
				</Paper>
			))}
		</Group>
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
			<Text fz="lg">Guesses: {guessBulbs}</Text>
		</Group>
	);
}
