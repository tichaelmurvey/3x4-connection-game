import { GameState, PuzzleSolution } from "@/game/model/model";
import { HelpButton } from "@/game/view/home/Help";
import PuzzleIcon from "@/game/view/home/puzzleIcon";
import { Card, Text, Title } from "@mantine/core";
import { useLocalStorage } from "@rehooks/local-storage";
import { useEffect, useState } from "react";
import { Link } from "react-router";

export default function ChoosePuzzle() {
	const [puzzles, setPuzzles] = useState<PuzzleSolution[]>([]);
	const [puzzlesData] = useLocalStorage<PuzzleSolution[]>("puzzlesData");
	const [gamesData] = useLocalStorage<GameState[]>("gamesData", []);

	useEffect(() => {
		const newPuzzles = structuredClone(puzzlesData);
		if (newPuzzles && newPuzzles.length > 0) {
			newPuzzles.sort((a, b) => a.id - b.id);
			setPuzzles(newPuzzles);
		}
	}, [puzzlesData]);

	if (puzzles.length === 0) {
		return <div>Loading...</div>;
	}
	const puzzleCards = puzzles.map((puzzle, i) => {
		const puzzleIndex = puzzle.id;
		const status = gamesData?.[puzzleIndex]?.phase;
		const statusMessage =
			status === "won" ? "✅" : status === "lost" ? "😞" : "";

		const localTime = new Date();
		localTime.setTime(localTime.getTime() - 24 * 60 * 60 * 1000 * i);

		return (
			<div key={i}>
				<Card
					key={i}
					shadow="sm"
					padding="lg"
					radius="md"
					// miw="min(150px, 90%)"
					withBorder
					component={Link}
					flex="1 1 0px"
					to={`/puzzle/${puzzleIndex}`}
					className="puzzle-card"
					style={{
						cursor: "pointer",
					}}>
					<PuzzleIcon status={status} />
					<Title order={3} mt="sm" ta="center" fz="1.6rem">
						{i === 0
							? "Today"
							: localTime.toLocaleString("en-us", {
									weekday: "long",
							  })}{" "}
						{statusMessage}
					</Title>
					<Text fs="italic">
						{status === "play" ? "Continue" : ""}
					</Text>
					<Text fs="italic">{status === "won" ? "Nice!" : ""}</Text>
					<Text fs="italic">
						{status === "lost" ? "Better luck next time..." : ""}
					</Text>
					<Text fs="italic">{status === undefined ? "New" : ""}</Text>
				</Card>
			</div>
		);
	});
	return (
		<>
			<Title order={1}>Rainbow Connection</Title>
			<Text>
				Connect all 4 groups of 3. One "rainbow" word connects them all!
			</Text>
			<HelpButton />
			<Title order={2} my="sm" fz="2rem">
				Daily Puzzle
			</Title>
			<div style={{ width: "min(300px, 100%)" }}>{puzzleCards[0]}</div>
			<Title order={2} my="sm" fz="2rem">
				Previous Puzzles
			</Title>
			<div
				style={{
					display: "grid",
					gridTemplateColumns:
						"repeat( auto-fit, minmax(200px, 1fr))",
					justifyItems: "stretch",
					gap: "20px",
					padding: "20px",
					width: "min(600px, 100%)",
				}}>
				{puzzleCards.slice(1)}
			</div>
		</>
	);
}
