import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { TaskDetail } from './TaskDetail'
import { DatePicker } from '../common/DatePicker'
import { useAuth } from '../../hooks/useAuth.jsx'
import Button from '../common/Button.jsx'
import { Icons } from '../common/Icons'

export function TaskList({ workflowId }) {
  const { user, isHost, isArchitect } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    data_consegna: null,
  })

  useEffect(() => {
    if (workflowId) {
      fetchTasks()
    }

    const subscription = supabase
      .channel(`tasks-for-workflow-${workflowId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `workflow_id=eq.${workflowId}`
      }, (payload) => {
        console.log('Change received!', payload)
        fetchTasks()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [workflowId])

  async function fetchTasks() {
    if (!workflowId) return;
    try {
      setLoading(true);
      console.log('📋 Fetching tasks for workflow:', workflowId);
      const { data, error } = await supabase
        .from('tasks')
        .select('*, assigned_to_profile:profiles(email, display_name)')
        .eq('workflow_id', workflowId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error fetching tasks:', error);
        throw error;
      }
      console.log('✅ Fetched', data?.length || 0, 'tasks:', data);
      setTasks(data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  async function assignToMe(taskId) {
    try {
      console.log('🎯 Attempting to assign task', taskId, 'to user', user.id);
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('tasks')
        .update({
          assigned_to: user.id,
          status: 'doing',
          assigned_at: now
        })
        .eq('id', taskId);

      if (error) {
        console.error('❌ Assignment error:', error);
        throw error;
      }
      console.log('✅ Task assigned successfully');
      // alert('✅ Task presa in carico con successo!'); // Removed blocking alert for better UX
      fetchTasks() // Refetch to update UI
    } catch (error) {
      console.error('❌ Error in assignToMe:', error);
      alert('❌ Errore: ' + error.message + '\n\nPotrebbe essere un problema di permessi RLS nel database.')
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!workflowId) return;

    try {
      const initialStatus = isArchitect ? 'pending_approval' : 'todo';

      const { error } = await supabase
        .from('tasks')
        .insert([{
          ...newTask,
          workflow_id: workflowId,
          status: initialStatus,
        }])

      if (error) throw error

      setNewTask({ title: '', description: '', data_consegna: null })
      setShowForm(false)
      fetchTasks()
    } catch (error) {
      alert('Error creating task: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const columns = [
    { id: 'pending_approval', title: 'Pending Approval', color: 'bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-700/30 backdrop-blur-sm' },
    { id: 'maintenance', title: 'Maintenance', color: 'bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-700/30 backdrop-blur-sm' },
    { id: 'todo', title: 'To Do', color: 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-white/10 backdrop-blur-sm' },
    { id: 'doing', title: 'Doing', color: 'bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border border-blue-700/30 backdrop-blur-sm' },
    { id: 'awaiting_validation', title: 'Awaiting Validation', color: 'bg-gradient-to-br from-amber-900/30 to-yellow-900/30 border border-amber-700/30 backdrop-blur-sm' },
    { id: 'done', title: 'Done', color: 'bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-700/30 backdrop-blur-sm' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {/* Title is now in WorkflowDetail page */}
        {(isHost || isArchitect) && (
          <Button
            onClick={() => setShowForm(!showForm)}
            variant="primary"
            className="ml-auto"
          >
            {showForm ? 'Cancel' : '+ New Task'}
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-900/60 backdrop-blur-xl p-6 rounded-xl shadow-lg border border-white/10 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
              <input
                type="text"
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full px-3 py-2 border border-white/10 bg-black/20 text-white placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
                value={newTask.description}
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full px-3 py-2 border border-white/10 bg-black/20 text-white placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent"
                rows="3"
              />
            </div>
            <DatePicker
              label="Data Consegna (opzionale)"
              value={newTask.data_consegna}
              onChange={(date) => setNewTask({ ...newTask, data_consegna: date })}
            />
            <div className="flex justify-end">
              <Button type="submit" variant="primary">
                Create Task
              </Button>
            </div>
          </div>
        </form>
      )}

      <div className="grid gap-4 pb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        {columns.map(col => (
          <div key={col.id} className={`rounded-xl p-4 ${col.color} min-h-[500px]`}>
            <h3 className="font-bold text-white mb-4 flex justify-between items-center">
              {col.title}
              <span className="bg-black/30 text-white px-2 py-1 rounded-full text-xs shadow-sm border border-white/10">
                {tasks.filter(t => t.status === col.id).length}
              </span>
            </h3>

            <div className="space-y-3">
              {tasks.filter(t => t.status === col.id).map(task => {
                const isOverdue = task.data_consegna && new Date(task.data_consegna) < new Date() && task.status !== 'done'
                return (
                  <div
                    key={task.id}
                    className="bg-black/40 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-white/10 hover:bg-black/60 hover:border-white/20 transition-all cursor-pointer"
                    onClick={() => setSelectedTask(task)}
                  >
                    <h4 className="font-semibold text-white mb-2">{task.title}</h4>
                    <p className="text-sm text-gray-300 mb-3 line-clamp-2">{task.description}</p>

                    {task.data_consegna && (
                      <div className={`text-xs mb-2 flex items-center gap-1 ${isOverdue ? 'text-red-400 font-medium' : 'text-gray-400'}`}>
                        <Icons.Calendar className="w-3 h-3 inline mr-1" /> {new Date(task.data_consegna).toLocaleDateString('it-IT')}
                        {isOverdue && ' - Scaduto!'}
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-3 border-t border-white/10">
                      <div className="text-xs text-gray-400">
                        {task.assigned_to_profile ? (
                          <span className="flex items-center gap-1">
                            <Icons.User className="w-3 h-3 inline mr-1" /> {task.assigned_to_profile.display_name || task.assigned_to_profile.email.split('@')[0]}
                          </span>
                        ) : (
                          col.id === 'todo' && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                assignToMe(task.id);
                              }}
                              variant="outline"
                              className="text-primary-400 border-primary-400 hover:bg-primary-500/10"
                            >
                              + Prendi in carico
                            </Button>
                          )
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {task.status === 'awaiting_validation' && (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30 animate-pulse">
                            <Icons.Lightning className="w-3 h-3 inline mr-1" /> Validation
                          </span>
                        )}
                        {task.revision_feedback && task.status === 'doing' && (
                          <span className="text-[10px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded border border-red-500/30 font-bold">
                            <Icons.Exclamation className="w-3 h-3 inline mr-1" /> Changes Requested
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <TaskDetail
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={fetchTasks}
      />
    </div>
  )
}
