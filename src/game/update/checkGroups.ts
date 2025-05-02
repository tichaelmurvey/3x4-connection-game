import { GameState, LockableCategoryId } from "@/game/model/model";

export function checkGroups(gameState: GameState): GameState {
	for (let groupId = 0; groupId < gameState.puzzleSolution!.groups.length; groupId++) {
		//Check if group has been solved
		if (gameState.groupStatus[groupId]) continue;

		//find cells in group
		const groupCells = gameState.cells.filter((cell) => cell.groupId === groupId);

		//check if they match colour
		if (groupCells[0].colorName === "cNeutral" || groupCells[0].colorName !== groupCells[1].colorName) continue;

		//check if rainbow is the same colour
		if (!gameState.rainbowStatus) {
			const rainbowCell = gameState.cells.find((cell) => cell.groupId === "rainbow");
			if (!rainbowCell) continue;
			if (rainbowCell.colorName !== groupCells[0].colorName) continue;
			rainbowCell.locked = true;
			rainbowCell.lockedGroup = 'rainbow';
			rainbowCell.colorName = 'cRainbow';
			gameState.groupStatus["rainbow"] = 'cRainbow';
		}
		
		gameState.groupStatus[groupId] = groupCells[0].colorName;
		[groupCells[0], groupCells[1]].forEach((cell) => {
			cell.locked = true;
			cell.lockedGroup = groupId as LockableCategoryId;
			cell.lockedColor = cell.colorName;
		});
	}
	//check if all groups have been solved
	gameState.over = Object.keys(gameState.groupStatus).every((groupId) => gameState.groupStatus[groupId as LockableCategoryId]);
	if (gameState.over) {
		gameState.phase = "won";
		return gameState;
	}

	//remove solved groups from colours without group
	const solvedColors = Object.values(gameState.groupStatus).filter((color) => color !== false);
	gameState.colorCycle = gameState.colorCycle.filter((color) => !solvedColors.includes(color));
	//add next color to cycle
	gameState = updateActiveColor(gameState);
	return gameState;
}

export function checkRainbow(gameState: GameState) {
	//check if rainbow has been solved
	if (gameState.rainbowStatus) return gameState;

	const rainbowColoredCells = gameState.cells.filter((cell) => cell.colorName === "cRainbow");

	if (rainbowColoredCells.length === 0) return gameState;

	const rainbowCell = rainbowColoredCells[0];

	if (rainbowCell.groupId === "rainbow") {
		gameState.rainbowStatus = true;
		rainbowCell.locked = true;
		rainbowCell.lockedGroup = "rainbow";
		gameState.groupStatus["rainbow"] = rainbowCell.colorName;
	}
	return gameState;
}

export function updateActiveColor(gameState: GameState): GameState {
	if (gameState.colorCycle.length === 1) {
		//console.log("updating active color", gameState.colorCycle, gameState.multiGroupColors);
		gameState.colorCycle = gameState.colorCycle.concat(gameState.multiGroupColors.splice(0, 1));
	}
	//console.log("updated active color", gameState.colorCycle);
	return gameState;
}

