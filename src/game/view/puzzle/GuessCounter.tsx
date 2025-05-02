import { Group, Text } from "@mantine/core";
import { memo } from "react";

export const GuessCounter = memo(function GuessCounter({
	guesses, maxGuesses,
}: {
	guesses: number;
	maxGuesses: number;
}) {
	let guessBulbs = "";
	for (let i = 0; i < maxGuesses; i++) {
		if (i < guesses) {
			guessBulbs += "💡";
		} else {
			guessBulbs += "💥";
		}
	}
	return (
		<Group justify="center">
			<Text fz="lg">Guesses: {guessBulbs}</Text>
		</Group>
	);
});
