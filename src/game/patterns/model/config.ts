export const gameConfig = {
	xGrid: 3,
	yGrid: 3,
	maxGuesses: 3,
};

export const viewConfig = {
	colors: {
		cNeutral: "#F2F2F2",
		cRainbow: "transparent",
		c1: "#FFC1CF", 
		c2: "#E879F9", 
		c3: "#B7FFD8", 
		c4: "#C4F5FC"
	},

}

export type GameConfig = {
	xGrid: number;
	yGrid: number;
	maxGuesses: number;
}

// c1: "#FFC1CF", 
// 		c2: "#E8FFB7", 
// 		c3: "#B7FFD8", 
// 		c4: "#C4F5FC"