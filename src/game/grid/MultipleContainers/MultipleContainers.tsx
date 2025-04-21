import { Container, ContainerProps } from "@/game/components/Container";
import { SortableItem } from "@/game/grid/MultipleContainers/SortableItem";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DraggableSyntheticListeners,
  DragOverEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  AnimateLayoutChanges,
  arrayMove,
  defaultAnimateLayoutChanges,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS, Transform, Transition } from "@dnd-kit/utilities";
import { Group } from "@mantine/core";

import React, { JSXElementConstructor, ReactElement, useState } from "react";
type Items = Record<UniqueIdentifier, UniqueIdentifier[]>;

interface Props {
	items?: any[];
}
const itemCount = 3;
export default function MultipleContainers({ items: initialItems }: Props) {
	console.log('initialitems', initialItems);
	// const [pool, setPool] = useState<Items>(
	// 	() =>
	// 		initialItems ?? {
	// 			A: createRange(itemCount, (index) => `A${index + 1}`),
	// 			B: createRange(itemCount, (index) => `B${index + 1}`),
	// 			C: createRange(itemCount, (index) => `C${index + 1}`),
	// 			D: createRange(itemCount, (index) => `D${index + 1}`),
	// 		}
	// );
	const [grid, setGrid] = useState<any[]>([]);
  const [pool, setPool] = useState(initialItems ?? ["hello", "world"]);
	const [activeId, setActiveId] = useState<number | string | null>(null);
	const [clonedItems, setClonedItems] = useState<Items | null>(null);
  const containers = {
    grid, pool
  }
	const containedIds= Object.keys(containers) as UniqueIdentifier[];
	console.log('containers',containers, containedIds);
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);
  console.log('pool',pool);
	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
			onDragStart={({ active }) => {
				setActiveId(active.id);
				// setClonedItems(pool);
			}}>
			<Group p="md">
				<DroppableContainer
					key={'pool'}
					id={'pool'}
					label={`Pool`}
					columns={1}
					items={containers}
					scrollable={false}
					// style={containerStyle}
					// unstyled={minimal}
					// onRemove={() => handleRemove(containerId)}
				>
					<SortableContext
						items={pool}
						strategy={verticalListSortingStrategy}>
						{pool.map((value, index) => {
							return (
								<SortableItem
									key={value}
									id={Number(value)}
									containerId={containedIds[0]!}
									index={Number(value)}
									renderItem={renderItem}
									//getIndex={getIndex}
								/>
							);
						})}
					</SortableContext>
				</DroppableContainer>
			</Group>
		</DndContext>
	);
	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		const overId = over?.id;
    console.log(overId);

		// if (overId && active.id in pool) {
		// 	setContainers((containers) => {
		// 		const activeIndex = containers.indexOf(active.id); //finds index of the container that the dragged item is in
		// 		const overIndex = containers.indexOf(over.id); //finds index of the container that the dragged item is over

		// 		return arrayMove(containers, activeIndex, overIndex); //update position of containers in array, idk why
		// 	});
		// }
		const activeContainer = findContainer(active.id, {pool, grid});

		if (!activeContainer) {
			setActiveId(null);
			return;
		}
		if (overId == null) {
			setActiveId(null);
			return;
		}
		const overContainer = findContainer(overId, {pool, grid});

		if (overContainer) {
			// update pool position of dragged item
			const activeIndex = activeContainer.indexOf(active.id);
			const overIndex = activeContainer.indexOf(overId);

			if (activeIndex && overIndex && activeIndex !== overIndex) {
				setPool((pool) => ({
					...pool,
					[overContainer]: arrayMove(
						pool[overContainer]!,
						activeIndex,
						overIndex
					),
				}));
			}
		}

		setActiveId(null);
	}
	// function getIndex(id: UniqueIdentifier) {
	// 	const containerId = findContainer(id, pool);

	// 	if (!containerId) {
	// 		return -1;
	// 	}

	// 	const index = pool[containerId]?.indexOf(id);

	// 	return index ?? -1;
	// }
}

function handleDragOver(event: DragOverEvent) {
	const { active, over } = event;
}

function findContainer(
	id: UniqueIdentifier,
	items: {
		[x: string]: UniqueIdentifier[];
	}
) {
	if (id in items) {
		return items[id];
	}

	return Object.keys(items).find((key) => items[Number(key)]?.includes(id));
}

const defaultInitializer = (index: number) => index;

export function createRange<T = number>(
	length: number,
	initializer: (index: number) => any = defaultInitializer
): T[] {
	return [...new Array(length)].map((_, index) => initializer(index));
}

type RenderItem = (args: {
	dragOverlay: boolean;
	dragging: boolean;
	sorting: boolean;
	index: number | undefined;
	fadeIn: boolean;
	listeners: DraggableSyntheticListeners;
	ref: React.Ref<HTMLElement>;
	style: React.CSSProperties | undefined;
	transform: Transform;
	transition: Transition;
	value: React.ReactNode;
}) => ReactElement<unknown, string | JSXElementConstructor<any>>;

function renderItem() {
	return <div>Hello world</div>;
}

function DroppableContainer({
	children,
	columns = 1,
	disabled,
	id,
	items,
	style,
	...props
}: ContainerProps & {
	disabled?: boolean;
	id: UniqueIdentifier;
	items: {grid: any[], pool: any[]};
	style?: React.CSSProperties;
}) {
	const {
		active,
		attributes,
		isDragging,
		listeners,
		over,
		setNodeRef,
		transition,
		transform,
	} = useSortable({
		id,
		data: {
			type: "container",
			children: items,
		},
		animateLayoutChanges,
	});
	const isOverContainer = over
		? (id === over.id && active?.data.current?.type !== "container") ||
		  items.includes(over.id)
		: false;

	return (
		<Container
			ref={disabled ? undefined : setNodeRef}
			style={{
				...style,
				transition,
				transform: CSS.Translate.toString(transform),
				opacity: isDragging ? 0.5 : undefined,
			}}
			hover={isOverContainer}
			handleProps={{
				...attributes,
				...listeners,
			}}
			columns={columns}
			{...props}>
			{children}
		</Container>
	);
}

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
	defaultAnimateLayoutChanges({ ...args, wasDragging: true });
