import React, { forwardRef } from 'react';

interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
}

export const Item = forwardRef<HTMLDivElement, ItemProps>(({ id, ...props }, ref) => {
  return (
    <div {...props} ref={ref}>
      {id}
    </div>
  );
});

Item.displayName = 'Item'; // Good practice when using forwardRef
