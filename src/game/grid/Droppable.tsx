import { useDroppable } from '@dnd-kit/core';

export default function Droppable(props : { children: React.ReactNode, title: string }) {
  const {isOver, setNodeRef} = useDroppable({
    id: props.title,
  });
  const style = {
    color: isOver ? 'green' : undefined,
    zIndex: 20,
  };
  
  
  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}