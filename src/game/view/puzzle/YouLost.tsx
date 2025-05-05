import { Button, Stack, Text } from "@mantine/core";
import { useLocalStorage } from "@rehooks/local-storage";
import { useNavigate } from "react-router";

export default function YouLost() {
	const [hasVisited, setHasVisited] = useLocalStorage<boolean>("hasVisited", false);
	const navigate = useNavigate();

	return (
		<Stack align="center" justify="center">
			<Text fz="lg">
			💥
			</Text>
			<Text fz="lg"><a target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/watch?v=Lzeqbws7FiE">Better luck next time...</a></Text>
			<Button onClick={() => {
					setHasVisited(true);
					navigate("/");
				}}>Try another puzzle</Button>
		</Stack>
	);
}
