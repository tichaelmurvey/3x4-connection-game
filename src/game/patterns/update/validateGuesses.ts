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

	for (const color of gameState.multiGroupColors) {
		if (!gameState.colorCycle.includes(color)) continue;

		const groupCells = gameState.cells.filter((cell) => cell.colorName === color);
		const guesses = groupCells.length;
		if (guesses === 1) gameState.submitError =
			`You can't submit a guess with less than 2 ${color} tiles.`;

		if (guesses === 2 && rainbowColoredCells.length === 0) gameState.submitError =
			`You can't submit a guess with 2 ${color} tiles and no rainbow tile.`;
		if (guesses > 3) gameState.submitError =
			`You can't submit a guess with more than 3 ${color} tiles.`;

		if (guesses === 3 && gameState.rainbowStatus) gameState.submitError =
			`You can't submit a guess with 3 ${color} tiles, you've already solved the rainbow tile.`;

		if (guesses === 3 && rainbowCell.locked && rainbowCell.colorName !== color) gameState.submitError =
			`You already have a set of three. One of them is the rainbow tile.`;

		if (guesses === 3 && gameState.cells.filter((cell) => cell.colorName === "cRainbow").length === 1) gameState.submitError =
			`You can't submit a guess with 3 ${color} tiles and a rainbow tile.`;
	}
	return gameState;
}
