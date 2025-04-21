import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

import { Item } from './Item';

interface SortableItemProps {
  id: string;
  value: React.ReactNode;
  style?: React.CSSProperties;
}

export function SortableItem({ id, value, ...props }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
  };

  return (
    <Item id={id} ref={setNodeRef} {...attributes} {...listeners} {...props}>
      {value}
    </Item>
  );
}
