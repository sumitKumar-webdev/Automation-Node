import { memo, useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from 'reactflow';
import { useStore } from '../store';

export const DeletableEdge = memo(function DeletableEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  style,
  selected,
}) {
  const removeEdge = useStore((state) => state.removeEdge);
  const [isArmed, setIsArmed] = useState(false);

  useEffect(() => {
    if (!isArmed) return undefined;
    const timeoutId = window.setTimeout(() => setIsArmed(false), 2000);
    return () => window.clearTimeout(timeoutId);
  }, [isArmed]);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });
  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={{ ...style, stroke: isArmed && '#dc2626' }} />
      {(selected || isArmed) && (
        <EdgeLabelRenderer>
          <button
            type="button"
            className={`edge-delete-button nodrag nopan${isArmed ? ' is-armed' : ''}`}
            style={{
              left: `${labelX}px`,
              top: `${labelY}px`,
            }}
            onClick={(event) => {
              event.stopPropagation();
              if (isArmed) {
                removeEdge(id);
                return;
              }
              setIsArmed(true);
            }}
            aria-label="Delete connection"
          >
            <Trash2 size={12} strokeWidth={2.2} />
          </button>
        </EdgeLabelRenderer>
      )}
    </>
  );
});
