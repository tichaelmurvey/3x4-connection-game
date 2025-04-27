import { GameConfig } from "@/game/patterns/model/config";
import { Cell, GameState, initialCell, LockableCategoryId, PuzzleSolution } from "@/game/patterns/model/model";
import { changeColor } from "@/game/patterns/update/changeColor";
import { checkGroups, checkRainbow } from "@/game/patterns/update/checkGroups";
import { validateGuesses } from "@/game/patterns/update/validateGuesses";

export type Action = InitAction | SubmitAction | ChangeColorAction | ClearCells;

export type ChangeColorAction = {
	type: "CHANGE_COLOR";
	cellId: number;
}

type SubmitAction = {
	type: "SUBMIT";
}

type InitAction = {
	type: "INIT",
	puzzle: PuzzleSolution;
	initialGameState : GameState;
	gameConfig: GameConfig;
}

type ClearCells = {
	type: "CLEAR_CELLS";
}



export const gameUpdate = (gameState: GameState, action: Action) => {
	switch (action.type) {
		case "INIT":
			return createNewGame(gameState, action);
		
		case "SUBMIT":
			return submitAnswer(gameState, action);
		
		case "CHANGE_COLOR":
			return isValidSubmit(changeColor(gameState, action));

		case "CLEAR_CELLS":
			return clearNonLockedCells(gameState);

		default:
			throw new Error("Invalid action type");
	}
}


function createNewGame(gameState: GameState, action: InitAction) {
	if(gameState.phase !== "init") throw new Error("Game already initialized");
	const newGameState = structuredClone(gameState);
	newGameState.cells = createCells(action.puzzle, action.gameConfig);
	newGameState.puzzleId = action.puzzle.id;
	newGameState.puzzleSolution = action.puzzle;
	newGameState.phase = "play";
	return newGameState;
}

function createCells(puzzle: PuzzleSolution, gameConfig: GameConfig) : Cell[] {
	const labelsAndGroups = puzzle.groups.flatMap((group, groupId) => group.map((label) => ({label, groupId})));
	//shuffle labels
	labelsAndGroups.sort(() => Math.random() - 0.5);
	const cells : Cell[] = labelsAndGroups.map((labelAndGroup, cellId) => {
		return {
			...initialCell, 
			id: cellId, 
			label: labelAndGroup.label,
			groupId: labelAndGroup.groupId as LockableCategoryId,
			x: cellId % gameConfig.xGrid,
			y: Math.floor(cellId / gameConfig.xGrid)
		}
	});
	cells.push({
		...initialCell,
		id: cells.length,
		label: puzzle.rainbow,
		groupId: "rainbow",
	})
	return cells;
}

function submitAnswer(gameState: GameState, action: SubmitAction) {
	if(gameState.phase !== "play") {
		console.log("Game is not in play");
		return gameState;
	}

	let newGameState = structuredClone(gameState);

	if(newGameState.puzzleSolution === null) {
		throw new Error("Puzzle solution not set");
	}

	//check if any colours have too many guesses
	newGameState = validateGuesses(newGameState);
	if(newGameState.submitError) return newGameState;

	//check rainbows
	newGameState = checkRainbow(newGameState);
	
	//check solution for each group
	newGameState = checkGroups(newGameState);

	//check if input cost any lives
	newGameState = checkWrongGuesses(newGameState);

	//clear colour of non-locked cells
	newGameState = clearNonLockedCells(newGameState);

	return newGameState;
}

function checkWrongGuesses(gameState: GameState) : GameState {
	console.log("checking wrong guesses");
	let guessedWrong = false;
	for (const cell of gameState.cells) {
		if (guessedWrong) continue;
		console.log("checking cell", cell, cell.locked, cell.colorName);
		if (cell.locked) continue;
		if (cell.colorName === "cNeutral") continue;
		console.log("guessed wrong on", cell);
		guessedWrong = true;
	}
	if (guessedWrong) {
		console.log("subtracting guess");
		gameState.guessesRemaining--;
	}
	return gameState;
}

function clearNonLockedCells(gameState: GameState) : GameState {
	console.log("checking non-locked cells");
	const newGameState = structuredClone(gameState);
	console.log(newGameState.cells);
	newGameState.cells = newGameState.cells.map((cell) => {
		if (cell.locked) return cell;
		cell.colorName = "cNeutral";
		return cell;
	});
	console.log(newGameState.cells);
	newGameState.submitValid = true;
	return newGameState;
}

export function isValidSubmit(gameState: GameState){
	const testGameState = submitAnswer(gameState, {type: "SUBMIT"});
	gameState.submitValid = true;
	if(testGameState.submitError) {
		gameState.submitValid = false;
	}
	console.log("isValidSubmit", gameState.submitValid, testGameState.submitError);
	return gameState;
}