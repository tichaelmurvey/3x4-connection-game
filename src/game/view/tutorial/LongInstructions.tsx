import TutorialPuzzle from "@/game/data/example_puzzle.json";
import { Cell, LockableCategoryId } from "@/game/model/model";
import { SortableItem } from "@/game/view/puzzle/Draggable";
import { AspectRatio, Container, SimpleGrid } from "@mantine/core";
import { useMemo } from "react";


export function LongInstructions() {
	const cells : Cell[] = TutorialPuzzle.groups.flatMap((group, i) => {
		return group.map((label, j) => {
			return {
				id: i * 2 + j,
				label,
				groupId: (i as LockableCategoryId),
				colorName: "cNeutral",
				locked: false,
				lockedColor: null,
				lockedGroup: null,
			};
		});
	});

	cells.push({
		id: cells.length,
		label: TutorialPuzzle.rainbow,
		groupId: 'rainbow',
		colorName: "cNeutral",
		locked: false,
		lockedColor: null,
		lockedGroup: null,
	});



	const cells1 = structuredClone(cells);
	cells1.forEach((cell) => {
		if (cell.groupId === 2 || cell.groupId === 'rainbow') {
			cell.colorName="c1";
		}
		
	});

	const cells2 = structuredClone(cells);
	cells2.forEach((cell) => {
		if (cell.groupId === 2) {
			cell.locked = true;
			cell.lockedColor = "c1";
			cell.lockedGroup = 2;
		}
		if (cell.groupId === 'rainbow') {
			cell.locked = true;
			cell.lockedColor = "cRainbow";
			cell.lockedGroup = "rainbow";
		}
		if (cell.groupId === 3 || cell.groupId === 'rainbow') {
			cell.colorName="c3";
		}
	});

	const cells3 = structuredClone(cells2);
	cells3.forEach((cell) => {
		if (cell.groupId === 3) {
			cell.locked = true;
			cell.lockedColor = "c3";
			cell.lockedGroup = 3;
		}
		if (cell.groupId === 'rainbow') {
			cell.locked = true;
			cell.lockedColor = "cRainbow";
			cell.lockedGroup = "rainbow";
			cell.colorName = "cNeutral";
		} else {
			cell.colorName = "cNeutral";
		}
	});

	const cells4 = structuredClone(cells3);
	cells4.forEach((cell) => {
		if (cell.groupId === 1) {
			cell.locked = true;
			cell.lockedColor = "c4";
			cell.lockedGroup = 1;
		}
		if (cell.groupId === 0) {
			cell.locked = true;
			cell.lockedColor = "c2";
			cell.lockedGroup = 0;
		}
	});

	return (
		<Container pb="md" fz="lg">
			<p>There are nine words in each puzzle, split into four categories.</p>
			<p>Each category has three words.</p> 
			<p>One <strong>Rainbow</strong> word is in all four categories.</p>
			<h2>Example game</h2>
			<TutorialGrid cells={cells1} solvedColors={[]} />
			<p>First, find <strong>three</strong> words which make a category.</p>
			<TutorialGrid cells={cells2} solvedColors={["c1"]} />
			<p>Guess another category. </p>
			<p>One of the words from the first category must be the <strong>Rainbow</strong>.</p>
			<TutorialGrid cells={cells3} solvedColors={["c1", "c3"]} />
			<p>In this example, the rainbow word is <strong>Green</strong>.</p>
			<p>Here's the completed puzzle:</p>
			<TutorialGrid cells={cells4} solvedColors={["c1", "c2", "c3", "c4"]} />
		</Container>
	);
}

function TutorialGrid({cells, solvedColors} : {cells: Cell[], solvedColors: string[]}) {
	const rainbowLockedColors = useMemo(
		() => `rainbow-with-${solvedColors.join(" rainbow-with-")}`,
		[solvedColors]
	);
	const cellElements = cells.map((cell) => {
		return (
			<SortableItem 
				key={cell.id}
				{...cell}
				disabled={true}
				rainbowLockedColors={rainbowLockedColors}
			/>
		);
	});
	
return (
	<AspectRatio ratio={1} py="md">
	<SimpleGrid
		cols={3}
		w="min(500px, 80%)"
		h="min(500px, 80%)"
		style={{
			justifyContent: "center",
			gap: 10,
			width: "min(500px, 100%)",
			minWidth: "min(500px, 90%)",
			height: "min(500px, 90vw)",
			gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
			gridTemplateRows: "repeat(3, minmax(0, 1fr))",
		}}>
		{cellElements}
	</SimpleGrid>
</AspectRatio>

)
}