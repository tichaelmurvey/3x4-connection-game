import { App } from "@/App";
import About from "@/game/view/home/About";
import ChoosePuzzle from "@/game/view/home/ChoosePuzzle";
import { Game } from "@/game/view/home/Game";
import Puzzle from "@/game/view/puzzle/Puzzle";
import { LongInstructions } from "@/game/view/tutorial/LongInstructions";
import { useLocalStorage } from "@rehooks/local-storage";
import { BrowserRouter, Route, Routes } from "react-router";

export default function RouteManager() {
	const [hasVisited, setHasVisited] = useLocalStorage<boolean>("hasVisited", false);
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<App />}>
					<Route element={<Game />}>
						<Route
							path="/"
							element={hasVisited ? <ChoosePuzzle /> : <Puzzle /> }
						/>
						<Route path="/puzzle/:puzzleId" element={<Puzzle />} />
					</Route>
					<Route path="/tutorial" element={<LongInstructions />} />
					<Route path="/about" element={<About />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
