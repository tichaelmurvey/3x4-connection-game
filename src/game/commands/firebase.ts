import { PuzzleSolution } from "@/game/model/model";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import {
	collection,
	doc,
	getDocs,
	getFirestore,
	increment,
	updateDoc
} from "firebase/firestore";

const firebaseConfig = {
	//your config here
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getFirestore(app);

export async function getAllPuzzles() {
	const puzzleResponse = await getDocs(collection(database, "puzzles"));
	const puzzleDataWithoutGroups = puzzleResponse.docs.map(doc => doc.data());
	//console.log("puzzles without groups", puzzleDataWithoutGroups);
	const groupFetchers = puzzleResponse.docs.map(puzzle => getDocs(collection(database, "puzzles", puzzle.id, "groups")))
	const groupsResponse = await Promise.all(groupFetchers)
	const groups = groupsResponse.map(groupResponse => groupResponse.docs.map(doc => doc.data()));
	//console.log("groups", groups)
	const groupsAsArrays = groups.map(groupset => groupset.map(groupobj => [groupobj[0], groupobj[1]]))
	const puzzles = puzzleDataWithoutGroups.map((puzzle, index) => ({...puzzle, groups: groupsAsArrays[index]}))
	//console.log("puzzles", puzzles)
	return puzzles as PuzzleSolution[];
}

export async function reportGameData(id: number, stat: "win" | "loss" | "attempt"){
	console.log("reporting ", stat, "for puzzle", id)
	
	if(process.env.NODE_ENV !== "production"){
		console.log("simulating report but not really sending it");
		return;
	}

	const gameRef = doc(database, "tracking", String(id));
	try {
		await updateDoc(gameRef, {
			[stat]: increment(1)
		})
	} catch {
		console.error("failed to update tracking database");
	}
}
