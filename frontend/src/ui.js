import { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { FilterNode } from './nodes/filterNode';
import { MergeNode } from './nodes/mergeNode';
import { DelayNode } from './nodes/delayNode';
import { ApiNode } from './nodes/apiNode';
import { SwitchNode } from './nodes/switchNode';
import { DeletableEdge } from './edges/deletableEdge';

import 'reactflow/dist/style.css';

const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  filter: FilterNode,
  merge: MergeNode,
  delay: DelayNode,
  api: ApiNode,
  switch: SwitchNode,
};


const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = ({ onReadyAddNode }) => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { nodes, edges, getNodeID, addNode, onNodesChange, onEdgesChange, onConnect } =
    useStore(selector, shallow);

  const createNode = useCallback(
    (type, position) => {
      const nodeID = getNodeID(type);
      const newNode = {
        id: nodeID,
        type,
        position,
        data: { id: nodeID, nodeType: type }
      };
      addNode(newNode);
    },
    [addNode, getNodeID]
  );

  const addNodeFromToolbar = useCallback(
    (type) => {
      if (!reactFlowInstance || !reactFlowWrapper.current) return;
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const offsetSeed = nodes.length % 6;
      const position = reactFlowInstance.project({
        x: reactFlowBounds.width / 2 + offsetSeed * 24,
        y: reactFlowBounds.height / 2 + offsetSeed * 16,
      });
      createNode(type, position);
    },
    [createNode, nodes.length, reactFlowInstance]
  );

  useEffect(() => {
    if (!onReadyAddNode) return;
    onReadyAddNode(() => addNodeFromToolbar);
  }, [addNodeFromToolbar, onReadyAddNode]);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      if (!reactFlowInstance || !reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData('application/reactflow')) {
        const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
        const type = appData?.nodeType;
        if (typeof type === 'undefined' || !type) return;

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });
        createNode(type, position);
      }
    },
    [createNode, reactFlowInstance]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div ref={reactFlowWrapper} className="canvas-shell">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        edgeTypes={{ deletable: DeletableEdge }}
        proOptions={{ hideAttribution: true }}
        snapGrid={[20, 20]}
        connectionLineType="smoothstep"
      >
        <Background color="#aaa" gap={20} />
        <Controls />
        <MiniMap
          pannable
          zoomable
          offsetScale={1}
        />
      </ReactFlow>
    </div>
  );
};
