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

		if (newGameState.rainbowStatus) {
			console.log("can't change color");
			return newGameState;
		}

		else if (cell.lockedGroup !== "rainbow" && cell.colorName === "cRainbow") {
			cell.colorName = lockedCellGroupColor;
		}

		else if (cell.lockedGroup !== "rainbow" && cell.colorName === lockedCellGroupColor) {
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


