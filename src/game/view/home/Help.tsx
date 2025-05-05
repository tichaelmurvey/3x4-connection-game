import { LongInstructions } from "@/game/view/tutorial/LongInstructions";
import {
	Button,
	Center,
	Modal,
	Stack,
	UnstyledButton
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { BsQuestionCircleFill } from "react-icons/bs";

export default function HelpIcon() {
	const [opened, { open, close }] = useDisclosure(false);

	return (
		<>
			<HelpModal opened={opened} close={close} />
			<UnstyledButton onClick={open}>
				<Center>
					<BsQuestionCircleFill size={20} />
				</Center>
			</UnstyledButton>
		</>
	);
}

export function HelpButton() {
	const [opened, { open, close }] = useDisclosure(false);

	return (
		<>
			<Button onClick={open}>
				How to play
			</Button>
			<HelpModal opened={opened} close={close} />
		</>
	);
}

export function HelpModal({ opened, close }: { opened: boolean, close: () => void }) {
	return (
		<Modal
		opened={opened}
		onClose={close}
		title={
			<span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
				How to play
			</span>
		}>
		<Stack>
		<LongInstructions />
		<Button onClick={close}>Back to puzzle</Button>
		</Stack>
	</Modal>

	)
}