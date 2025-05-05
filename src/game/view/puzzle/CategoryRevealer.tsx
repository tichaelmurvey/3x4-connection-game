import { GameState } from "@/game/model/model";
import { Box, Group } from "@mantine/core";
import { useMemo } from "react";


export function CategoryRevealer({ gameState }: { gameState: GameState; }) {
	const connections = useMemo(() => gameState.puzzleSolution!.connections, []);
	const revealers = useMemo(() => connections.map((connection, i) => {
		if (!gameState.groupStatus[i]) return null;
		return (
				<Box
					key={i}
					fw={500}
					fz="sm"
					ta="center"
					p="0.4rem"
					flex="1 1 fit-content"
					className={`answer ${gameState.groupStatus[i]}`}
					>
					{connection}
				</Box>
		);
}), [gameState.groupStatus, connections]);
	return (
		<Group align="stretch" gap="xs">
			{revealers}
		</Group>
	);
}
