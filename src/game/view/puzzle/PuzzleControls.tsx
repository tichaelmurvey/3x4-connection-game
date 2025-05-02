import { DispatchContext, ValidMoveContext } from "@/game/view/home/Game";
import { Button, Group } from "@mantine/core";
import { memo, useContext } from "react";

export const PuzzleControls = memo(function PuzzleControls() {
	//const [gameState, gameDispatch] = useContext(GameStateContext);
	const gameDispatch = useContext(DispatchContext);
	const validMove = useContext(ValidMoveContext);
	return (
		<Group justify="center">
			<Button
				variant="outline"
				onClick={() => gameDispatch({ type: "CLEAR_CELLS" })}
			>
				Deselect All
			</Button>

			<Button
				disabled={!validMove}
				onClick={() => gameDispatch({ type: "SUBMIT" })}
				>
				Submit
			</Button>
		</Group>
	);
});
