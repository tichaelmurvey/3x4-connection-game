import { gameConfig } from "@/game/patterns/model/config";
import {
	GameState,
	initialGameState,
	Phase,
	PuzzleSolution,
} from "@/game/patterns/model/model";
import { Action, gameUpdate } from "@/game/patterns/update/gameUpdate";
import ChoosePuzzle from "@/game/patterns/view/ChoosePuzzle";
import DragDrop from "@/game/patterns/view/DragDrop";
import { DragEndEvent } from "@dnd-kit/core";
import { arraySwap } from "@dnd-kit/sortable";
import {
	Button,
	Center,
	Group,
	InputError,
	Paper,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { useCookies } from 'react-cookie';

export type GameMetadata = {
	status: Phase;
}
export type GamesWonOrLost = Record<number, GameMetadata>;

export type CookieData = {
	gamesData: GamesWonOrLost;
}

export const GameContext = createContext<
	[GameState, React.ActionDispatch<[action: Action]>]
>(null as any);

export function Game() {
	const [gameState, gameDispatch] = useReducer(gameUpdate, initialGameState);
	const [cookies, setCookie] = useCookies<'gamesData', CookieData>();

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
		const newCookieData = {...cookies.gamesData, [puzzle.id]: {status: 'play'}};
		setCookie('gamesData',newCookieData);
		gameDispatch({
			type: "INIT",
			puzzle,
			initialGameState,
			gameConfig,
		});
	}
	// useEffect(() => {
	// 	setCookie('gamesData',{});
	// }, []);

	useEffect(() => {
		console.log("updating gamestate cookies", gameState, cookies.gamesData);
		if (gameState.puzzleSolution && gameState.phase !== cookies.gamesData[gameState.puzzleSolution.id]?.status) {
			const newCookieData = {...cookies.gamesData, [gameState.puzzleSolution.id]: {status: gameState.phase}};
			setCookie('gamesData',newCookieData);
		}
	}, [gameState, cookies]);

	return (
		<Center>
			<Stack
				align="center"
				justify="flex-start"
				gap="sm"
				w="min(500px, 100%)">
				<link rel="stylesheet" href="rainbow.scss" />
				<Title order={1}>One to Free Four</Title>
				<Text>Connect the groups of 3 to find the pivotal word</Text>
				{gameState.phase === "play" ||
				gameState.phase === "won" ||
				gameState.phase === "lost" ? (
					<>
						<GameContext.Provider value={[gameState, gameDispatch]}>
						<InputError>{gameState.submitError}</InputError>
						{gameState.over && gameState.puzzleSolution ? (
							<WinMessage gameState={gameState} />
						) : null}
						{ gameState.phase === "lost" ? <YouLost /> : null}
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
					<Stack align="center" justify="center">
						<ChoosePuzzle startGame={startGame} />
					</Stack>
				) : null}
			</Stack>
		</Center>
	);
}

export function WinMessage({ gameState }: { gameState: GameState }) {
	const connections = gameState.puzzleSolution!.connections;
	const style: React.CSSProperties = {
		width: "100%",
	};
	return (
		<Group align="stretch" gap="xs">
			{connections.map((connection, i) => (
				<Paper
					key={i}
					fw={500}
					p="sm"
					className = {`answer ${gameState.groupStatus[i]  || "cNeutral"}`}
					>
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


function YouLost() {
	const [gameState, gameDispatch] = useContext(GameContext);
	return (
		<Stack align="center" justify="center">
			<Text fz="lg"><a target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/watch?v=Lzeqbws7FiE">Better luck next time...</a></Text>
			<Button onClick={() => gameDispatch({ type: "EXIT" })}>Try another puzzle</Button>
		</Stack>
	);
}