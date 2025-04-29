import { getAllPuzzles } from "@/game/patterns/commands/firebase";
import { PuzzleSolution } from "@/game/patterns/model/model";
import { CookieData } from "@/game/patterns/view/Game";
import PuzzleIcon from "@/game/patterns/view/puzzleIcon";
import { Card, Group, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export default function ChoosePuzzle({ startGame }: { startGame: (puzzle: PuzzleSolution) => void }) {
	const [puzzles, setPuzzles] = useState<PuzzleSolution[]>([]);
	const [cookies, setCookie] = useCookies<'name', CookieData>(['name']);
	useEffect(() => {
		managePuzzleCollection(setPuzzles);
	}, []);
	if (puzzles.length === 0) {
		return <div>Loading...</div>;
	}
	return (
		<Group justify="center" align="center">
			{puzzles.map((puzzle, i) => {
				return (
				<Card key={i} 
				shadow= "sm"
				padding="lg" 
				radius="md" 
				maw={200}
				withBorder
				component="button"
				className = "puzzle-card"
				style={{
					cursor: cookies.gamesData[puzzle.id]?.status === "lost" || cookies.gamesData[puzzle.id]?.status === "won" ? "not-allowed" : "pointer",
				}}
				onClick={() => startGame(puzzle)}
				>
					<PuzzleIcon status={cookies.gamesData[puzzle.id]?.status} />
					{cookies.gamesData[puzzle.id]?.status === "lost" ? <Title order={3} >Example Puzzle {i + 1} 😞</Title> : null}
					{cookies.gamesData[puzzle.id]?.status === "won" ? <Title order={3} >Example Puzzle {i + 1} ✅</Title> : null}
					{cookies.gamesData[puzzle.id]?.status !== "lost" && cookies.gamesData[puzzle.id]?.status !== "won" ?  <Title order={3} >Example Puzzle {i + 1}</Title> : null}
				</Card>
			)})}
		</Group>
	);
}

async function managePuzzleCollection(
	setPuzzles: React.Dispatch<React.SetStateAction<PuzzleSolution[]>>
) {
	const puzzleData = await getAllPuzzles() as PuzzleSolution[];
	setPuzzles(puzzleData);
}
