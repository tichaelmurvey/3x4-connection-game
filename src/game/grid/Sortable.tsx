import { AspectRatio, Center, Group } from "@mantine/core";
import { useState } from "react";
import { ReactSortable } from "react-sortablejs";

interface ItemType {
	id: string;
	color: string;
}
const mockdata = [
	{ id: "Credit cards", color: "violet" },
	{ id: "Banks nearby", color: "indigo" },
	{ id: "Transfers", color: "blue" },
	{ id: "Refunds", color: "green" },
	{ id: "Receipts", color: "teal" },
	{ id: "Taxes", color: "cyan" },
	{ id: "Reports", color: "pink" },
	{ id: "Payments", color: "red" },
	{ id: "Cashback", color: "orange" },
];

export default function Sortable(props: React.PropsWithChildren) {
	const [pool, setPool] = useState<ItemType[]>(mockdata);
	const [grid, setGrid] = useState<ItemType[]>();

	return (
		<Group >
		<AspectRatio ratio={3/4}>
			<ReactSortable
			className="gameGrid"
				group={{
					name: "words",
					pull: true,
					put: true,
				}}
				list={grid || []}
				setList={setGrid}
				draggable=".word"
				style={{...SortableGridStyles, ...GameGridStyles}}
				animation={200}
				delay={2}
				sort={false}>
				{grid?.map((item, index) => (
					<WordCard
						key={`grid${item.id}`}
						word={item.id}
						index={index}
					/>
				))}
			</ReactSortable>
			</AspectRatio>
			<AspectRatio>
			<ReactSortable
				group={{
					name: "words",
					pull: true,
					put: true,
				}}
				list={pool || []}
				setList={setPool}
				draggable=".word"
				style={{...SortableGridStyles, ...GamePoolStyles}}
				animation={200}
				delay={2}
				sort={false}>
				{pool.map((item, index) => (
					<WordCard key={item.id} word={`${item.id}` } index={index}/>
				))}
			</ReactSortable>
			</AspectRatio>
		</Group>
	);
}

function WordCard({
	word,
	index,
}: {
	word: string;
	index: number;
}) {
	return (
		<Center
			className="word"
			style={WordCardStyles}
			>
			{word}
		</Center>
	);
}

const SortableGridStyles: React.CSSProperties = {
	padding: "10px",
	border: "2px solid black",
	display: "grid",
	gap: "10px",
	justifyItems: "stretch",
	width: 500
};

const GameGridStyles: React.CSSProperties = {
	gridTemplateColumns: "1fr 1fr 1fr",
	gridTemplateRows: "1fr 1fr 1fr 1fr",
}

const GamePoolStyles: React.CSSProperties = {
	gridTemplateColumns: "1fr 1fr 1fr",
	gridTemplateRows: "1fr 1fr 1fr",
}

const WordCardStyles: React.CSSProperties = {
	textAlign: "center",
	border: "5px solid black",
	transition: "box-shadow 150ms ease, transform 100ms ease",
	userSelect: "none",
};
