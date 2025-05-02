import { Button, Stack, Text } from "@mantine/core";
import { Link } from "react-router";

export default function YouLost() {
	return (
		<Stack align="center" justify="center">
			<Text fz="lg">
			💥
			</Text>
			<Text fz="lg"><a target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/watch?v=Lzeqbws7FiE">Better luck next time...</a></Text>
			<Button component={Link} to="/">Try another puzzle</Button>
		</Stack>
	);
}
