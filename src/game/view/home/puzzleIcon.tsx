import { Phase } from "@/game/model/model";
import { AspectRatio, Center, SimpleGrid } from "@mantine/core";

export default function PuzzleIcon({ status }: { status: Phase | undefined }) {
	switch (status) {
		case "won":
			return <PuzzleWonIcon />;
		case "lost":
			return <PuzzleLostIcon />;
		default:
			return <PuzzlePlayIcon />;
	}
}

function PuzzlePlayIcon() {
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
	);
}

function PuzzleLostIcon() {
	return (
		<AspectRatio ratio={1}>
		<SimpleGrid cols={3} spacing="xs">
			<Center className="draggable" fz={20}>💥</Center>
			<Center className="draggable" fz={20}>💥</Center>
			<Center className="draggable" fz={20}>💥</Center>
			<Center className="draggable" fz={20}>💥</Center>
			<Center className="draggable" fz={20}>💥</Center>
			<Center className="draggable" fz={20}>💥</Center>
			<Center className="draggable" fz={20}>💥</Center>
			<Center className="draggable" fz={20}>💥</Center>
			<Center className="draggable" fz={20}>💥</Center>
			{/* <div className="draggable"></div>
			<div className="draggable"></div>
			<div className="draggable"></div>
			<div className="draggable"></div>
			<div className="draggable"></div>
			<div className="draggable"></div>
			<div className="draggable"></div>
			<div className="draggable"></div> */}
		</SimpleGrid>
		</AspectRatio>
	);
}
function PuzzleWonIcon() {
	return (
		<AspectRatio ratio={1}>
		<SimpleGrid cols={1} spacing="xs">
			{/* <div className="draggable locked-c1"></div>
			<div className="draggable locked-c1"></div>
			<div className="draggable locked-c2"></div>
			<div className="draggable locked-c2"></div> */}
			<Center className="draggable locked-cRainbow rainbow-with-c1 rainbow-with-c2 rainbow-with-c3 rainbow-with-c4" fz={30}>🌈</Center>
			{/* <div className="draggable locked-c3"></div>
			<div className="draggable locked-c3"></div>
			<div className="draggable locked-c4"></div>
			<div className="draggable locked-c4"></div> */}
		</SimpleGrid>
		</AspectRatio>
	);
}