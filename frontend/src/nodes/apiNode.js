import { Globe } from 'lucide-react';
import { Position } from 'reactflow';
import { createConfigNode } from './Base-Node/nodeBase';

export const ApiNode = createConfigNode({
  title: 'API',
  icon: Globe,
  keyColor: '#bae6fd',
  subtitle: 'HTTP request',
  handles: [
    { type: 'target', position: Position.Left, id: 'payload' },
    { type: 'source', position: Position.Right, id: 'response' },
  ],
  fields: [
    {
      key: 'method',
      label: 'Method',
      type: 'select',
      defaultValue: 'GET',
      options: [
        { value: 'GET', label: 'GET' },
        { value: 'POST', label: 'POST' },
        { value: 'PUT', label: 'PUT' },
        { value: 'DELETE', label: 'DELETE' },
      ],
    },
    {
      key: 'url',
      label: 'URL',
      defaultValue: 'https://api.example.com',
      placeholder: 'https://api.example.com',
    },
    {
      key: 'timeout',
      label: 'Timeout (ms)',
      type: 'number',
      defaultValue: 2000,
      placeholder: '2000',
    },
  ],
});
