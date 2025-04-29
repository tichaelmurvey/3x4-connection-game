import { GameState } from "@/game/patterns/model/model";

export function validateGuesses(gameState: GameState): GameState {
	gameState.submitError = null;

	const rainbowColoredCells = gameState.cells.filter((cell) => cell.colorName === "cRainbow");

	if (rainbowColoredCells.length > 1) {
		gameState.submitError = "You can't submit a guess with more than one rainbow tile";
		return gameState;
	}

	const rainbowCell = gameState.cells.find(cell => cell.groupId === 'rainbow');
	if (!rainbowCell) throw new Error("Rainbow cell not found");

	const cellsOfAnyColor = gameState.cells.filter((cell) => cell.colorName !== "cNeutral");
	if (cellsOfAnyColor.length === 0) gameState.submitError = "You can't submit a guess with no tiles";
	for (const color of gameState.colorCycle.concat(gameState.multiGroupColors)) {
		if (color === "cNeutral") continue;

		const groupCells = gameState.cells.filter((cell) => cell.colorName === color);
		const guesses = groupCells.length;
		console.log("cells of color", color, guesses, groupCells);
		const lockedCellsAnyColor = gameState.cells.filter((cell) => cell.locked && cell.colorName !== "cNeutral");
		const anyLockedCells = gameState.cells.filter((cell) => cell.locked);
		

		if (lockedCellsAnyColor.length > 1) gameState.submitError =
			`You can't submit a guess with more than one locked tile.`;

		if (guesses === 1) gameState.submitError =
			`You can't submit a guess with less than 2 ${color} tiles.`;

		if (guesses === 2 && lockedCellsAnyColor.length === 0 ) gameState.submitError =
			`You can't submit a guess with 2 ${color} tiles and no rainbow tile.`;
		
		if (guesses > 3) gameState.submitError =
			`You can't submit a guess with more than 3 ${color} tiles.`;
		const lockedGroupCells = groupCells.filter((cell) => cell.locked);
	
		if (guesses === 3 && anyLockedCells.length > 0 && lockedCellsAnyColor.length === 0) gameState.submitError =
			`You can't submit a guess without committing to a rainbow.`;

		// if (guesses === 3 && rainbowCell.locked && rainbowCell.colorName !== color) gameState.submitError =
		// 	`You already have a set of three. One of them is the rainbow tile.`;
		
		if (lockedGroupCells.length > 1) gameState.submitError =
		`You can't submit a guess with more than one solved tile. Only one of them can be the rainbow.`;

		if (guesses === 3 && gameState.cells.filter((cell) => cell.colorName === "cRainbow").length === 1) gameState.submitError =
			`You can't submit a guess with 3 ${color} tiles and a rainbow tile.`;
	}
	return gameState;
}
