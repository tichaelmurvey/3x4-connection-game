import { GameConfig } from "@/game/model/config";
import { Cell, ColorIndex, GameState, initialCell, initialGameState, LockableCategoryId, PuzzleSolution } from "@/game/model/model";
import { changeColor } from "@/game/update/changeColor";
import { checkGroups, checkRainbow, updateActiveColor } from "@/game/update/checkGroups";
import { clearNonLockedCells } from "@/game/update/clearNonLockedCells";
import { validateGuesses } from "@/game/update/validateGuesses";

export type Action = InitAction | SubmitAction | ChangeColorAction | ClearCells  | Test | LoadGame;

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
	gameConfig: GameConfig;
}

type ClearCells = {
	type: "CLEAR_CELLS";
}

type Test = {
	type: "TEST";
	data: any;
}

type LoadGame = {
	type: "LOAD_GAME";
	saveData: GameState;
}


function takesSomeTime() {
	let x = 0;
	while(x < 1000) {
		const y = Array.from({ length: 10000 }, (_, i) => i);
		y.find((i) => i === x);
		x++;
	}
}

function notInPlay(gameState: GameState){
	if(gameState.phase !== "play"){
		console.log("game is not in play, returning game state");
		return true
	};
	return false;
}

export const gameUpdate= (gameState: GameState, action: Action) : GameState => {
	switch (action.type) {
		case "TEST":
			console.log("test", gameState, action);
			return structuredClone(gameState);
		case "INIT":
			console.log("received init action", gameState, gameState.phase);
			return createNewGame(gameState, action);
		
		case "SUBMIT":
			if(notInPlay(gameState)) return structuredClone(gameState);
			return submitAnswer(gameState);
		
		case "CHANGE_COLOR":
			if(notInPlay(gameState)) return structuredClone(gameState)
			console.time("changeColor");
			const res = isValidSubmit(changeColor(gameState, action));
			console.log(gameState.colorCycle);
			console.timeEnd("changeColor");
			return res;

		case "CLEAR_CELLS":
			if(notInPlay(gameState)) return structuredClone(gameState);
			return clearNonLockedCells(gameState);
		case "LOAD_GAME":
			return loadGame(gameState, action);

		default:
			throw new Error("Invalid action type");
	}
}


function createNewGame(gameState: GameState, action: InitAction) {
	if(gameState.phase !== "init" && gameState.puzzleSolution?.id === action.puzzle.id) {
		console.log("undiagnosable multuple init actions bug");
		return structuredClone(gameState);
	}
	const newGameState = structuredClone(initialGameState) as unknown as GameState;
	newGameState.cells = createCells(action.puzzle, action.gameConfig);
	newGameState.puzzleId = action.puzzle.id;
	newGameState.puzzleSolution = action.puzzle;
	newGameState.phase = "play";
	updateActiveColor(newGameState);
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

function submitAnswer(gameState: GameState) {
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

	//check if lives are 0
	newGameState = checkLives(newGameState);

	return newGameState;
}

function checkWrongGuesses(gameState: GameState) : GameState {
	let guessedWrong = false;
	for (const cell of gameState.cells) {
		if (guessedWrong) continue;
		if (cell.locked) continue;
		if (cell.colorName === "cNeutral") continue;
		guessedWrong = true;
	}
	if (guessedWrong) {
		gameState.guessesRemaining--;
	}
	return gameState;
}

export function isValidSubmit(gameState: GameState){
	const testGameState = submitAnswer(gameState);
	gameState.submitValid = true;
	if(testGameState.submitError) {
		gameState.submitValid = false;
	}
	//console.log("isValidSubmit", gameState.submitValid, testGameState.submitError);
	return gameState;
}

function checkLives(gameState: GameState): GameState {
	if (gameState.guessesRemaining === 0) {
		gameState.phase = "lost";
		gameState.over = true;
		//solve all groups
		gameState.cells.forEach((cell) => {
			cell.locked = true;
			if (cell.groupId === "rainbow") cell.colorName = "cRainbow";
			if (cell.groupId !== 'rainbow') cell.lockedColor = `c${String(cell.groupId + 1)}` as ColorIndex;
			//if (typeof cell.groupId === "number") cell.colorName = `c${cell.groupId +1}` as ColorIndex;
			cell.lockedGroup = cell.groupId;
		});
		gameState.groupStatus["rainbow"] = "cRainbow";
		gameState.groupStatus[0] = "c1";
		gameState.groupStatus[1] = "c2";
		gameState.groupStatus[2] = "c3";
		gameState.groupStatus[3] = "c4";
	}
	return gameState;
}

function loadGame(gameState: GameState, action: LoadGame) {
	console.log("loading game", action.saveData);
	return structuredClone(action.saveData);
}
