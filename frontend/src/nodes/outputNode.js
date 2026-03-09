import { FileOutput } from 'lucide-react';
import { Position } from 'reactflow';
import { createConfigNode } from './Base-Node/nodeBase';

export const OutputNode = createConfigNode({
  title: 'Output',
  icon: FileOutput,
  keyColor: '#bbf7d0',
  handles: [
    { type: 'target', position: Position.Left, id: 'value' },
  ],
  fields: [
    {
      key: 'outputName',
      label: 'Name',
      defaultValue: ({ id }) => id.replace('customOutput-', 'output_'),
      placeholder: 'output_name',
    },
    {
      key: 'outputType',
      label: 'Type',
      type: 'select',
      defaultValue: 'Text',
      options: [
        { value: 'Text', label: 'Text' },
        { value: 'File', label: 'Image' },
      ],
    },
  ],
});
