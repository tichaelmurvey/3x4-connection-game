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
	// const {puzzlesData, gamesData} = cookies as {puzzlesData?: PuzzleSolution[], gamesData?: GamesWonOrLost};

	useEffect(() => {
		puzzlesData && puzzlesData.length > 0 && setPuzzles(puzzlesData);
	}, [puzzlesData]);

	if (puzzles.length === 0) {
		return <div>Loading...</div>;
	}
	const puzzleCards = puzzles.map((puzzle, i) => {
		const status = gamesData[puzzle.id]?.phase;
		const statusMessage = status === "won" ? "✅" : status === "lost" ? "😞" : "";
		return (
			<Card key={i} 
			shadow= "sm"
			padding="lg" 
			radius="md" 
			maw={200}
			withBorder
			component={Link}
			to={`/puzzle/${puzzle.id}`}
			className = "puzzle-card"
			style={{
				cursor:  "pointer",
			}}
			>
				<PuzzleIcon status={status} />
				<Title order={3} >Example Puzzle {i + 1} {statusMessage}</Title>
			</Card>
		)
	})

	return (
		<Group justify="center" align="center">
			{puzzleCards}
		</Group>
	);
}