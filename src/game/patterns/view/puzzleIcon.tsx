import { AspectRatio, SimpleGrid } from "@mantine/core";

export default function PuzzleIcon() {
	return (
		<AspectRatio ratio={1}>
		<SimpleGrid cols={3} spacing="xs">
			<div className="draggable locked-c1"></div>
			<div className="draggable"></div>
			<div className="draggable locked-c2"></div>
			<div className="draggable"></div>
			<div className="draggable"></div>
			<div className="draggable locked-c3"></div>
			<div className="draggable"></div>
			<div className="draggable locked-c4"></div>
			<div className="draggable"></div>
		</SimpleGrid>
		</AspectRatio>
	)
}