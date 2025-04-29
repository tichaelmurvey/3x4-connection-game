import { GameState } from "@/game/patterns/model/model";

export function clearNonLockedCells(gameState: GameState): GameState {
	console.log("checking non-locked cells");
	const newGameState = structuredClone(gameState);
	console.log(newGameState.cells);
	newGameState.cells = newGameState.cells.map((cell) => {
		// if(cell.locked && cell.colorName==="cRainbow" && cell.lockedGroup !== "rainbow"){
		// 	cell.colorName = cell.lockedGroup ? gameState.groupStatus[cell.lockedGroup] || "cNeutral" : "cNeutral";
		// 	return cell;
		// }
		// if (cell.locked) return cell;
		cell.colorName = "cNeutral";
		return cell;
	});
	console.log(newGameState.cells);
	newGameState.submitValid = true;
	return newGameState;
}
