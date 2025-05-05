import RouteManager from "@/game/view/home/Routes";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

let container = document.getElementById("app")!;
let root = createRoot(container);

root.render(
	<StrictMode>
		<RouteManager />
	</StrictMode>
);
