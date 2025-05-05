import { PuzzleSolution } from "@/game/model/model";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import {
	collection,
	getDocs,
	getFirestore
} from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyBFaTRxazWCD_uUz_lEpJTfdOTNObdTbBE",
	authDomain: "connections-d6358.firebaseapp.com",
	projectId: "connections-d6358",
	storageBucket: "connections-d6358.firebasestorage.app",
	messagingSenderId: "990575515645",
	appId: "1:990575515645:web:25a4822db8aaf7614e2b94",
	measurementId: "G-48PG418GRX"
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
