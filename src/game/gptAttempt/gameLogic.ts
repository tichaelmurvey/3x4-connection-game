import { GameState, solution } from "@/game/gptAttempt/Game";

export function shuffle(array: any[]) {
	console.log("shuffle!")
	let currentIndex = array.length;

	// While there remain elements to shuffle...
	while (currentIndex != 0) {
		// Pick a remaining element...
		let randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}
	return array;
}

export type Feedback = {
	status: "completed" | "mixed" | "error" | null;
	errorMessage?: string;
	rainbow: string | boolean | null;
	green: string | boolean | null;
	yellow: string | boolean | null;
	pink: string | boolean | null;
	blue: string | boolean | null;
};

export type Solution = {
	rainbow: {
		words: string[];
	};
	line1: {
		words: string[];
		connection: string;
	};
	line2: {
		words: string[];
		connection: string;
	};
	line3: {
		words: string[];
		connection: string;
	};
	line4: {
		words: string[];
		connection: string;
	};
};


export function isActiveColor(color: string) : color is GameColor {
	console.log("isActiveColor", color, ["rainbow", "green", "yellow", "pink", "blue"].includes(color));
	return ["rainbow", "green", "yellow", "pink", "blue"].includes(color);
}

export type GameColor = keyof GameState["cellData"] & keyof Feedback;

export function checkAnswers(gameState: GameState) {
	console.log("checkAnswers", gameState.cellData);
	const feedback: Feedback = {
		status: null,
		rainbow: null,
		green: null,
		yellow: null,
		pink: null,
		blue: null,
	};

	//Check for incorrect numbers
	for (const color in gameState.cellData) {
		console.log("checking color", color, "for errors");
		if (!isActiveColor(color)) continue;
		const errorResult =
			color === "rainbow"
				? rainbowHasWrongNumber(gameState)
				: colorHasWrongNumber(gameState, color);

		if (errorResult) {
			feedback.errorMessage = errorResult;
			feedback.status = "error";
			return feedback;
		}
	}

	//Check for correct solution
	for (const color in gameState.cellData) {
		if (!isActiveColor(color)) continue;
		feedback[color] = isColorCorrect(color, gameState, solution);
	}
	//check if every color has been solved
	const isAllSolved = Object.keys(gameState.cellData).every((color) => feedback[color as GameColor]);
	feedback.status = isAllSolved ?  "completed" : "mixed";
	return feedback;
}

function rainbowHasWrongNumber(gameState: GameState) {
	console.log("rainbowHasWrongNumber");
	if (gameState.cellData.rainbow.length > 1) {
		return "You can't submit a guess with more than one rainbow tile";
	}
	return false;
}

function colorHasWrongNumber(gameState: GameState, color: GameColor) {
	console.log("colorHasWrongNumber", color);
	const isRainbow = gameState.cellData["rainbow"].length === 1;
	const setLength = gameState.cellData[color].length;

	if (isRainbow && setLength == 2) return false;
	if (!isRainbow && setLength == 3) return false;
	if (isRainbow && setLength == 3) return `You tried to submit too many matching tiles in ${color}`;
	if(setLength > 3) return `You tried to submit too many matching tiles in ${color}`;

}

function isColorCorrect(
	color: GameColor,
	gameState: GameState,
	solution: Solution
) {
	if (color === "rainbow") {
		return isRainbowCorrect(gameState, solution);
	}

	const labels = gameState.cellData[color].map((item) => item.label);
	const lineKeys = Object.keys(solution).filter((key) => key !== "rainbow");
	const lineKey = lineKeys.find((key) =>
		solution[key as keyof Solution].words.some((solutionWord) =>
			labels.includes(solutionWord)
		)
	);
	if (!lineKey) return false;

	//check that two words are in the same line, and the other word is the rainbow
	const wordCount = countValuesInArray(
		labels,
		solution[lineKey as keyof Solution].words
	);

	//Check if one of the guesses is actually the rainbow
	if (gameState.cellData[color].length === 3) {
		const containsRainbow = labels.includes(solution.rainbow.words[0]);
		return wordCount === 2 && containsRainbow && gameState.cellData.rainbow.length === 0 ? lineKey : false;
	}

	//Check if both are correct and the rainbow has been solved
	if (gameState.cellData[color].length === 2) {
		return wordCount === 2 && isRainbowCorrect(gameState, solution) ? lineKey : false;
	}
	return false;
}

function isRainbowCorrect(gameState: GameState, solution: Solution) {
	return (
		gameState.cellData.rainbow.length === 1 &&
		gameState.cellData.rainbow[0].label === solution.rainbow.words[0]
	);
}

function countValuesInArray(container: any[], values: any[]) {
	return values.filter((value) => container.includes(value)).length;
}
