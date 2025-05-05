import HelpIcon from "@/game/view/home/Help";
import {
	AppShell,
	Burger,
	Group,
	MantineProvider,
	Stack,
	UnstyledButton,
} from "@mantine/core";
import "@mantine/core/styles.css";
import { useDisclosure } from "@mantine/hooks";
import { CookiesProvider } from "react-cookie";
import { Link, Outlet, useParams } from "react-router";
import "./App.css";
import "./rainbow.css";

export function App() {
	const params = useParams();
	const [opened, { toggle }] = useDisclosure();
	return (
		<CookiesProvider defaultSetOptions={{ path: "/" }}>
			<MantineProvider>
				<AppShell
					header={{ height: 40 }}
					navbar={{
						width: 300,
						breakpoint: "sm",
						collapsed: { desktop: true, mobile: !opened },
					}}
					padding="xs">
					<AppShell.Header>
						<Group h="100%" px="md">
							<Burger
								opened={opened}
								onClick={toggle}
								hiddenFrom="sm"
								size="sm"
							/>
							<Group justify="space-between" style={{ flex: 1 }}>
								<Group ml="xl" visibleFrom="sm">
									<NavLinks toggle={toggle} />
								</Group>
							</Group>
							<HelpIcon />
						</Group>
					</AppShell.Header>
					<AppShell.Navbar py="md" px={4}>
						<Stack>
						<NavLinks toggle={toggle} />
						</Stack>
					</AppShell.Navbar>
					<AppShell.Main h="0px">
						<Outlet />
					</AppShell.Main>
				</AppShell>
			</MantineProvider>
		</CookiesProvider>
	);
}

function NavLinks({toggle} : {toggle: () => void}) {
	return (
		<>
			<UnstyledButton component={Link} to="/" onClick={toggle}>
				Home
			</UnstyledButton>
			<UnstyledButton component={Link} to="https://funwebsite.fun" onClick={toggle}>
				More fun stuff
			</UnstyledButton>
		</>
	);
}