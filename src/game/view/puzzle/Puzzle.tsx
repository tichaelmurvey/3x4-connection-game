import TutorialPuzzle from "@/game/data/tutorial_puzzle.json";
import { gameConfig } from "@/game/model/config";
import { GameState, PuzzleSolution } from "@/game/model/model";
import { Action } from "@/game/update/gameUpdate";
import { GameStateContext } from "@/game/view/home/Game";
import { CategoryRevealer } from "@/game/view/puzzle/CategoryRevealer";
import { DragDrop } from "@/game/view/puzzle/DragDrop";
import { GuessCounter } from "@/game/view/puzzle/GuessCounter";
import { PuzzleControls } from "@/game/view/puzzle/PuzzleControls";
import YouLost from "@/game/view/puzzle/YouLost";
import { YouWon } from "@/game/view/puzzle/YouWon";
import TutorialText from "@/game/view/tutorial/TutorialText";
import { DragEndEvent } from "@dnd-kit/core";
import { arraySwap } from "@dnd-kit/sortable";
import {
	InputError,
	Space,
	Stack
} from "@mantine/core";
import { useLocalStorage, writeStorage } from "@rehooks/local-storage";
import {
	ActionDispatch,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { useNavigate, useParams } from "react-router";

export default function Puzzle() {
	const [hasVisited, setHasVisited] = useLocalStorage<boolean>(
		"hasVisited",
		false
	);
	const [gameState, gameDispatch] = useContext(GameStateContext);
	const [puzzlesData] = useLocalStorage<PuzzleSolution[]>("puzzlesData");
	const [gamesData] = useLocalStorage<unknown[]>("gamesData", []);
	const navigate = useNavigate();

	const [itemIds, setItemIds] = useState<number[]>(
		Array.from({ length: 9 }, (_, i) => i)
	);

	const params = useParams();
	const puzzleId = Number(params.puzzleId) || -33;
	// const [savedGame, setSavedGame] = useState<GameState>(
	// 	puzzleId && gamesData[puzzleId] && isGameState(gamesData[puzzleId])
	// 		? gamesData[puzzleId]
	// 		: initialGameState
	// );
	useEffect(() => {
		if (puzzleId !== -33) {
			return;
		}
		console.warn("has visited", hasVisited);
		if (!gameState || !gameState.phase || gameState.phase === "init") {
			startGame(TutorialPuzzle as unknown as PuzzleSolution);
		} 
	}, []);

	useEffect(() => {
		if (puzzleId === -33) {
			return;
		}
		loadGame(
			{
				puzzleId,
				gameState,
				puzzlesData,
				writeStorage,
				gamesData,
			},
			startGame,
			gameDispatch
		);
	}, [puzzlesData]);

	useEffect(() => {
		//listen for game updates and update gamesData
		if (gameState.puzzleSolution === null) return;
		if (
			!gameState ||
			gameState.puzzleId === -1 ||
			gameState.puzzleId === undefined
		)
			return;
		if (gameState.phase === "init") return;
		const savedGame = gamesData[gameState.puzzleId];
		if (!savedGame) {
			gamesData[gameState.puzzleId] = gameState;
			writeStorage("gamesData", gamesData);
			return;
		}
		if (!isGameState(savedGame)) {
			gamesData[gameState.puzzleId] = gameState;
			writeStorage("gamesData", gamesData);
			return;
		}
		if (
			gameState.guessesRemaining === savedGame.guessesRemaining &&
			gameState.phase === savedGame.phase &&
			JSON.stringify(gameState.groupStatus) ===
				JSON.stringify(savedGame.groupStatus)
		) {
			console.log("no need to save, all data is the same");
			return;
		}
		gamesData[gameState.puzzleId] = gameState;
		writeStorage("gamesData", gamesData);
	}, [gameState]);

	const handleDragEnd = useCallback(
		function handleDragEnd(event: DragEndEvent) {
			const { active, over } = event;
			if (!active || !over) {
				return;
			}
			if (active.id !== over.id) {
				setItemIds((itemIds) => {
					const oldIndex = itemIds.indexOf(active.id as number);
					const newIndex = itemIds.indexOf(over.id as number);

					return arraySwap(itemIds, oldIndex, newIndex);
				});
			}
		},
		[setItemIds]
	);

	function startGame(puzzle: PuzzleSolution) {
		console.log("starting game now", puzzle.id, puzzleId);
		gameDispatch({
			type: "INIT",
			puzzle: structuredClone(puzzle),
			gameConfig,
		});
		writeStorage("gamesData", {
			...gamesData,
			[puzzle.id]: { status: "play" },
		});
	}

	if (
		!gameState ||
		gameState.puzzleId === -1 ||
		gameState.puzzleId !== puzzleId
	) {
		console.log("puzzle not found in gamestate", gameState, puzzleId);
		return <div>Loading...</div>;
	}

	return (
		<Stack p="0" m="0" w="min(500px, 100%)" gap="sm" ta="center" h="100%" align="center">
			<InputError>{gameState.submitError}</InputError>
			{gameState.phase === "play" || gameState.phase === "init" ? (
				gameState.puzzleSolution?.id === -33 ? (
					<TutorialText />
				) : null
			) : null}
			{gameState.phase === "lost" ? <YouLost /> : null}
			{gameState.phase === "won" ? <YouWon /> : null}
			<CategoryRevealer gameState={gameState} />
			<DragDrop itemIds={itemIds} handleDragEnd={handleDragEnd} />
			{gameState.phase === "play" || gameState.phase === "init" ? (
				<GuessCounter
					guesses={gameState.guessesRemaining}
					maxGuesses={gameState.maxGuesses}
				/>
			) : null}
			{gameState.phase === "play" || gameState.phase === "init" ? (
				<PuzzleControls />
			) : null}
			<Space flex="1 1 0px" />
			{/* <Container w="100%" m="0" p="0" ta="left">
				<ActionIcon
					size="lg"
					aria-label="Back"
					variant="transparent"
					color="black"
					autoContrast
					onClick={() => {
						setHasVisited(true);
						navigate("/");
					}}
					>
					<RiArrowLeftBoxLine size={100} />
				</ActionIcon>
			</Container> */}
		</Stack>
	);
}

function isGameState(gameState: unknown): gameState is GameState {
	const gameStateObj = gameState as GameState;
	if (
		"puzzleId" in gameStateObj &&
		"puzzleSolution" in gameStateObj &&
		"phase" in gameStateObj
	)
		return true;
	return false;
}

type loadGameParams = {
	puzzleId: number;
	gameState: unknown;
	puzzlesData: PuzzleSolution[] | null;
	writeStorage: (key: string, value: unknown) => void;
	gamesData: unknown[];
};

function loadGame(
	params: loadGameParams,
	startGame: (puzzle: PuzzleSolution) => void,
	gameDispatch: ActionDispatch<[action: Action]>
) {
	const { puzzleId, gameState, puzzlesData, gamesData } = params;
	console.warn(
		"attempting to find puzzle data",
		puzzleId,
		gameState,
		puzzlesData
	);

	//check for currently running game
	const inReducer = tryGameState(params);
	if (inReducer) return;

	//check for locally saved game
	const inLocalStorage = tryLocalStorage(params);
	if (inLocalStorage) {
		gameDispatch({ type: "LOAD_GAME", saveData: inLocalStorage });
		return;
	}

	//check for puzzles data
	const usedPuzzlesData = tryPuzzlesData(params);
	if (!usedPuzzlesData) return;

	startGame(usedPuzzlesData);
}

function tryGameState(params: loadGameParams) {
	const { puzzleId, gameState } = params;
	//check for currently running game
	if (!isGameState(gameState)) {
		console.log("game state is not valid");
		return false;
	}
	if (gameState.puzzleId === -1) {
		console.log("game state is uninitialized");
		return false;
	}
	if (gameState.puzzleId === puzzleId) {
		console.log("existing game state is good", gameState);
		return true;
	}
	if (gameState.puzzleId !== puzzleId) {
		console.log("game state is for another puzzle.");
		return false;
	}
}

function tryLocalStorage(params: loadGameParams) {
	const { puzzleId, gamesData } = params;

	if (!gamesData) {
		console.log("no local game data found");
		return false;
	}
	if (!gamesData[puzzleId]) {
		console.log("no game data found for this puzzle", puzzleId);
		return false;
	}
	const verifiedGameState = gamesData[puzzleId];
	if (!isGameState(verifiedGameState)) {
		console.log("game data is not valid");
		return false;
	}
	if (verifiedGameState.puzzleId === puzzleId) {
		console.log("loading game state from localstorage", verifiedGameState);
		return verifiedGameState;
	} else {
		console.log("indexes in localstorage are out of sync");
		return false;
	}
}

function tryPuzzlesData(params: loadGameParams) {
	const { puzzleId, puzzlesData } = params;
	//check for puzzles data
	if (!puzzlesData) {
		console.log("local puzzles data not found");
		return false;
	}

	const puzzle = puzzlesData.find((puzzle) => puzzle.id === puzzleId);

	if (!puzzle) {
		throw new Error("Puzzle not found in puzzles data");
	}
	console.log(
		"puzzle found, no valid save, starting game",
		puzzleId,
		puzzle.id
	);
	return puzzle;
}
