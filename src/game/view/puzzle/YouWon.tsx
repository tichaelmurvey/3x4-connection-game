import { Button, Group, Text, Title } from "@mantine/core";
import { useLocalStorage } from "@rehooks/local-storage";
import { memo } from "react";
import { useNavigate } from "react-router";

export const YouWon = memo(function YouWon() {
	const [hasVisited, setHasVisited] = useLocalStorage<boolean>("hasVisited", false);
	const navigate = useNavigate();
	return (
		<>
			<Title order={2}>⭐ Good Job ⭐</Title>
			<Text>You found the rainbow connection! 🌈</Text>
			<Group justify="center">
			{/* <Button component={Link} variant="outline" to="/">
					Share your score
				</Button> */}
				<Button onClick={() => {
					setHasVisited(true);
					navigate("/");
				}}>
					Play another puzzle
				</Button>
			</Group>
		</>
	);
});
