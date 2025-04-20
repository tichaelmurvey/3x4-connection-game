import { useDraggable } from '@dnd-kit/core';

export default function Draggable(props: { children: React.ReactNode, title: string }) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: props.title,
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  
  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  );
}