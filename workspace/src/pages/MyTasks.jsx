import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth.jsx';
import { TaskDetail } from '../components/tasks/TaskDetail';
import Button from '../components/common/Button.jsx';
import PageTransition from '../components/common/PageTransition';
import { Icons } from '../components/common/Icons';

export default function MyTasks() {
  const { user, isArchitect, isHost } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [tasksToValidate, setTasksToValidate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    if (user) {
      fetchMyTasks();
      if (isArchitect || isHost) {
        fetchTasksToValidate();
      }
    }
  }, [user, isArchitect, isHost]);

  async function fetchMyTasks() {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('assigned_to', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data);
    } catch (error) {
      console.error('Error fetching my tasks:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTasksToValidate() {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          workflow:workflows!inner(created_by, title)
        `)
        .eq('workflow.created_by', user.id)
        .eq('status', 'awaiting_validation')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasksToValidate(data || []);
    } catch (error) {
      console.error('Error fetching tasks to validate:', error);
    }
  }

  const handleTaskUpdate = () => {
    fetchMyTasks();
    if (isArchitect || isHost) {
      fetchTasksToValidate();
    }
  };

  const columns = [
    { id: 'maintenance', title: 'Manutenzione', color: 'bg-orange-900/20 border-orange-500/20' },
    // { id: 'todo', title: 'To Do', color: 'bg-purple-900/20 border-purple-500/20' }, // Removed for MyTasks
    { id: 'doing', title: 'Doing', color: 'bg-blue-900/20 border-blue-500/20' },
    { id: 'awaiting_validation', title: 'Awaiting Validation', color: 'bg-amber-900/20 border-amber-500/20' },
    { id: 'done', title: 'Done', color: 'bg-green-900/20 border-green-500/20' }
  ];

  return (
    <PageTransition className="space-y-8">
      <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-2xl p-6 mb-8 backdrop-blur-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <span className="text-9xl">🚀</span>
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="bg-blue-500/20 text-blue-400 p-2 rounded-lg border border-blue-500/30">
              <Icons.Training className="w-6 h-6" />
            </span>
            Guida per i Tasker
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
              <h3 className="font-bold text-blue-300 mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs border border-blue-500/50">1</span>
                Prendi in Carico
              </h3>
              <p className="text-sm text-gray-300">
                Scegli una task dalla lista "To Do" e clicca su <span className="text-white font-semibold">Start Task</span>. La task si sposterà in "Doing".
              </p>
            </div>
            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
              <h3 className="font-bold text-purple-300 mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs border border-purple-500/50">2</span>
                Esegui il Lavoro
              </h3>
              <p className="text-sm text-gray-300">
                Lavora sul codice o sul contenuto richiesto. Assicurati di seguire le specifiche descritte nella task.
              </p>
            </div>
            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
              <h3 className="font-bold text-green-300 mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-xs border border-green-500/50">3</span>
                Consegna
              </h3>
              <div className="text-sm text-gray-300">
                Per completare, devi fornire <span className="text-white font-semibold">Obbligatoriamente</span>:
                <ul className="list-disc list-outside mt-2 ml-4 text-gray-400 space-y-1">
                  <li>Un link a una <strong>Repository Pubblica</strong></li>
                  <li><em className="text-xs">OPPURE</em> una <strong>Descrizione Dettagliata</strong> (riservato esclusivamente a task teorici o documentali)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-white">Le mie Task</h1>

      {/* Tasks to Validate Section (for Coordinators) */}
      {(isArchitect || isHost) && tasksToValidate.length > 0 && (
        <div className="mb-8">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⏳</span>
                <div>
                  <h2 className="text-xl font-bold text-white">Tasks da Validare</h2>
                  <p className="text-sm text-amber-200">Tasks completate dai tuoi workflow che richiedono la tua approvazione</p>
                </div>
              </div>
              <span className="bg-amber-500 text-black font-bold px-3 py-1 rounded-full">
                {tasksToValidate.length}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasksToValidate.map(task => (
                <div
                  key={task.id}
                  className="bg-gray-900/80 p-4 rounded-lg shadow-sm border border-amber-500/30 hover:shadow-lg hover:border-amber-500/50 transition-all cursor-pointer group"
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-white group-hover:text-amber-400 transition-colors flex-1">
                      {task.title}
                    </h4>
                    <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full ml-2">
                      Validate
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded border ${task.difficulty === 'Hard' ? 'bg-red-900/40 text-red-300 border-red-700/50' :
                      task.difficulty === 'Medium' ? 'bg-yellow-900/40 text-yellow-300 border-yellow-700/50' :
                        'bg-green-900/40 text-green-300 border-green-700/50'
                      }`}>
                      {task.difficulty}
                    </span>
                    {task.revision_feedback && task.status === 'doing' && (
                      <span className="text-[10px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded border border-red-500/30 font-bold">
                        ⚠️ Changes Requested
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mb-2 line-clamp-2">{task.description}</p>
                  <div className="text-xs text-gray-500 border-t border-white/10 pt-2 mt-2">
                    <span className="font-medium">Workflow:</span> {task.workflow?.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {loading && <p>Loading tasks...</p>}

      {!loading && tasks.length === 0 && (
        <div className="text-center py-12 bg-gray-900/60 backdrop-blur-xl rounded-lg shadow-lg border border-white/10">
          <h3 className="text-xl font-medium text-white">Nessuna task assegnata.</h3>
          <p className="text-gray-400 mt-2">Vai alla lista dei workflow per prendere in carico nuove task.</p>
        </div>
      )}

      {!loading && tasks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto pb-4">
          {columns.map(col => (
            <div key={col.id} className={`rounded-xl p-4 ${col.color} border min-h-[500px] backdrop-blur-sm`}>
              <h3 className="font-bold text-white mb-4 flex justify-between items-center">
                {col.title}
                <span className="bg-white/10 px-2 py-1 rounded-full text-xs shadow-sm border border-white/10">
                  {tasks.filter(t => t.status === col.id).length}
                </span>
              </h3>
              <div className="space-y-3">
                {tasks.filter(t => t.status === col.id).map(task => (
                  <div
                    key={task.id}
                    className="bg-gray-900/80 p-4 rounded-lg shadow-sm border border-white/10 hover:shadow-lg hover:border-primary-500/30 transition-all cursor-pointer group"
                    onClick={() => setSelectedTask(task)}
                  >
                    <h4 className="font-semibold text-gray-100 mb-2 group-hover:text-primary-400 transition-colors">{task.title}</h4>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{task.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <TaskDetail
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={handleTaskUpdate}
      />
    </PageTransition>
  );
}
