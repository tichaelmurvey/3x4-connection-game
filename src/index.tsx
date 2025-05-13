import RouteManager from "@/game/view/home/Routes";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const container = document.getElementById("app")!;
const root = createRoot(container);

if (process.env.NODE_ENV === 'development') {
	root.render(
		<StrictMode>
			<RouteManager />
		</StrictMode>
	);
}
if (process.env.NODE_ENV === 'production') {
	root.render(
		<RouteManager />
	);
}



