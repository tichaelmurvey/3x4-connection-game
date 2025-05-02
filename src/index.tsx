import ChoosePuzzle from "@/game/view/home/ChoosePuzzle";
import { Game } from "@/game/view/home/Game";
import Puzzle from "@/game/view/puzzle/Puzzle";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { App } from "./App";

let container = document.getElementById("app")!;
let root = createRoot(container);
root.render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route element={<App />}>
					<Route element={<Game />}>
						<Route path="/" element={<ChoosePuzzle />} />
						<Route path="/puzzle/:puzzleId" element={<Puzzle />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	</StrictMode>
);
