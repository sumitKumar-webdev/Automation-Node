import { Bot } from 'lucide-react';
import { Position } from 'reactflow';
import { createConfigNode, NodeNote } from './Base-Node/nodeBase';

export const LLMNode = createConfigNode({
  title: 'LLM',
  icon: Bot,
  keyColor: '#ddd6fe',
  subtitle: 'Model runtime',
  handles: [
    { type: 'target', position: Position.Left, id: 'system', offset: 33 },
    { type: 'target', position: Position.Left, id: 'prompt', offset: 66 },
    { type: 'source', position: Position.Right, id: 'response' },
  ],
  content: () => <NodeNote>This is a LLM.</NodeNote>,
});
