import {
  Bot,
  FileInput,
  FileOutput,
  Filter,
  GitMerge,
  Globe,
  Plus,
  Split,
  Timer,
  Type,
} from 'lucide-react';
import { DraggableNode } from './draggableNode';
import { SubmitButton } from './submit';

export const PipelineToolbar = ({ isOpen, onToggle, onAddNode }) => {

  const nodeItems = [
    { type: 'customInput', label: 'Input', icon: FileInput },
    { type: 'llm', label: 'LLM', icon: Bot },
    { type: 'customOutput', label: 'Output', icon: FileOutput },
    { type: 'text', label: 'Text', icon: Type },
    { type: 'filter', label: 'Filter', icon: Filter },
    { type: 'merge', label: 'Merge', icon: GitMerge },
    { type: 'delay', label: 'Delay', icon: Timer },
    { type: 'api', label: 'API', icon: Globe },
    { type: 'switch', label: 'Switch', icon: Split },
  ];

  return (
    <div className={`toolbar-shell ${isOpen ? 'is-open' : 'is-closed'}`}>
      <div className="toolbar-header">
        <div>
          <div className="toolbar-title">Pipeline Builder</div>
          <div className="toolbar-subtitle">{isOpen
            ? 'Drag or tap nodes to add them'
            : 'Tap + to open node list'}</div>
        </div>
        <div className="toolbar-actions">
          <SubmitButton className="toolbar-submit-button" />
          <button
            className="toolbar-toggle"
            type="button"
            onClick={onToggle}
          >
            <Plus
              size={16}
              strokeWidth={2.5}
              className={`toolbar-toggle-icon ${isOpen ? 'is-open' : 'is-closed'}`}
            />
          </button>
        </div>
      </div>
      <div
        className={`toolbar-content ${isOpen ? 'is-open' : 'is-closed'}`}
        style={{ maxHeight: isOpen ? `100px` : '0px' }}
      >
        <div className="toolbar-grid">
          {nodeItems.map((node) => (
            <DraggableNode
              key={node.type}
              type={node.type}
              label={node.label}
              Icon={node.icon}
              onClickAdd={onAddNode}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
