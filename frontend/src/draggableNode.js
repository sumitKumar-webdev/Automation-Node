import { useRef } from 'react';

export const DraggableNode = ({ type, label, Icon, onClickAdd }) => {
  const dragStartedRef = useRef(false);

  const onDragStart = (event, nodeType) => {
    dragStartedRef.current = true;
    const appData = { nodeType }
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={`draggable-node ${type}`}
      role="button"
      tabIndex={0}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => {
        event.target.style.cursor = 'grab';
        setTimeout(() => {
          dragStartedRef.current = false;
        }, 0);
      }}
      onClick={() => {
        if (dragStartedRef.current) return;
        onClickAdd?.(type);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClickAdd?.(type);
        }
      }}
      style={{ cursor: 'grab' }}
      draggable
    >
      {Icon ? <Icon className="draggable-node-icon" size={14} strokeWidth={2.25} /> : null}
      <span className="draggable-node-label">{label}</span>
    </div>
  );
};

