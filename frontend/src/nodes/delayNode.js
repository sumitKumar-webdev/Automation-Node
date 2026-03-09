import { Timer } from 'lucide-react';
import { Position } from 'reactflow';
import { createConfigNode } from './Base-Node/nodeBase';

export const DelayNode = createConfigNode({
  title: 'Delay',
  icon: Timer,
  keyColor: '#fed7aa',
  subtitle: 'Wait before continuing',
  handles: [
    { type: 'target', position: Position.Left, id: 'input' },
    { type: 'source', position: Position.Right, id: 'output' },
  ],
  fields: [
    {
      key: 'duration',
      label: 'Milliseconds',
      type: 'number',
      defaultValue: 500,
      placeholder: '500',
    },
    {
      key: 'jitter',
      label: 'Add jitter',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
});
