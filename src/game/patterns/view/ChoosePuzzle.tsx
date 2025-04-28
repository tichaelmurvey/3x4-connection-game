import { getAllPuzzles } from "@/game/patterns/commands/firebase";
import { PuzzleSolution } from "@/game/patterns/model/model";
import PuzzleIcon from "@/game/patterns/view/puzzleIcon";
import { Card, Group, Title } from "@mantine/core";
import { useEffect, useState } from "react";

export default function ChoosePuzzle({ startGame }: { startGame: (puzzle: PuzzleSolution) => void }) {
	const [puzzles, setPuzzles] = useState<PuzzleSolution[]>([]);
	useEffect(() => {
		managePuzzleCollection(setPuzzles);
	}, []);
	if (puzzles.length === 0) {
		return <div>Loading...</div>;
	}
	return (
		<Group justify="center" align="center">
			{puzzles.map((puzzle, i) => (
				<Card key={i} 
				shadow="sm" 
				padding="lg" 
				radius="md" 
				withBorder
				component="button"
				onClick={() => startGame(puzzle)}
				>
					<PuzzleIcon />
					<Title order={3}>Example Puzzle {i + 1}</Title>
				</Card>
			))}
		</Group>
	);
}

async function managePuzzleCollection(
	setPuzzles: React.Dispatch<React.SetStateAction<PuzzleSolution[]>>
) {
	const puzzleData = await getAllPuzzles() as PuzzleSolution[];
	setPuzzles(puzzleData);
}
