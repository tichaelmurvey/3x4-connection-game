import { GameState, PuzzleSolution } from "@/game/model/model";
import PuzzleIcon from "@/game/view/home/puzzleIcon";
import { Card, Group, Title } from "@mantine/core";
import { useLocalStorage } from '@rehooks/local-storage';
import { useEffect, useState } from "react";
import { Link } from "react-router";

export default function ChoosePuzzle() {
	const [puzzles, setPuzzles] = useState<PuzzleSolution[]>([]);
	const [puzzlesData] = useLocalStorage<PuzzleSolution[]>('puzzlesData');
	const [gamesData] = useLocalStorage<GameState[]>('gamesData', []);

	useEffect(() => {
		puzzlesData && puzzlesData.length > 0 && setPuzzles(puzzlesData);
	}, [puzzlesData]);

	if (puzzles.length === 0) {
		return <div>Loading...</div>;
	}
	const puzzleCards = puzzles.map((puzzle) => {
		const puzzleIndex = puzzle.id;
		const status = gamesData?.[puzzleIndex]?.phase;
		const statusMessage = status === "won" ? "✅" : status === "lost" ? "😞" : "";
		return (
			<Card key={puzzleIndex} 
			shadow= "sm"
			padding="lg" 
			radius="md" 
			maw={200}
			withBorder
			component={Link}
			to={`/puzzle/${puzzleIndex}`}
			className = "puzzle-card"
			style={{
				cursor:  "pointer",
			}}
			>
				<PuzzleIcon status={status} />
				<Title order={3} >Example Puzzle {puzzleIndex} {statusMessage}</Title>
			</Card>
		)
	})

	return (
		<Group justify="center" align="center">
			{puzzleCards}
		</Group>
	);
}