import { ColorIndex, LockableCategoryId } from "@/game/model/model";
import { DispatchContext } from "@/game/view/home/Game";
import { rectSwappingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Center, Text } from "@mantine/core";
import React, { memo, ReactNode, useContext, useMemo } from "react";
import useFitText from "use-fit-text";

export type CellProps = {
	id: number;
	colorName: ColorIndex;
	label : string;
	lockedColor: ColorIndex | null;
	lockedGroup: LockableCategoryId | null;
	rainbowLockedColors: string;
	//handleClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const cellStyle: React.CSSProperties = {
	fontFamily: "sans-serif",
	fontWeight: 700,
	textTransform: "uppercase",
	height: "100%",
	width: "100%",
	borderRadius: "10px",
	position: "relative",
	textShadow: "3px 3px 10px rgba(255,255,255,.8)",
};

export const SortableItem= memo( 
function SortableItem({
	id,
	//cell,
	lockedColor,
	colorName,
	lockedGroup,
	label,
	rainbowLockedColors,
	//handleClick,
}: CellProps) {
	const { fontSize, ref: fontSizeRef } = useFitText();
	const gameDispatch = useContext(DispatchContext);
	const lockedGroupColor = lockedGroup !== null ? `locked-${lockedColor}` : ""
	const cellClass = useMemo(
		() =>
			`draggable ${colorName} ${lockedGroupColor} ${lockedGroup === "rainbow" ? rainbowLockedColors : ""}`,
		[colorName,lockedGroup, lockedGroupColor, rainbowLockedColors]
	);
	
	return (
		<ItemFrame 
		//cell={cell} 
		id={id}>
				<Center
					component="button"
					onClick={(e) => {
						e.preventDefault();
						gameDispatch({ type: "CHANGE_COLOR", cellId: id });
					}}
					style={cellStyle}
					p="2px"
					className={cellClass}>
					<Text
						key="label"
						fw="700"
						ref={fontSizeRef}
						style={{
							fontSize,
							width: "100%",
							userSelect: "none",
							textAlign: "center",
						}}>
						{label}
					</Text>
				</Center>
		</ItemFrame>
	);
});



function AccessibleColorDot() {
	return (
		<span
			style={{
				userSelect: "none",
				display: "inline",
				padding: "0px 0px",
				lineHeight: "12px",
				fontSize: "12px",
			}}>
			•
		</span>
	);
}
const ItemFrame = memo(function ItemFrame({
	//cell: cell,
	id,
	children,
}: {
	//cell: Cell;
	id: number;
	children: React.ReactNode;
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: id,
		//data: cell,
		animateLayoutChanges: () => false,
		strategy: rectSwappingStrategy,
	});

	const transformString = useMemo(
		() => CSS.Transform.toString(transform),
		[transform]
	);
	const zIndex = useMemo(() => (isDragging ? 100 : 0), [isDragging]);
	const style: React.CSSProperties = {
		transform: transformString,
		transition,
		width: "100%",
		height: "100%",
		touchAction: "none",
		position: "relative",
		zIndex,
		padding: 0,
	};
	return (
			<div
				style={style}
				ref={setNodeRef}
				{...attributes}
				{...listeners}
				tabIndex={-1}>
				{children}
			</div>
	);
}, frameUpdated);

function checkCellProps(prevProps: CellProps, nextProps: CellProps) {
	console.warn("checking", prevProps.id);
	if(prevProps.id !== nextProps.id) {
		console.log("id changed", prevProps.id, nextProps.id);
		return false
	}
	if(prevProps.colorName !== nextProps.colorName) {
		console.log("colorName changed", prevProps.colorName, nextProps.colorName);
		return false
	}
	if(prevProps.label !== nextProps.label) {
		console.log("label changed", prevProps.label, nextProps.label);
		return false
	}
	if(prevProps.lockedColor !== nextProps.lockedColor) {
		console.log("lockedColor changed", prevProps.lockedColor, nextProps.lockedColor);
		return false
	}
	if(prevProps.lockedGroup !== nextProps.lockedGroup) {
		console.log("lockedGroup changed", prevProps.lockedGroup, nextProps.lockedGroup);
		return false
	}
	if(prevProps.rainbowLockedColors !== nextProps.rainbowLockedColors) {
		console.log("rainbowLockedColors changed", prevProps.rainbowLockedColors, nextProps.rainbowLockedColors);
		return false
	}
	console.log("same!");
	return true;
}

function frameUpdated(prevProps: Readonly<{ id: number; children: ReactNode; }>, nextProps: Readonly<{ id: number; children: ReactNode; }>): boolean {
	if(prevProps.id !== nextProps.id){
		return false;
	}
	if(prevProps.children !== nextProps.children){
		return false;
	}
	return true;
}
