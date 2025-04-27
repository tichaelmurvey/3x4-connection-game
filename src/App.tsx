import { Game } from "@/game/gptAttempt/Game";
import { AppShell, Burger, Group, MantineProvider, UnstyledButton } from "@mantine/core";
import "@mantine/core/styles.css";
import { useDisclosure } from "@mantine/hooks";
import "./App.css";
import "./rainbow.css";

export function App() {
  const [opened, { toggle }] = useDisclosure();

	return (
		<MantineProvider>
			<AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
            padding="xs"
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
            <Game />
  {/* <MultipleContainers
    columns={3}
    itemCount={9}
    handle={false}
    items={{
      'pool' : ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
      'grid' : ['X']
    }}
    strategy={rectSortingStrategy}
    wrapperStyle={() => ({
      width: 150,
      height: 150,
    })}
    vertical
  /> */}
        </AppShell.Main>

			</AppShell>
		</MantineProvider>
	);
}
