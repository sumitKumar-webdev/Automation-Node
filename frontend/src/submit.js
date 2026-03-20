import { useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});


const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:8000').replace(/\/$/, '');

export const SubmitButton = ({ className = '' }) => {
  const [loading, setLoading] = useState(false);
  const { nodes, edges } = useStore(selector, shallow);

  const handleSubmit = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/pipelines/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) throw new Error(`Request failed with ${response.status}`);

      const result = await response.json();
      alert(
        `Pipeline Summary\n\n` +
        `Nodes: ${result.num_nodes}\n` +
        `Edges: ${result.num_edges}\n` +
        `Is DAG: ${result.is_dag ? 'Yes' : 'No'}`
      );
    } catch (error) {
      alert(`Unable to parse pipeline. ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`submit-button ${loading ? 'is-loading' : ''} ${className}`.trim()}
      type="button"
      onClick={handleSubmit}
      disabled={loading}
    >
      {loading ? (
        <>
          <LoaderCircle className="submit-button-loader" size={14} strokeWidth={2.25} aria-hidden="true" />
          <span>Submitting...</span>
        </>
      ) : (
        'Submit'
      )}
    </button>
  );
};
