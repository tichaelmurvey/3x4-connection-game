import { GameConfig } from "@/game/patterns/model/config";
import { Cell, ColorIndex, GameState, initialCell, LockableCategoryId, PuzzleSolution } from "@/game/patterns/model/model";

export type Action = InitAction | SubmitAction | ChangeColorAction;

type ChangeColorAction = {
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



export const gameUpdate = (gameState: GameState, action: Action) => {
	switch (action.type) {
		case "INIT":
			return createNewGame(gameState, action);
		
		case "SUBMIT":
			return submitAnswer(gameState, action);
		
		case "CHANGE_COLOR":
			return changeColor(gameState, action);

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

function changeColor(gameState: GameState, action: ChangeColorAction) : GameState {

	if(gameState.phase !== "play") {
		console.log("Game is not in play");
		return gameState;
	}

	const newGameState = structuredClone(gameState);
	const cell = newGameState.cells[action.cellId];

	if(cell.locked) {
		const lockedCellGroupColor = newGameState.groupStatus[cell.lockedGroup];
		
		if(lockedCellGroupColor === false) {
			throw new Error("Cell is locked but group color could not be found");
		}

		if(newGameState.rainbowStatus){
			console.log("can't change color");
			return newGameState;
		}
		
		else if(cell.lockedGroup !== "rainbow" && cell.colorName === "cRainbow"){
			cell.colorName = lockedCellGroupColor;
		}

		else if (cell.lockedGroup === "rainbow" &&cell.colorName === lockedCellGroupColor) {
			cell.colorName = "cRainbow";
		}
		return newGameState;
	}
	
	//if not locked, just go to next color
	const currentColor = cell.colorName;
	cell.colorName = findNextColor(currentColor, gameState.colorCycle);
	return newGameState;
}


function findNextColor(currentColor: ColorIndex, colorCycle: ColorIndex[]): ColorIndex {
	const currentIndex = colorCycle.indexOf(currentColor);
	const nextIndex = (currentIndex + 1) % colorCycle.length;
	return colorCycle[nextIndex];
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

	return newGameState;
}

function checkRainbow(gameState: GameState) {
	//check if rainbow has been solved
	if(gameState.rainbowStatus) return gameState;
	
	const rainbowColoredCells = gameState.cells.filter((cell) => cell.colorName === "cRainbow");

	if (rainbowColoredCells.length > 1) {
		gameState.submitError = "You can't submit a guess with more than one rainbow tile";
		return gameState;
	}

	if(rainbowColoredCells.length === 0) return gameState;

	const rainbowCell = rainbowColoredCells[0];
	
	if(rainbowCell.groupId === "rainbow") {
		gameState.rainbowStatus = true;
		rainbowCell.locked = true;
	}
	return gameState;
}

function validateGuesses(gameState: GameState) : GameState {
	for (const color of gameState.multiGroupColors) {
		const guesses = gameState.cells.filter((cell) => cell.colorName === color).length;
		
		if(guesses > 3) gameState.submitError = 
		`You can't submit a guess with more than 3 ${color} tiles.`;
		
		if(guesses === 3 && gameState.rainbowStatus) gameState.submitError = 
		`You can't submit a guess with 3 ${color} tiles, you've already solved the rainbow tile.`;
		
		if(guesses === 3 && gameState.cells.filter((cell) => cell.colorName === "cRainbow").length === 1) gameState.submitError = 
		`You can't submit a guess with 3 ${color} tiles and a rainbow tile.`;
	}	
	return gameState;
}
	

function checkGroups(gameState: GameState) : GameState {
	for (let groupId = 0; groupId < gameState.puzzleSolution!.groups.length; groupId++) {
		
		//Check if group has been solved
		if(gameState.groupStatus[groupId]) continue;
		
		//find cells in group
		const groupCells = gameState.cells.filter((cell) => cell.groupId === groupId);
		
		//check if they match colour
		if(groupCells[0].colorName === "cNeutral" || groupCells[0].colorName !== groupCells[1].colorName) continue;

		//check if rainbow is the same colour
		if(!gameState.rainbowStatus){ 
			const rainbowCell = gameState.cells.find((cell) => cell.groupId === "rainbow");
			if(!rainbowCell) continue;
			if(rainbowCell.colorName !== groupCells[0].colorName) continue;
			rainbowCell.locked = true;
			rainbowCell.lockedGroup = groupId as LockableCategoryId;
			continue;
		}
		gameState.groupStatus[groupId] = groupCells[0].colorName;
		[groupCells[0], groupCells[1]].forEach((cell) => {
			cell.locked = true
			cell.lockedGroup = groupId as LockableCategoryId;
		});
	}
	//check if all groups have been solved
	gameState.won = Object.keys(gameState.groupStatus).every((groupId) => gameState.groupStatus[groupId as LockableCategoryId]);
	if(gameState.won) {
		gameState.phase = "won";
		return gameState;
	}

	//remove solved groups from colours without group
	const solvedColors = Object.values(gameState.groupStatus).filter((color) => color !== false);
	gameState.colorCycle = gameState.colorCycle.filter((color) => !solvedColors.includes(color));
	return gameState;
}