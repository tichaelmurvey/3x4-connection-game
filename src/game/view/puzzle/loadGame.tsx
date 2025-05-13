import { PuzzleSolution } from "@/game/model/model";
import { Action } from "@/game/update/gameUpdate";
import { ActionDispatch } from "react";
import { isGameState } from "./Puzzle";

export function loadGame(
	params: loadGameParams,
	startGame: (puzzle: PuzzleSolution) => void,
	gameDispatch: ActionDispatch<[action: Action]>
) {
	const { puzzleId, gameState, puzzlesData, localGameStates: gamesData } = params;
	console.warn(
		"attempting to find puzzle data",
		puzzleId,
		gameState,
		puzzlesData
	);

	//check for currently running game
	if (tryGameState(params)) return;

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

export function tryGameState(params: loadGameParams) {
	const { puzzleId, gameState, puzzlesData } = params;
	//check for currently running game
	if (!isGameState(gameState)) {
		console.log("game state is not valid");
		return false;
	}
	if (gameState.puzzleId === -1) {
		console.log("game state is uninitialized");
		return false;
	}
	const puzzle = puzzlesData ? puzzlesData.find((puzzle) => puzzle.id === puzzleId) : null;
	if (gameState.puzzleSolution?.rainbow !== puzzle?.rainbow){
		console.log("loaded gamestate doesn't match rainbow word with puzzle from server");
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

export function tryLocalStorage(params: loadGameParams) {
	const { puzzleId, localGameStates: gamesData, puzzlesData } = params;

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
	const puzzle = puzzlesData ? puzzlesData.find((puzzle) => puzzle.id === puzzleId) : null;

	if(puzzle && verifiedGameState.puzzleSolution?.rainbow !== puzzle?.rainbow){
		console.log("rainbow word of locally saved gamestate doesn't match puzzle from server");
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

export function tryPuzzlesData(params: loadGameParams) {
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

export type loadGameParams = {
	puzzleId: number;
	gameState: unknown;
	puzzlesData: PuzzleSolution[] | null;
	writeStorage: (key: string, value: unknown) => void;
	localGameStates: unknown[];
};
