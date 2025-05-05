import { HelpButton } from "@/game/view/home/Help";
import { Title } from "@mantine/core";

function TutorialText() {
	return (
		<>
			<Title order={1} fz="1.8rem">Rainbow Connection</Title>
			<p>Connect four groups of three. One <strong>rainbow</strong> word is in all four categories.</p>
			<HelpButton />
		</>
	)
}

export default TutorialText;