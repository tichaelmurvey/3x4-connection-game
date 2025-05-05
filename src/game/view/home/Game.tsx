import { getAllPuzzles } from "@/game/commands/firebase";
import {
	Cell,
	GameState,
	initialGameState,
	Phase
} from "@/game/model/model";
import { Action, gameUpdate } from "@/game/update/gameUpdate";
import { Stack } from "@mantine/core";
import { writeStorage } from '@rehooks/local-storage';
import { createContext, memo, useCallback, useEffect, useReducer } from "react";
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
	return structuredClone(initialGameState) as unknown as GameState;
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
		<div
			style={{
				height: "100%",
				overflowY: "scroll",
			}}
			>
				<Stack ta="center" align="center">
				<Outlet />
				</Stack>
		</div>
	)
});

async function updatePuzzleData(){
	const puzzlesData = await getAllPuzzles();
	console.log("found puzzles from server"	, puzzlesData);
	writeStorage('puzzlesData', puzzlesData);
}