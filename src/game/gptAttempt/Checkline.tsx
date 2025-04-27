import { Button, Group } from "@mantine/core";

export default function CheckButtons({checkAnswers}: {checkAnswers: () => void}) {
	return (
		<Group justify="center" >
			<Button onClick={checkAnswers}>Check Answers</Button>
		</Group>
	)
}