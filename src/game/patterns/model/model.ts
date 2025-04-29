

//model of game state. Includes:
//Current status of each cell, including colour, label, solved vs unsolved, x and y pos in grid, and which colors are available, and which set it's part of.
//Whether the game is won or not
//Number of guesses remaining

import { gameConfig } from "@/game/patterns/model/config";

export type Cell = {
	id: number;
	x: number;
	y: number;
	colorName: ColorIndex;
	groupId: LockableCategoryId;
	label: string;
	locked: boolean;
	lockedGroup: LockableCategoryId | null;
}

export type GroupId = 0 | 1 | 2 | 3 ;
export type LockableCategoryId = GroupId | "rainbow";
export type ColorIndex = "cNeutral" | "c1" | "c2" | "c3" | "c4" | "cRainbow";

export type PuzzleSolution = {
	id: number;
	rainbow: string;
	groups: [string, string][];
	connections: string[];
}

export type Phase = "init" | "play" | "won" | "lost" | "loading";

export type GameState = {
	phase: Phase;
	puzzleId: number;
	cells: Cell[];
	guessesRemaining: number;
	maxGuesses: number;
	over: boolean;
	multiGroupColors: ColorIndex[];
	colorCycle: ColorIndex[];
	rainbowStatus: boolean;
	groupStatus:  {
		rainbow: false | ColorIndex;
		[key: number]: false | ColorIndex;
	}
	submitError: string | null;
	submitValid: boolean;
	puzzleSolution: PuzzleSolution | null;
}

export const initialGameState: GameState = {
	phase: "init",
	puzzleId: -1,
	cells: [],
	guessesRemaining: gameConfig.maxGuesses,
	maxGuesses: gameConfig.maxGuesses,
	over: false,
	rainbowStatus: false,
	multiGroupColors: ["c1", "c2", "c3", "c4"],
	colorCycle: ["cNeutral"],
	groupStatus: {
		rainbow: false,
		0: false,
		1: false,
		2: false,
		3: false,
	},
	submitError: null,
	submitValid: false,
	puzzleSolution: null,
}

export const initialCell: Cell = {
	id: -1,
	x: 0,
	y: 0,
	colorName: "cNeutral",
	label: "",
	groupId: 0,
	locked: false,
	lockedGroup: null,
}