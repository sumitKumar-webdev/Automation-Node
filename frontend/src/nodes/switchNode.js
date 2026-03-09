import { Split } from 'lucide-react';
import { Position } from 'reactflow';
import { createConfigNode } from './Base-Node/nodeBase';

export const SwitchNode = createConfigNode({
  title: 'Switch',
  icon: Split,
  keyColor: '#e9d5ff',
  subtitle: 'Route by condition',
  handles: [
    { type: 'target', position: Position.Left, id: 'input' },
    { type: 'source', position: Position.Right, id: 'true', offset: 33 },
    { type: 'source', position: Position.Right, id: 'false', offset: 66 },
  ],
  fields: [
    {
      key: 'condition',
      label: 'Condition',
      defaultValue: 'score > 80',
      placeholder: 'expression',
    },
  ],
});
