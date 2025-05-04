import { Avatar, List, ListItem, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { BsQuestionCircleFill } from "react-icons/bs";

export default function Help() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title={<span style={{fontSize: "1.5rem", fontWeight: "bold"}}>How to play</span>} >
        <p>Find groups of three words which are part of the same category.</p>
		<p>One "Rainbow" word is in all four categories.</p>
		<p>Find all four groups without making three incorrect guesses to win.</p>
		<h3>Example categories</h3>
		<List spacing="sm">
			<ListItem><Text span fw={700}>Colors:</Text> <Text span>Green, Blue, Red</Text> </ListItem>
			<ListItem><Text span fw={700}>Inexperienced:</Text> <Text span>Green, Fresh, Naive</Text> </ListItem>
			<ListItem><Text span fw={700}>Environmentally friendly:</Text> <Text span>Green, Eco, Biodegradable</Text> </ListItem>
			<ListItem><Text span fw={700}>Grass area:</Text> <Text span>Green, Commons, Lawn</Text> </ListItem>
		</List>
		<Text>In this puzzle, <Text span fw={700}>Green</Text> is the rainbow.</Text>
      </Modal>

      <Avatar component="button" variant="default" onClick={open}>
	  <BsQuestionCircleFill />
      </Avatar>
    </>
  );
}