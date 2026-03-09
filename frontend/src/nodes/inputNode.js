import { FileInput } from 'lucide-react';
import { Position } from 'reactflow';
import { createConfigNode } from './Base-Node/nodeBase';

export const InputNode = createConfigNode({
  title: 'Input',
  icon: FileInput,
  keyColor: '#bfdbfe',
  handles: [{ type: 'source', position: Position.Right, id: 'value' }],
  fields: [
    {
      key: 'inputName',
      label: 'Name',
      defaultValue: ({ id }) => id.replace('customInput-', 'input_'),
      placeholder: 'input_name',
    },
    {
      key: 'inputType',
      label: 'Type',
      type: 'select',
      defaultValue: 'Text',
      options: [
        { value: 'Text', label: 'Text' },
        { value: 'File', label: 'File' },
      ],
    },
  ],
});
