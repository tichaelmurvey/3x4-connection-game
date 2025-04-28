import { ColorIndex, GameState } from "@/game/patterns/model/model";
import { ChangeColorAction } from "@/game/patterns/update/gameUpdate";


export function changeColor(gameState: GameState, action: ChangeColorAction): GameState {

	if (gameState.phase !== "play") {
		console.log("Game is not in play");
		return gameState;
	}

	const newGameState = structuredClone(gameState);
	const cell = newGameState.cells[action.cellId];

	if (cell.locked) {
		const lockedCellGroupColor = newGameState.groupStatus[cell.lockedGroup];

		if (lockedCellGroupColor === false) {
			throw new Error("Cell is locked but group color could not be found");
		}

		// if (newGameState.rainbowStatus) {
		// 	console.log("can't change color");
		// 	return newGameState;
		// }

		// else if (cell.lockedGroup !== "rainbow" && cell.colorName === "cRainbow") {
		// 	cell.colorName = lockedCellGroupColor;
		// }

		// else if (cell.lockedGroup !== "rainbow" && cell.colorName === lockedCellGroupColor) {
		// 	cell.colorName = "cRainbow";
		// }
		//return newGameState;
	}	
	
	//if not locked, find next valid color
	const currentColor = cell.colorName;
	cell.colorName = findNextValidColor(currentColor, gameState);
	return newGameState;
}

function findNextValidColor(color: ColorIndex, gameState: GameState): ColorIndex {
	const nextColor =findNextColor(color, gameState.colorCycle);
	if(nextColor === "cNeutral") return nextColor;
	if(nextColor === color) throw new Error("Could not find next color");
	//check if there are already 3 of that color
	const sameColorCells = gameState.cells.filter((cell) => cell.colorName === nextColor);
	const isRainbowColor = gameState.cells.filter((cell) => cell.colorName === "cRainbow").length > 0;
	if (sameColorCells.length >= 3) return findNextValidColor(nextColor, gameState);
	if (isRainbowColor && sameColorCells.length === 2) return findNextValidColor(nextColor, gameState);
	if (isRainbowColor && nextColor === "cRainbow") return findNextValidColor(nextColor, gameState);
	return nextColor;
}

function findNextColor(currentColor: ColorIndex, colorCycle: ColorIndex[]): ColorIndex {
	const currentIndex = colorCycle.indexOf(currentColor);
	const nextIndex = (currentIndex + 1) % colorCycle.length;
	return colorCycle[nextIndex];
}


