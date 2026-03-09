import { Filter } from 'lucide-react';
import { Position } from 'reactflow';
import { createConfigNode } from './Base-Node/nodeBase';

export const FilterNode = createConfigNode({
  title: 'Filter',
  icon: Filter,
  keyColor: '#fecaca',
  subtitle: 'Keep matching items',
  handles: [
    { type: 'target', position: Position.Left, id: 'input' },
    { type: 'source', position: Position.Right, id: 'output' },
  ],
  fields: [
    {
      key: 'criteria',
      label: 'Criteria',
      defaultValue: 'status:active',
      placeholder: 'field:value',
    },
    {
      key: 'mode',
      label: 'Match',
      type: 'select',
      defaultValue: 'contains',
      options: [
        { value: 'contains', label: 'Contains' },
        { value: 'equals', label: 'Equals' },
        { value: 'regex', label: 'Regex' },
      ],
    },
    {
      key: 'caseSensitive',
      label: 'Case sensitive',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
});
