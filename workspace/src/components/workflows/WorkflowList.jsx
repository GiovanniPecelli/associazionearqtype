import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { AnimatePresence, motion } from 'framer-motion'
import PageTransition from '../common/PageTransition'
import { Icons } from '../common/Icons'
import { useToast } from '../../contexts/ToastContext'
import Button from '../common/Button'
import { Badge } from '../common/Badge'
import { Modal } from '../common/Modal'


export function WorkflowList() {
  // Force re-render fix
  const { user, isHost } = useAuth()
  const { showToast } = useToast()
  const [workflows, setWorkflows] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  // Form State
  const [editingId, setEditingId] = useState(null) // ID of workflow being edited
  const [newWorkflow, setNewWorkflow] = useState({
    title: '',
    description: '',
    obiettivo: '',
    fasi: '',
    architect_proposto: null,
    category_id: null
  })
  const [newTasks, setNewTasks] = useState([{ title: '', description: '' }])

  const [profiles, setProfiles] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // State for custom delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [workflowToDeleteId, setWorkflowToDeleteId] = useState(null)

  // Mobile: Controls visibility of pending/rejected workflows "card"
  const [showMobilePending, setShowMobilePending] = useState(false)

  useEffect(() => {
    fetchWorkflows()
    fetchProfiles()
    fetchCategories()

    const subscription = supabase
      .channel('workflows-list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'workflows' }, fetchWorkflows)
      .subscribe()

    return () => supabase.removeChannel(subscription)
  }, [])

  async function fetchProfiles() {
    const { data } = await supabase.from('profiles').select('id, email, role').order('email')
    setProfiles(data || [])
  }

  async function fetchCategories() {
    const { data } = await supabase.from('workflow_categories').select('*').order('name')
    setCategories(data || [])
  }

  async function fetchWorkflows() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('workflows')
        .select(`
  *,
  created_by_profile: profiles!workflows_created_by_fkey(email, display_name),
    category: workflow_categories(id, name, color)
      `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setWorkflows(data)
    } catch (error) {
      console.error('Error fetching workflows:', error)
      showToast('Error fetching workflows: ' + error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  // --- Form Handling ---

  const handleTaskChange = (index, field, value) => {
    const updatedTasks = [...newTasks]
    updatedTasks[index][field] = value
    setNewTasks(updatedTasks)
  }

  const addTask = () => {
    setNewTasks([...newTasks, { title: '', description: '' }])
  }

  const removeTask = (index) => {
    const updatedTasks = newTasks.filter((_, i) => i !== index)
    setNewTasks(updatedTasks)
  }

  const openNewProposalForm = () => {
    setEditingId(null);
    setNewWorkflow({ title: '', description: '', obiettivo: '', fasi: '', architect_proposto: null, category_id: null });
    setNewTasks([{ title: '', description: '' }]);
    setShowForm(true);
  }

  const handleEditClick = async (workflow) => {
    setEditingId(workflow.id);
    setNewWorkflow({
      title: workflow.title,
      description: workflow.description || '',
      obiettivo: workflow.obiettivo || '',
      fasi: workflow.fasi || '',
      architect_proposto: workflow.architect_proposto || null,
      category_id: workflow.category_id || null
    });

    // Fetch existing tasks
    const { data: tasks } = await supabase.from('tasks').select('*').eq('workflow_id', workflow.id);
    if (tasks && tasks.length > 0) {
      setNewTasks(tasks.map(t => ({ title: t.title, description: t.description || '' })));
    } else {
      setNewTasks([{ title: '', description: '' }]);
    }

    setShowForm(true);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)

    try {
      const workflowData = {
        ...newWorkflow,
        created_by: user.id,
        status: 'proposed' // Always proposed when new or resubmitted
      };

      // Clean empty fields
      if (!workflowData.architect_proposto) delete workflowData.architect_proposto;
      if (workflowData.description === '') delete workflowData.description;
      if (workflowData.obiettivo === '') delete workflowData.obiettivo;
      if (workflowData.fasi === '') delete workflowData.fasi;
      if (!workflowData.category_id) delete workflowData.category_id;

      let workflowId = editingId;

      if (editingId) {
        // UPDATE existing workflow
        const { error: updateError } = await supabase
          .from('workflows')
          .update(workflowData)
          .eq('id', editingId);

        if (updateError) throw updateError;

        // Replace tasks: Delete all old tasks and insert new ones
        // This is destructive but simple for this use case
        await supabase.from('tasks').delete().eq('workflow_id', editingId);

      } else {
        // INSERT new workflow
        const { data: inserted, error: insertError } = await supabase
          .from('workflows')
          .insert([workflowData])
          .select()
          .single();

        if (insertError) throw insertError;
        workflowId = inserted.id;
      }

      // Insert Tasks
      const tasksToInsert = newTasks
        .filter(task => task.title.trim() !== '')
        .map(task => ({
          ...task,
          workflow_id: workflowId,
          status: 'pending_approval'
        }))

      if (tasksToInsert.length > 0) {
        const { error: tasksError } = await supabase.from('tasks').insert(tasksToInsert)
        if (tasksError) throw tasksError
      }

      // Reset
      setNewWorkflow({ title: '', description: '', obiettivo: '', fasi: '', architect_proposto: null, category_id: null })
      setNewTasks([{ title: '', description: '' }])
      setShowForm(false)
      setEditingId(null)
      fetchWorkflows()
      showToast(editingId ? 'Workflow updated and resubmitted!' : 'Workflow proposed successfully!', 'success');

    } catch (error) {
      showToast('Error saving workflow: ' + error.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // --- Actions ---

  async function updateWorkflowStatus(workflowId, newStatus) {
    try {
      const statusToSet = newStatus === 'approved' ? 'active' : newStatus;
      const { error } = await supabase.from('workflows').update({ status: statusToSet }).eq('id', workflowId)
      if (error) throw error
      fetchWorkflows()
    } catch (error) {
      showToast('Error updating workflow: ' + error.message, 'error')
    }
  }

  async function updateWorkflowCategory(workflowId, categoryId) {
    try {
      const val = categoryId === '' ? null : categoryId;
      const { error } = await supabase.from('workflows').update({ category_id: val }).eq('id', workflowId)
      if (error) throw error
      fetchWorkflows()
    } catch (error) {
      showToast('Error updating category: ' + error.message, 'error')
    }
  }

  const handleDeleteClick = (workflowId, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setWorkflowToDeleteId(workflowId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!workflowToDeleteId) return;
    try {
      // Tasks are cascade deleted or handled by loop in some DBs, 
      // but let's assume we need to be safe like Detail page logic if not cascaded.
      // But Detail page logic does explicit task delete. Let's rely on that plan if we want consistency.
      const { error: tasksError } = await supabase.from('tasks').delete().eq('workflow_id', workflowToDeleteId);
      if (tasksError) console.warn("Task delete warning", tasksError); // Might be empty

      const { error } = await supabase.from('workflows').delete().eq('id', workflowToDeleteId);
      if (error) throw error;

      fetchWorkflows();
    } catch (error) {
      alert('Error deleting workflow: ' + error.message);
    } finally {
      setShowDeleteModal(false);
      setWorkflowToDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setWorkflowToDeleteId(null);
  };

  // --- Filtering ---

  const filterWorkflows = (workflowList) => {
    let filtered = workflowList;
    if (searchQuery.trim()) {
      filtered = filtered.filter(w =>
        w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (w.description && w.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(w => w.category_id === selectedCategory);
    }
    return filtered;
  };

  const proposedWorkflows = filterWorkflows(workflows.filter(w => w.status === 'proposed'))
  const rejectedWorkflows = filterWorkflows(workflows.filter(w => w.status === 'rejected'))
  const activeWorkflows = filterWorkflows(workflows.filter(w => w.status !== 'proposed' && w.status !== 'rejected'))

  const workflowsByCategory = {};
  activeWorkflows.forEach(wf => {
    const categoryName = wf.category?.name || 'Uncategorized';
    if (!workflowsByCategory[categoryName]) {
      workflowsByCategory[categoryName] = { category: wf.category, workflows: [] };
    }
    workflowsByCategory[categoryName].workflows.push(wf);
  });

  const hasActionItems = proposedWorkflows.length > 0 || rejectedWorkflows.length > 0;

  return (
    <PageTransition className="space-y-10 pb-20 md:pb-0 relative min-h-screen px-4 sm:px-6 lg:px-8 py-8">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-2 relative z-10">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Workflows</h1>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {/* Desktop Pending Button */}
          {hasActionItems && (
            <Button
              onClick={() => setShowMobilePending(true)}
              className="hidden lg:flex items-center gap-2 bg-amber-500/10 text-amber-500 border border-amber-500/50 hover:bg-amber-500/20 px-6 py-4 text-lg font-bold shadow-[0_0_15px_rgba(245,158,11,0.2)]"
            >
              <Icons.Lightning className="w-5 h-5" />
              Review Pending ({proposedWorkflows.length + rejectedWorkflows.length})
            </Button>
          )}

          <Button
            onClick={() => {
              if (showForm) {
                setShowForm(false);
              } else {
                openNewProposalForm();
              }
            }}
            variant="primary"
            className="shadow-xl shadow-primary-500/20 w-full md:w-auto px-8 py-4 text-lg font-bold transform hover:scale-105 transition-all"
          >
            {showForm ? 'Close Proposal' : '+ Propose Workflow'}
          </Button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-[#020617]/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search workflows by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-white placeholder-gray-400 text-lg transition-all focus:bg-white/10"
            />
          </div>
          <div className="md:w-72">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-5 py-3 bg-[#020617] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-white text-lg appearance-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {
        showForm && (
          <form onSubmit={handleSubmit} className="bg-[#020617]/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/10 animate-fade-in ring-1 ring-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">{editingId ? 'Edit Proposal' : 'Propose New Workflow'}</h2>
              {editingId && <Badge status="rejected" />}
            </div>

            <div className="space-y-6">
              <fieldset className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                  <input type="text" value={newWorkflow.title} onChange={e => setNewWorkflow({ ...newWorkflow, title: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-white" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description / Proposal</label>
                  <textarea value={newWorkflow.description} onChange={e => setNewWorkflow({ ...newWorkflow, description: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-white" rows="3" placeholder="Describe the workflow proposal..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Obiettivo</label>
                  <textarea value={newWorkflow.obiettivo} onChange={e => setNewWorkflow({ ...newWorkflow, obiettivo: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-white" rows="2" placeholder="Qual è l'obiettivo di questo workflow?" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Fasi</label>
                  <textarea value={newWorkflow.fasi} onChange={e => setNewWorkflow({ ...newWorkflow, fasi: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-white" rows="4" placeholder="Elenca le fasi del workflow (una per riga)..." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Proposed Coordinator</label>
                    <select
                      value={newWorkflow.architect_proposto || ''}
                      onChange={e => setNewWorkflow({ ...newWorkflow, architect_proposto: e.target.value || null })}
                      className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
                    >
                      <option value="">Seleziona un architect (opzionale)</option>
                      {profiles.filter(p => p.role === 'architect' || p.role === 'host').map(profile => (
                        <option key={profile.id} value={profile.id}>
                          {profile.email}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                    <select
                      value={newWorkflow.category_id || ''}
                      onChange={e => setNewWorkflow({ ...newWorkflow, category_id: e.target.value || null })}
                      className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
                    >
                      <option value="">Select a category (optional)</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </fieldset>

              <fieldset className="space-y-4">
                <legend className="text-lg font-semibold text-white mb-4 block">Pre-defined Tasks</legend>
                {newTasks.map((task, index) => (
                  <div key={index} className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-gray-300">Task #{index + 1}</p>
                      {newTasks.length > 1 && (
                        <Button type="button" onClick={() => removeTask(index)} variant="danger" className="p-2 rounded-lg text-xs">
                          Remove
                        </Button>
                      )}
                    </div>
                    <div>
                      <input type="text" placeholder="Task Title" value={task.title} onChange={e => handleTaskChange(index, 'title', e.target.value)} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white" />
                    </div>
                    <div>
                      <textarea placeholder="Task Description" value={task.description} onChange={e => handleTaskChange(index, 'description', e.target.value)} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white" rows="2" />
                    </div>
                  </div>
                ))}
                <Button type="button" onClick={addTask} variant="outline" className="w-full py-3 border-dashed border-2">
                  + Add Another Task
                </Button>
              </fieldset>

              <div className="flex justify-end pt-6 border-t border-white/10">
                <Button type="submit" disabled={submitting} variant="primary" className="px-8 py-3 text-lg">
                  {submitting ? 'Submitting...' : (editingId ? 'Resubmit Proposal' : 'Submit Proposal')}
                </Button>
              </div>
            </div>
          </form>
        )
      }

      {/* Main Content Layout - Grid Wrapper */}
      <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start mt-4">

        {/* Left Column: Active Workflows */}
        <div className="lg:col-span-8 space-y-8 min-h-[50vh]">
          <h2 className="text-2xl font-bold text-white mb-6 mt-4 hidden lg:block">Active Projects</h2>

          {/* Mobile: Action Required Trigger Button (Refined) */}
          <div className="lg:hidden mb-6">
            {hasActionItems && (
              <button
                onClick={() => setShowMobilePending(true)}
                className="w-full bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex items-center justify-between shadow-lg shadow-amber-500/5 active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-amber-500 text-black font-bold h-10 w-10 rounded-full flex items-center justify-center text-lg animate-pulse">
                    {proposedWorkflows.length + rejectedWorkflows.length}
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-amber-100 text-lg">Action Required</h3>
                    <p className="text-amber-500/60 text-sm">Review pending items</p>
                  </div>
                </div>
                <Icons.List className="w-6 h-6 text-amber-500" />
              </button>
            )}
          </div>

          {Object.keys(workflowsByCategory).length === 0 && (
            <div className="text-center py-12 bg-[#020617]/60 backdrop-blur-xl rounded-2xl shadow-lg border border-white/10">
              <h3 className="text-xl font-medium text-white">No active workflows</h3>
              <p className="text-gray-400 mt-2">Create a workflow proposal to get started.</p>
            </div>
          )}

          {Object.entries(workflowsByCategory).map(([categoryName, { category, workflows }]) => (
            <div key={categoryName} className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                {category && (
                  <div
                    className="w-4 h-4 rounded-full shadow-lg shadow-white/10"
                    style={{ backgroundColor: category.color }}
                  />
                )}
                <h4 className="text-xl font-bold text-gray-200 tracking-tight">{categoryName}</h4>
                <span className="text-sm font-medium text-gray-500 bg-black px-2 py-0.5 rounded-full border border-white/5">{workflows.length}</span>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {workflows.map(workflow => (
                  <Link to={`/workflow/${workflow.id}`} key={workflow.id} className="block group bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/5 hover:border-primary-500/50 hover:bg-zinc-800/80 transition-all hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-2">
                        <Badge status={workflow.status} type="workflow" />
                        {!isHost && workflow.category && (
                          <span className="px-2 py-1 rounded-full text-xs font-bold border" style={{ backgroundColor: `${workflow.category.color} 15`, borderColor: `${workflow.category.color} 30`, color: workflow.category.color }}>
                            {workflow.category.name}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-gray-500">{new Date(workflow.created_at).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">{workflow.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">{workflow.description}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500 border-t border-white/5 pt-4 mt-auto">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-[10px] text-white font-bold">
                          {(workflow.created_by_profile?.display_name || workflow.created_by_profile?.email || '?')[0].toUpperCase()}
                        </div>
                        <span>{workflow.created_by_profile?.display_name || 'User'}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Vertical Divider (Desktop Only) */}
        <div className="hidden lg:block w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent min-h-[60vh] mx-auto"></div>

        {/* Right Column: Pending & Rejected Sidebar (Desktop Only) */}
        <div className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24">

          {/* Pending Section */}
          <div className="bg-[#020617]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-yellow-900/20 to-orange-900/20">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>⏳ Pending Review</span>
                <span className="bg-yellow-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">{proposedWorkflows.length}</span>
              </h2>
            </div>

            <div className="max-h-[40vh] overflow-y-auto custom-scrollbar">
              {proposedWorkflows.length === 0 ? (
                <div className="text-center py-6 px-4">
                  <p className="text-gray-500 text-xs">No pending proposals.</p>
                </div>
              ) : (
                <div className="p-3 space-y-3">
                  {proposedWorkflows.map(workflow => (
                    <div key={workflow.id} className="bg-black/20 p-4 rounded-xl border border-white/5 hover:border-yellow-500/30 transition-colors space-y-3">
                      <div>
                        <span className="font-bold text-white text-sm block mb-1">{workflow.title}</span>
                        <p className="text-xs text-gray-400 line-clamp-2">{workflow.description}</p>
                      </div>

                      <Link
                        to={`/workflow/${workflow.id}`}
                        className="flex items-center justify-center gap-2 w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-bold transition-colors border border-white/5"
                      >
                        <Icons.Eye className="w-4 h-4" />
                        Review Details
                      </Link>

                      {isHost && (
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                          <Button onClick={() => updateWorkflowStatus(workflow.id, 'approved')} variant="success" className="text-[10px] py-1.5 h-auto">Approve</Button>
                          <Button onClick={() => updateWorkflowStatus(workflow.id, 'rejected')} variant="danger" className="text-[10px] py-1.5 h-auto">Reject</Button>
                        </div>
                      )}

                      {isHost && (
                        <div className="mt-1 text-right">
                          <button onClick={(e) => handleDeleteClick(workflow.id, e)} className="text-[10px] text-red-500/50 hover:text-red-500">Delete</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Rejected Section */}
          <div className="bg-[#020617]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-red-900/20 to-pink-900/20">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>🔴 Rejected</span>
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{rejectedWorkflows.length}</span>
              </h2>
            </div>

            <div className="max-h-[40vh] overflow-y-auto custom-scrollbar">
              {rejectedWorkflows.length === 0 ? (
                <div className="text-center py-6 px-4">
                  <p className="text-gray-500 text-xs">No rejected proposals.</p>
                </div>
              ) : (
                <div className="p-3 space-y-3">
                  {rejectedWorkflows.map(workflow => (
                    <div key={workflow.id} className="bg-black/20 p-4 rounded-xl border border-white/5 border-l-2 border-l-red-500/50 space-y-3">
                      <div>
                        <span className="font-bold text-gray-300 text-sm block mb-1">{workflow.title}</span>
                        <div className="text-[10px] text-gray-600 mb-2">{new Date(workflow.created_at).toLocaleDateString()}</div>
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={() => handleEditClick(workflow)} variant="outline" className="flex-1 text-[10px] py-1.5 h-auto border-white/10 hover:bg-white/5">Edit & Resubmit</Button>
                        <Button onClick={(e) => handleDeleteClick(workflow.id, e)} variant="danger" className="text-[10px] py-1.5 h-auto px-2">✕</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Review Modal for Pending & Rejected (Mobile & Desktop) */}
      <AnimatePresence>
        {showMobilePending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={() => setShowMobilePending(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#0a0a0a] w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl border border-white/10 shadow-2xl max-h-[85vh] flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#0a0a0a] z-10 rounded-t-2xl">
                <h2 className="text-xl font-bold text-white">Proposals & Actions</h2>
                <button
                  onClick={() => setShowMobilePending(false)}
                  className="p-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 space-y-6 overflow-y-auto">
                {/* Mobile Pending */}
                <div>
                  <h3 className="text-sm font-bold text-yellow-500 mb-3 uppercase tracking-wider">Pending Approval ({proposedWorkflows.length})</h3>
                  {proposedWorkflows.length === 0 ? <p className="text-gray-600 text-sm italic">None</p> : (
                    <div className="space-y-3">
                      {proposedWorkflows.map(wf => (
                        <div key={wf.id} className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3">
                          <div>
                            <span className="font-bold text-white text-lg block mb-1">{wf.title}</span>
                            <p className="text-sm text-gray-400 line-clamp-2">{wf.description}</p>
                          </div>

                          <Link
                            to={`/workflow/${wf.id}`}
                            onClick={() => setShowMobilePending(false)}
                            className="flex items-center justify-center gap-2 w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition-colors border border-white/5"
                          >
                            <Icons.Eye className="w-5 h-5" />
                            Review Details
                          </Link>

                          {isHost && (
                            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
                              <Button onClick={() => updateWorkflowStatus(wf.id, 'approved')} variant="success" className="text-sm py-3 font-bold shadow-lg shadow-emerald-900/20">Approve</Button>
                              <Button onClick={() => updateWorkflowStatus(wf.id, 'rejected')} variant="danger" className="text-sm py-3 font-bold shadow-lg shadow-red-900/20">Reject</Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mobile Rejected */}
                <div>
                  <h3 className="text-sm font-bold text-red-500 mb-3 uppercase tracking-wider">Rejected ({rejectedWorkflows.length})</h3>
                  {rejectedWorkflows.length === 0 ? <p className="text-gray-600 text-sm italic">None</p> : (
                    <div className="space-y-3">
                      {rejectedWorkflows.map(wf => (
                        <div key={wf.id} className="bg-red-500/5 p-4 rounded-xl border border-red-500/20">
                          <div className="flex justify-between mb-2">
                            <span className="font-bold text-gray-300">{wf.title}</span>
                            <span className="text-xs text-red-400">Rejected</span>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button onClick={() => { setShowMobilePending(false); handleEditClick(wf); }} variant="outline" className="flex-1 text-xs py-2">Edit & Resubmit</Button>
                            <Button onClick={(e) => handleDeleteClick(wf.id, e)} variant="danger" className="text-xs py-2 px-3">✕</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={handleCancelDelete} title="⚠️ Confirm Deletion">
        <div className="space-y-4">
          <div className="bg-red-500/10 border-l-4 border-red-500 rounded-r-lg p-4">
            <p className="text-white font-semibold mb-2">
              Are you sure you want to delete this workflow?
            </p>
            <p className="text-sm text-gray-300">
              ⚠️ All associated tasks will be permanently removed. This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button onClick={handleCancelDelete} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} variant="danger" className="font-bold">
              🗑️ Delete Forever
            </Button>
          </div>
        </div>
      </Modal>
    </PageTransition >
  )
}
