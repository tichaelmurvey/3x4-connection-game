import { Button, Text, Title } from "@mantine/core";
import { memo } from "react";
import { Link } from "react-router";

export const YouWon = memo(function YouWon(){
	return (<>
		<Title order={2}>Good Job</Title>
		<Text>You found the rainbow connection!</Text>
		<Button component={Link} to="/">
				Play another puzzle
			</Button>
		<Button component={Link} to="/">
				Share your score
			</Button>

	</>)
})
