import { Anchor, Container } from "@mantine/core";

export default function About(){
	return (
		<Container>
		<h1>About this game</h1>
		<p>This game format was <Anchor href="https://bsky.app/profile/hankgreen.bsky.social/post/3lm3hpbwka225">Hank Green's idea</Anchor>.</p>
		<p>This web version was created by <Anchor href="https://funwebsite.fun/">Michael Page</Anchor>.</p>
		<p>The code is available on <Anchor href="https://github.com/tichaelmurvey/3x4-connection-game">Github</Anchor>.</p>
		<p>This site is free but if you want to say thanks, <Anchor href="https://www.pih.org/?form=donate"> send a few 💸💸💸 to Partners in Health</Anchor>.</p>
		</Container>
	)
}