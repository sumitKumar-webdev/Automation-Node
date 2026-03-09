import { useState } from 'react';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';

function App() {
  const [isToolbarOpen, setIsToolbarOpen] = useState(true);
  const [addNodeFromToolbar, setAddNodeFromToolbar] = useState(() => () => {});

  return (
    <div className="app-shell">
      <PipelineToolbar
        isOpen={isToolbarOpen}
        onToggle={() => setIsToolbarOpen((prev) => !prev)}
        onAddNode={addNodeFromToolbar}
      />
      <PipelineUI onReadyAddNode={setAddNodeFromToolbar} />
    </div>
  );
}

export default App;
