import Sortable from "@/game/grid/Sortable";
import { AppShell, Burger, Group, MantineProvider, UnstyledButton } from "@mantine/core";
import "@mantine/core/styles.css";
import { useDisclosure } from "@mantine/hooks";
import "./App.css";

export function App() {
  const [opened, { toggle }] = useDisclosure();

	return (
		<MantineProvider>
			<AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
            padding="md"
      >
              <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group justify="space-between" style={{ flex: 1 }}>
            <Group ml="xl" gap={0} visibleFrom="sm">
              <UnstyledButton >Home</UnstyledButton>
              <UnstyledButton >Blog</UnstyledButton>
              <UnstyledButton >Contacts</UnstyledButton>
              <UnstyledButton >Support</UnstyledButton>
            </Group>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar py="md" px={4}>
        <UnstyledButton >Home</UnstyledButton>
        <UnstyledButton >Blog</UnstyledButton>
        <UnstyledButton >Contacts</UnstyledButton>
        <UnstyledButton >Support</UnstyledButton>
      </AppShell.Navbar>
      <AppShell.Main>

            <h1>4x game</h1>
            <Sortable />
        </AppShell.Main>

			</AppShell>
		</MantineProvider>
	);
}
