import {
	Cell,
	GameState,
	initialGameState,
	Phase
} from "@/game/model/model";
import { Action, gameUpdate } from "@/game/update/gameUpdate";
import {
	Center,
	Stack,
	Text,
	Title
} from "@mantine/core";
import { writeStorage } from '@rehooks/local-storage';
import { createContext, memo, useCallback, useEffect, useReducer } from "react";

import { getAllPuzzles } from "@/game/commands/firebase";
import { Outlet } from "react-router";
  
export type GameMetadata = {
	status: Phase;
}
export type GamesWonOrLost = Record<number, GameMetadata>;


export const GameStateContext = createContext<[GameState, React.ActionDispatch<[action: Action]>]>(null as any);

export const DispatchContext = createContext<(action: Action) => void>(null as any);

export const ValidMoveContext = createContext<boolean>(false);
export const CellContext = createContext<Cell[] | null>(null as any);

function createInitialGameState(): GameState {
	return structuredClone(initialGameState);
}

export function Game() {
	const [gameState, gameDispatch] = useReducer(gameUpdate, null, createInitialGameState);

	useEffect(() => {
		updatePuzzleData();
	}, []);
	
	const sendDispatch = useCallback((action: Action) => {
		gameDispatch(action);
	}, []);

	return (
		<CellContext.Provider value={gameState.cells}>
		<ValidMoveContext.Provider value={gameState.submitValid}>
		<DispatchContext.Provider value={sendDispatch}>
		<GameStateContext.Provider value={[gameState, gameDispatch]}>
			<GameLayout />
		</GameStateContext.Provider>
		</DispatchContext.Provider>
		</ValidMoveContext.Provider>
		</CellContext.Provider>
	);
}

const GameLayout = memo(function GameLayout(){
	return (
		<Center>
		<Stack
			align="center"
			justify="flex-start"
			gap="sm"
			w="min(500px, 100%)">
			<Title order={1}>Rainbow Connection</Title>
			<Text>Connect all 4 groups of 3. One "rainbow" word connects them all!</Text>
				<Outlet />
		</Stack>
	</Center>
	)
});

async function updatePuzzleData(){
	const puzzlesData = await getAllPuzzles();
	console.log("found puzzles from server"	, puzzlesData);
	writeStorage('puzzlesData', puzzlesData);
}

// async function updatePuzzleCookies(
// 	puzzlesData: PuzzleSolution[],
// 	lastAccessed: string,
// 	setCookies: (name: "puzzlesData", value: Cookie, options?: CookieSetOptions) => void
// ) {
// 	console.log("fetching puzzles");
// 	const savedDate = new Date(lastAccessed);
// 	const secondsSinceLastAccess = Math.floor((new Date().getTime() - savedDate.getTime()) / 1000);
// 	console.log("checking freshness", new Date().toLocaleTimeString(), savedDate.toLocaleTimeString(), secondsSinceLastAccess);
// 	if(puzzlesData && (secondsSinceLastAccess < 500)){
// 		console.warn("puzzles are fresh, returning");
// 		return;
// 	}
// 	const puzzleRes = await getAllPuzzles();
// 	// if(puzzlesData && puzzlesData.length === puzzleRes.length) return;
// 	//console.log("setting puzzle cookies", puzzleRes);
// 	const currentDate = new Date();
// 	const currentDateString = currentDate.toISOString();
// 	console.log("setting puzzle cookies", puzzleRes, currentDateString);
// 	setCookies('puzzlesData', puzzleRes);
// 	//setCookies('lastAccessed', currentDateString);
// }

