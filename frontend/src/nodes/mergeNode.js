import { GitMerge } from 'lucide-react';
import { Position } from 'reactflow';
import { createConfigNode } from './Base-Node/nodeBase';

export const MergeNode = createConfigNode({
  title: 'Merge',
  icon: GitMerge,
  keyColor: '#a7f3d0',
  subtitle: 'Combine streams',
  handles: [
    { type: 'target', position: Position.Left, id: 'a', offset: 33 },
    { type: 'target', position: Position.Left, id: 'b', offset: 66 },
    { type: 'source', position: Position.Right, id: 'merged' },
  ],
  fields: [
    {
      key: 'strategy',
      label: 'Strategy',
      type: 'select',
      defaultValue: 'append',
      options: [
        { value: 'append', label: 'Append' },
        { value: 'zip', label: 'Zip' },
        { value: 'first', label: 'First non-empty' },
      ],
    },
    {
      key: 'separator',
      label: 'Separator',
      defaultValue: ', ',
      placeholder: ',',
    },
  ],
});
