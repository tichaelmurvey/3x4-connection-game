import { gameConfig } from "@/game/model/config";
import {
	GameState,
	initialGameState,
	PuzzleSolution,
} from "@/game/model/model";
import { GameStateContext } from "@/game/view/home/Game";
import { CategoryRevealer } from "@/game/view/puzzle/CategoryRevealer";
import { DragDrop } from "@/game/view/puzzle/DragDrop";
import { GuessCounter } from "@/game/view/puzzle/GuessCounter";
import { PuzzleControls } from "@/game/view/puzzle/PuzzleControls";
import YouLost from "@/game/view/puzzle/YouLost";
import { YouWon } from "@/game/view/puzzle/YouWon";
import { DragEndEvent } from "@dnd-kit/core";
import { arraySwap } from "@dnd-kit/sortable";
import { InputError } from "@mantine/core";
import { useLocalStorage, writeStorage } from "@rehooks/local-storage";
import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";

export default function Puzzle() {
	const [gameState, gameDispatch] = useContext(GameStateContext);
	const [puzzlesData] = useLocalStorage<PuzzleSolution[]>("puzzlesData");
	const [gamesData] = useLocalStorage<unknown[]>("gamesData", []);
	const [itemIds, setItemIds] = useState<number[]>(
		Array.from({ length: 9 }, (_, i) => i)
	);

	const params = useParams();
	const puzzleId = Number(params.puzzleId);
	const [savedGame, setSavedGame] = useState<GameState>(
		puzzleId && gamesData[puzzleId] && isGameState(gamesData[puzzleId])
			? gamesData[puzzleId]
			: initialGameState
	);

	useEffect(() => {
		loadGame();
	}, [puzzlesData, savedGame]);

	function loadGame() {
		console.warn(
			"attempting to find puzzle data",
			puzzleId,
			gameState,
			puzzlesData
		);
		if (!gameState || gameState.puzzleId === -1) {
			console.log("game state is uninitialized, looking for staged game");
		}
		else if (
			gameState.puzzleId === puzzleId &&
			["play", "lost", "won"].includes(gameState.phase)
		) {
			console.log(
				"game state is already playing or completed with correct ID, returning without acting"
			);
			return;
		}
		 else if (gameState.puzzleId !== puzzleId) {
			console.log(
				"another puzzle is in gamestate, saving it to localstorage and continuing"
			);
			gamesData[gameState.puzzleId] = gameState;
			writeStorage("gamesData", gamesData);
		}
		if (savedGame && savedGame.puzzleId !== puzzleId) {
			console.log("saved gamestate is for another puzzle, saving it to localstorage and continuing");
			gamesData[savedGame.puzzleId] = savedGame;
			writeStorage("gamesData", gamesData);
		}

		if (savedGame && savedGame.puzzleId === puzzleId) {
			console.log("loading game state from savegame state", savedGame);
			gameDispatch({ type: "LOAD_GAME", saveData: savedGame });
			return;
		} else if (gamesData[puzzleId]) {
			console.log(
				"loading game state from localstorage",
				gamesData[puzzleId]
			);
			const verifiedGameState = isGameState(gamesData[puzzleId])
				? gamesData[puzzleId]
				: initialGameState;
			setSavedGame(verifiedGameState);
			gameDispatch({ type: "LOAD_GAME", saveData: verifiedGameState });
			return;
		} else {
			console.log(
				"saved gamestate is invalid/not initialized, continuing"
			);
		}

		if (!puzzlesData) {
			console.log("puzzles data not set, waiting");
			return;
		}
		const puzzle = puzzlesData.find((puzzle) => puzzle.id === puzzleId);
		if (puzzle) {
			console.log("puzzle found, no valid save, starting game");
			startGame(puzzle);
		}
	}
	useEffect(() => {
		//listen for game updates and update gamesData
		if (gameState.puzzleSolution === null) return;
		if(!gameState || !gameState.puzzleSolution || !gameState.puzzleSolution.id) return;
		if (gameState.phase === "init") return;
		//console.log(gameState.guessesRemaining, savedGame.guessesRemaining, gameState.groupStatus, savedGame.groupStatus);
		if (
			gameState.guessesRemaining === savedGame.guessesRemaining &&
			gameState.phase === savedGame.phase &&
			JSON.stringify(gameState.groupStatus) ===
				JSON.stringify(savedGame.groupStatus)
		) {
			return;
		}
		gamesData[gameState.puzzleSolution.id] = gameState;
		setSavedGame(gameState);
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
		gameDispatch({
			type: "INIT",
			puzzle: structuredClone(puzzle),
			initialGameState: structuredClone(initialGameState),
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
		console.log("puzzle not found", gameState, puzzleId);
		//rerun effect after a second
		setTimeout(() => {
			loadGame();
		}, 1000);
		return <div>Loading...</div>;
	}

	return (
		<>
			<InputError>{gameState.submitError}</InputError>
			<CategoryRevealer gameState={gameState} />
			{gameState.phase === "lost" ? <YouLost /> : null}
			{gameState.phase === "won" ? <YouWon /> : null}
			<DragDrop itemIds={itemIds} handleDragEnd={handleDragEnd} />
			<GuessCounter
				guesses={gameState.guessesRemaining}
				maxGuesses={gameState.maxGuesses}
			/>
			<PuzzleControls />
		</>
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
