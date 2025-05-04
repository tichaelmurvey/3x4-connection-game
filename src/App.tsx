import Help from "@/game/view/home/Help";
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
import { Link, Outlet } from "react-router";
import "./App.css";
import "./rainbow.css";

export function App() {
	const [opened, { toggle }] = useDisclosure();

	return (
		<CookiesProvider defaultSetOptions={{ path: "/" }}>
			<MantineProvider>
				<AppShell
					header={{ height: 60 }}
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
									<NavLinks />
								</Group>
							</Group>
							<Help />
						</Group>
					</AppShell.Header>
					<AppShell.Navbar py="md" px={4}>
						<Stack>
						<NavLinks />
						</Stack>
					</AppShell.Navbar>
					<AppShell.Main>
						<Outlet />
					</AppShell.Main>
				</AppShell>
			</MantineProvider>
		</CookiesProvider>
	);
}

function NavLinks() {
	return (
		<>
			<UnstyledButton component={Link} to="/">
				Home
			</UnstyledButton>
			<UnstyledButton component={Link} to="https://funwebsite.fun">
				More fun stuff
			</UnstyledButton>
		</>
	);
}