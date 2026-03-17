import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { TaskList } from '../components/tasks/TaskList';
import Button from '../components/common/Button.jsx';
import { WorkflowAttachments } from '../components/workflows/WorkflowAttachments';
import PageTransition from '../components/common/PageTransition';
import { useAuth } from '../hooks/useAuth.jsx';
import { useToast } from '../contexts/ToastContext';

export default function WorkflowDetail() {
  const { workflowId } = useParams();
  const navigate = useNavigate();
  const { isHost } = useAuth();
  const { showToast } = useToast();
  const [workflow, setWorkflow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchWorkflow = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('workflows')
          .select('*')
          .eq('id', workflowId)
          .single();

        if (error) {
          throw error;
        }

        setWorkflow(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflow();
  }, [workflowId]);

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteWorkflow = async () => {
    setShowDeleteModal(false);

    try {
      // First delete all tasks associated with this workflow
      const { error: tasksError } = await supabase
        .from('tasks')
        .delete()
        .eq('workflow_id', workflowId);

      if (tasksError) throw tasksError;

      // Then delete the workflow
      const { error: workflowError } = await supabase
        .from('workflows')
        .delete()
        .eq('id', workflowId);

      if (workflowError) throw workflowError;

      showToast('Workflow deleted successfully', 'success');
      // Redirect to workflows list
      navigate('/workflows');
    } catch (err) {
      showToast('Error deleting workflow: ' + err.message, 'error');
    }
  };

  const updateWorkflowStatus = async (newStatus) => {
    try {
      const { error } = await supabase
        .from('workflows')
        .update({ status: newStatus === 'approved' ? 'active' : newStatus })
        .eq('id', workflowId);

      if (error) throw error;

      // Refresh local state or navigate
      if (newStatus === 'rejected') {
        navigate('/workflows'); // Go back to list on reject? Or stay? Let's reload to update UI
        window.location.reload();
      } else {
        // If approved, reload to show active state
        setWorkflow({ ...workflow, status: newStatus });
      }
      showToast('Workflow status updated successfully', 'success');
    } catch (e) {
      console.error(e);
      showToast('Error updating status: ' + e.message, 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading workflow...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400 text-center mt-8 bg-red-500/10 border border-red-500/20 p-4 rounded-xl">Error: {error}</div>;
  }

  if (!workflow) {
    return <div className="text-center mt-8 text-gray-400">Workflow not found.</div>;
  }

  return (
    <PageTransition className="py-8 px-4 sm:px-6 lg:px-8 bg-[#f8fafc] min-h-screen">
      <Link to="/workflows">
        <Button variant="outline" className="mb-4">
          &larr; Back to Workflows
        </Button>
      </Link>

      {isHost && workflow.status === 'proposed' && (
        <div className="mb-8 p-6 rounded-2xl border border-amber-200 bg-amber-50 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="font-bold text-amber-800 text-lg flex items-center gap-2">
              <span>⏳ In Attesa di Revisione</span>
            </h3>
            <p className="text-amber-700/80 text-sm mt-1">
              Questo workflow è attualmente una proposta. Revisiona i dettagli e prendi una decisione.
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button
              onClick={() => updateWorkflowStatus('approved')}
              className="bg-[#1a2b4b] hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all flex-1 md:flex-none"
            >
              Approva & Attiva
            </Button>
            <Button
              onClick={() => updateWorkflowStatus('rejected')}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 font-bold py-3 px-6 rounded-xl flex-1 md:flex-none"
            >
              Rifiuta
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
        <div className="flex-1">
          <h1 className="text-4xl font-black mb-2 text-[#1a2b4b] tracking-tight">{workflow.title}</h1>
          <div className="flex items-center gap-3">
             <p className="text-gray-500">Stato:</p>
             <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1a2b4b]/10 text-[#1a2b4b] uppercase tracking-wider">
               {workflow.status}
             </span>
          </div>
        </div>

        {isHost && (
          <Button
            variant="outline"
            onClick={openDeleteModal}
            className="text-red-500 border-red-200 hover:bg-red-50 rounded-xl"
          >
            Elimina Workflow
          </Button>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-8"></div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
        <h3 className="text-lg font-bold text-[#1a2b4b] mb-4">Descrizione</h3>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{workflow.description}</p>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10 my-8"></div>

      <div className="mt-8 mb-8">
        <WorkflowAttachments workflowId={workflowId} />
      </div>

      {/* Divider */}
      <div className="border-t border-white/10 my-8"></div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6 text-[#1a2b4b] flex items-center gap-3">
          <span className="p-2 bg-[#1a2b4b]/5 rounded-lg">
             <Icons.List className="w-6 h-6 text-[#1a2b4b]" />
          </span>
          Tasks
        </h2>
        <TaskList workflowId={workflowId} />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-red-500/30 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            {/* Header with Icon */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center border-2 border-red-500/50">
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Delete Workflow</h3>
                <p className="text-sm text-gray-400">This action cannot be undone</p>
              </div>
            </div>

            {/* Message */}
            <div className="bg-red-500/10 border-l-4 border-red-500 rounded-r-lg p-4 mb-6">
              <p className="text-white font-semibold mb-2">
                Are you sure you want to delete this workflow?
              </p>
              <p className="text-sm text-gray-300">
                ⚠️ All associated tasks will also be permanently removed.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={() => setShowDeleteModal(false)}
                variant="outline"
                className="flex-1 py-3 border-2 border-white/20 hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteWorkflow}
                variant="danger"
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 border-none font-bold"
              >
                🗑️ Delete Forever
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
}
