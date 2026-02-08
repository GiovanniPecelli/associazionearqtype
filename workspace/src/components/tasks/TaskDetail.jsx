import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Modal } from '../common/Modal';
import { DatePicker } from '../common/DatePicker';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useCompetencies } from '../../hooks/useCompetencies';
import { CompetencyBadge } from '../competencies/CompetencyBadge';
import Button from '../common/Button.jsx';
import { WorkflowAttachments } from '../workflows/WorkflowAttachments';
import { Icons } from '../common/Icons';
import { useToast } from '../../contexts/ToastContext';

export function TaskDetail({ task, isOpen, onClose, onUpdate }) {
    const { user, isHost, isArchitect } = useAuth();
    const { allCompetencies, checkTaskAccess } = useCompetencies();
    const { showToast } = useToast();
    const [formData, setFormData] = useState({});
    const [saving, setSaving] = useState(false);
    const [taskAccess, setTaskAccess] = useState({ hasAccess: true, missingCompetencies: [] });
    const [requiredCompetencies, setRequiredCompetencies] = useState([]);
    const [workflowCreator, setWorkflowCreator] = useState(null);
    // State for Rejection Modal
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    // State for Confirm Modal (generic)
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: () => { } });
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                data_consegna: task.data_consegna || null,
                commenti_operativi: task.commenti_operativi || '',
                output_risultato: task.output_risultato || '',
                status: task.status || 'todo',
                difficulty: task.difficulty || 'Simple',
                is_tutorial: task.is_tutorial || false,
                required_competencies: task.required_competencies || [],
                assigned_to: task.assigned_to || null,
                assigned_at: task.assigned_at || null,
                revision_feedback: task.revision_feedback || null
            });

            // Load required competencies details
            if (task.required_competencies && task.required_competencies.length > 0) {
                const reqComps = allCompetencies.filter(c => task.required_competencies.includes(c.id));
                setRequiredCompetencies(reqComps);
            } else {
                setRequiredCompetencies([]);
            }

            // Check task access
            if (user) {
                checkTaskAccess(task, user.id).then(access => setTaskAccess(access));
            }

            // Fetch workflow architect
            if (task.workflow_id) {
                fetchWorkflowArchitect(task.workflow_id);
            }
        }
    }, [task, allCompetencies, user]);

    async function fetchWorkflowArchitect(workflowId) {
        try {
            const { data, error } = await supabase
                .from('workflows')
                .select('created_by')
                .eq('id', workflowId)
                .single();

            if (error) throw error;
            setWorkflowCreator(data?.created_by);
        } catch (error) {
            console.error('Error fetching workflow creator:', error);
        }
    }

    const calculateRewards = (diff, isTutorial = false) => {
        let baseRewards;
        switch (diff) {
            case 'Simple': baseRewards = { xp: 100, vp: 50 }; break;
            case 'Medium': baseRewards = { xp: 250, vp: 100 }; break;
            case 'Hard': baseRewards = { xp: 500, vp: 200 }; break;
            default: baseRewards = { xp: 0, vp: 0 };
        }

        // Tutorial tasks give 50% rewards
        if (isTutorial) {
            return {
                xp: Math.floor(baseRewards.xp * 0.5),
                vp: Math.floor(baseRewards.vp * 0.5)
            };
        }

        return baseRewards;
    };

    const rewards = calculateRewards(formData.difficulty, formData.is_tutorial);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Prepare update object
            let updates = {
                title: formData.title,
                description: formData.description,
                data_consegna: formData.data_consegna,
                commenti_operativi: formData.commenti_operativi,
                output_risultato: formData.output_risultato,
                status: formData.status,
                difficulty: formData.difficulty,
                is_tutorial: formData.is_tutorial,
                required_competencies: formData.required_competencies,
                assigned_to: formData.assigned_to,
                assigned_at: formData.assigned_at,
                revision_feedback: formData.revision_feedback
            };

            // AUTO-ASSIGNMENT & START DATE Logic
            if (formData.status === 'doing' && task.status === 'todo') {
                if (!task.assigned_to) {
                    updates.assigned_to = user.id;
                    updates.assigned_at = new Date().toISOString();
                }
            }

            const executeUpdate = async (finalUpdates) => {
                try {
                    const { error } = await supabase.from('tasks').update(finalUpdates).eq('id', task.id);
                    if (error) throw error;
                    onUpdate();
                    onClose();
                } catch (error) {
                    showToast('Error updating task: ' + error.message, 'error');
                } finally {
                    setSaving(false);
                }
            };

            // Validation Logic (Done -> Save -> Confirm)
            // Validation Logic (Done -> Save -> Confirm)
            if ((formData.status === 'done' || formData.status === 'awaiting_validation') &&
                task.status !== 'done' &&
                task.status !== 'awaiting_validation') {

                // REQUIREMENT CHECK: Repo OR Detailed Text
                const hasRepo = formData.output_risultato && formData.output_risultato.trim().length > 0;
                const hasDetailedText = formData.commenti_operativi && formData.commenti_operativi.trim().length >= 150;

                if (!hasRepo && !hasDetailedText) {
                    showToast('To complete this task, you MUST provide either a Public Repository Link OR a detailed Project Description (min 150 chars).', 'error');
                    setSaving(false);
                    return;
                }

                setConfirmModal({
                    isOpen: true,
                    title: 'Submit for Validation',
                    message: 'Are you sure you want to submit this task for validation? It will be reviewed by the Coordinator.',
                    onConfirm: () => {
                        updates.status = 'awaiting_validation';
                        updates.revision_feedback = null;
                        executeUpdate(updates);
                    }
                });
                setSaving(false);
                return;
            }

            await executeUpdate(updates);
        } catch (error) {
            showToast('Error preparing update: ' + error.message, 'error');
            setSaving(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        // VALIDATION: Prevent moving to 'awaiting_validation' or 'done' if requirements not met
        // Now applies to EVERYONE (including Hosts)
        if (newStatus === 'done' || newStatus === 'awaiting_validation') {
            const hasRepo = formData.output_risultato && formData.output_risultato.trim().length > 0;
            const hasDetailedText = formData.commenti_operativi && formData.commenti_operativi.trim().length >= 150;

            if (!hasRepo && !hasDetailedText) {
                showToast('To complete this task, you MUST provide either a Public Repository Link OR a detailed Project Description (min 150 chars).', 'error');
                return; // Abort status change, keeping buttons visible
            }
        }

        // Auto-Assignment Logic: When moving to 'doing', assign to current user if unassigned
        if (newStatus === 'doing' && !formData.assigned_to) {
            const now = new Date().toISOString();
            setFormData({
                ...formData,
                status: newStatus,
                assigned_to: user.id,
                assigned_at: now
            });
        } else {
            setFormData({ ...formData, status: newStatus });
        }
    };

    const handleApproveValidation = async () => {
        try {
            const { error } = await supabase
                .from('tasks')
                .update({ status: 'done', revision_feedback: null })
                .eq('id', task.id);

            if (error) throw error;
            await checkWorkflowCompletion(task.workflow_id);
            onUpdate();
            onClose();
        } catch (error) {
            showToast('Error approving task: ' + error.message, 'error');
        }
    };

    const openRejectModal = () => {
        setRejectionReason('');
        setIsRejectModalOpen(true);
    };

    const handleRejectSubmit = async () => {
        if (!rejectionReason.trim()) {
            showToast('Please enter a reason for the rejection.', 'warning');
            return;
        }

        try {
            const { error } = await supabase
                .from('tasks')
                .update({
                    status: 'doing',
                    revision_feedback: rejectionReason
                })
                .eq('id', task.id);

            if (error) throw error;
            setFormData({ ...formData, status: 'doing' });
            onUpdate();
            setIsRejectModalOpen(false);
            onClose();
        } catch (error) {
            showToast('Error rejecting task: ' + error.message, 'error');
        }
    };

    const checkWorkflowCompletion = async (workflowId) => {
        try {
            const { data: tasks, error: tasksError } = await supabase
                .from('tasks')
                .select('status')
                .eq('workflow_id', workflowId);

            if (tasksError) throw tasksError;
            if (!tasks || tasks.length === 0) return;

            const allDone = tasks.every(t => t.status === 'done');
            const { data: workflow, error: workflowError } = await supabase
                .from('workflows')
                .select('status')
                .eq('id', workflowId)
                .single();

            if (workflowError) throw workflowError;

            if (allDone && workflow.status !== 'completed') {
                await supabase.from('workflows').update({ status: 'completed' }).eq('id', workflowId);
            } else if (!allDone && workflow.status === 'completed') {
                await supabase.from('workflows').update({ status: 'active' }).eq('id', workflowId);
            }
        } catch (error) {
            console.error('Error checking workflow completion:', error);
        }
    };

    const handleApprove = async () => {
        // This function seems to be unused or needs re-evaluation based on new flow
        // For now, it's kept as is, but might be removed if not needed.
        await handleStatusChange('todo');
        onClose();
    };

    const handleApprovePendingTask = async () => {
        try {
            const { error } = await supabase
                .from('tasks')
                .update({ status: 'todo' })
                .eq('id', task.id);

            if (error) throw error;
            onUpdate();
            onClose();
        } catch (error) {
            showToast('Error approving task: ' + error.message, 'error');
        }
    };

    const handleRejectPendingTask = async () => {
        setConfirmModal({
            isOpen: true,
            title: 'Reject Task',
            message: 'Reject this task? It will be permanently removed.',
            onConfirm: async () => {
                try {
                    const { error } = await supabase
                        .from('tasks')
                        .delete()
                        .eq('id', task.id);

                    if (error) throw error;
                    onUpdate();
                    onClose();
                } catch (error) {
                    showToast('Error rejecting task: ' + error.message, 'error');
                }
            }
        });
    };

    const handlePutInMaintenance = async () => {
        setConfirmModal({
            isOpen: true,
            title: 'Maintenance Mode',
            message: 'Put this task in maintenance? It will require Host approval to reactivate.',
            onConfirm: async () => {
                try {
                    await supabase.from('tasks').update({ status: 'maintenance' }).eq('id', task.id);
                    onUpdate();
                    onClose();
                } catch (err) { showToast(err.message, 'error'); }
            }
        });
    };

    const handleApproveMaintenance = async () => {
        setConfirmModal({
            isOpen: true,
            title: 'Reactivate Task',
            message: 'Approve maintenance resolution and reactivate task?',
            onConfirm: async () => {
                try {
                    // Check if task has an owner
                    const { data: freshTask, error: fetchError } = await supabase
                        .from('tasks')
                        .select('assigned_to')
                        .eq('id', task.id)
                        .single();

                    if (fetchError) throw fetchError;

                    // If assigned, return to 'doing', otherwise 'todo'
                    const targetStatus = freshTask.assigned_to ? 'doing' : 'todo';

                    await supabase.from('tasks').update({ status: targetStatus }).eq('id', task.id);
                    onUpdate();
                    onClose();
                } catch (err) { showToast(err.message, 'error'); }
            }
        });
    };

    // Helper for rendering badges
    const StatusBadge = () => {
        if (formData.status === 'awaiting_validation') return <span className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/30 animate-pulse">⏳ Awaiting Validation</span>;
        if (formData.status === 'done') return <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30">✅ Done</span>;
        if (formData.status === 'doing' && task.revision_feedback) return <span className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-xs font-bold border border-red-500/30">⚠️ Changes Requested</span>;
        return <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/30 capitalize">{formData.status}</span>;
    };

    if (!task) return null;

    const isPendingApproval = task.status === 'pending_approval';
    const isInMaintenance = task.status === 'maintenance';
    const canEdit = isHost || (user && task.assigned_to === user.id && !isPendingApproval && !isInMaintenance) || (!task.assigned_to && !isPendingApproval && !isInMaintenance); // Hosts can always edit (even in maintenance), others can only edit if assigned and not in special states
    const canPutInMaintenance = (isHost || isArchitect) && !isPendingApproval && !isInMaintenance;
    const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done';

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title="Task Detail" size="large">
                <form onSubmit={handleSubmit} className="flex flex-col h-full">

                    {/* 1. Header: Status & Quick Info */}
                    <div className="flex flex-wrap justify-between items-center gap-4 mb-6 pb-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <StatusBadge />
                            <div className={`px-3 py-1 rounded-lg text-xs font-bold border uppercase tracking-wider ${task.difficulty === 'Hard' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                task.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                    'bg-green-500/10 text-green-400 border-green-500/20'
                                }`}>
                                {task.difficulty}
                            </div>
                        </div>
                        <div className="flex gap-4 text-sm font-mono">
                            <span className="text-yellow-400">+{rewards.vp} VP</span>
                            <span className="text-purple-400">+{rewards.xp} XP</span>
                        </div>
                    </div>

                    {/* Required Competencies Warning */}
                    {!taskAccess.hasAccess && taskAccess.missingCompetencies.length > 0 && (
                        <div className="p-4 mb-4 text-orange-200 bg-orange-500/10 border-l-4 border-orange-500/50 rounded">
                            <p className="font-bold"><Icons.Exclamation className="w-5 h-5 inline mr-2 text-orange-500" /> Missing Required Competencies</p>
                            <p className="text-sm mt-1">This task requires the following competencies you do not have yet:</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {taskAccess.missingCompetencies.map(comp => (
                                    <CompetencyBadge key={comp.id} competency={comp} acquired={false} size="sm" />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Validation Pending Alert */}
                    {formData.status === 'awaiting_validation' && (
                        <div className="bg-amber-500/10 border-l-4 border-amber-500 p-4 rounded-r-lg animate-pulse mb-4">
                            <div className="flex justify-between items-center flex-wrap gap-4">
                                <div>
                                    <p className="font-bold text-amber-400"><Icons.Lightning className="w-5 h-5 inline mr-2" /> Awaiting Coordinator Validation</p>
                                    <p className="text-sm text-amber-200/80">This task needs to be validated before being marked as complete.</p>
                                </div>
                                {(workflowCreator === user?.id || isHost) && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-500/30 font-semibold">VALIDATOR</span>
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant="custom"
                                                onClick={handleApproveValidation}
                                                className="bg-green-600 hover:bg-green-500 text-white border-none py-1 px-3 text-xs"
                                            >
                                                ✓ Approve
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="custom"
                                                onClick={openRejectModal}
                                                className="bg-red-600/80 hover:bg-red-500 hover:text-white text-red-100 border-none py-1 px-3 text-xs"
                                            >
                                                <Icons.Close className="w-4 h-4 mr-1" /> Request Changes
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Pending Approval Alert - NEW WORKFLOW TASK */}
                    {isPendingApproval && (
                        <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 rounded-r-lg mb-4">
                            <div className="flex justify-between items-center flex-wrap gap-4">
                                <div>
                                    <p className="font-bold text-yellow-400">
                                        <Icons.Calendar className="w-5 h-5 inline mr-2" />
                                        Pending Task Approval
                                    </p>
                                    <p className="text-sm text-yellow-200/80">
                                        This task needs approval before being added to the todo list.
                                    </p>
                                </div>
                                {(workflowCreator === user?.id || isHost) && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-500/30 font-semibold">
                                            APPROVER
                                        </span>
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant="custom"
                                                onClick={handleApprovePendingTask}
                                                className="bg-green-600 hover:bg-green-500 text-white border-none py-1 px-3 text-xs"
                                            >
                                                ✓ Approve Task
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="custom"
                                                onClick={handleRejectPendingTask}
                                                className="bg-red-600/80 hover:bg-red-500 hover:text-white text-red-100 border-none py-1 px-3 text-xs"
                                            >
                                                <Icons.Close className="w-4 h-4 mr-1" /> Reject
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Maintenance Alert */}
                    {isInMaintenance && (
                        <div className="bg-orange-500/10 border-l-4 border-orange-500 p-4 rounded-r-lg mb-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-orange-400"><Icons.Wrench className="w-5 h-5 inline mr-2" /> In Maintenance</p>
                                    <p className="text-sm text-orange-200/80">Task is suspended.</p>
                                </div>
                                {(isHost || isArchitect) && (
                                    <Button
                                        type="button"
                                        variant="custom"
                                        onClick={handleApproveMaintenance}
                                        className="bg-orange-500 hover:bg-orange-600 text-white border-none py-1 px-3 text-xs"
                                    >
                                        Reactivate
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Main 2-Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow overflow-y-auto pr-2 -mr-2">

                        {/* LEFT COLUMN: Content (2/3) */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Title & Description */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Task Title</label>
                                <input
                                    type="text"
                                    value={formData.title || ''}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    disabled={!canEdit}
                                    className="w-full bg-transparent text-xl font-bold text-white border-none p-0 focus:ring-0"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description</label>
                                {canEdit ? (
                                    <textarea
                                        value={formData.description || ''}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all min-h-[120px] text-sm"
                                    />
                                ) : (
                                    <div className="bg-black/20 rounded-xl p-4 text-gray-300 leading-relaxed whitespace-pre-wrap border border-white/5 min-h-[100px]">
                                        {task.description}
                                    </div>
                                )}
                            </div>

                            {/* Workflow Attachments */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Attachments</label>
                                <WorkflowAttachments workflowId={task.workflow_id} />
                            </div>

                            {/* Operational Area */}
                            {/* Project Submission Section */}
                            <div className="pt-6 border-t border-white/10">
                                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                    <span className="bg-blue-500/20 text-blue-400 p-1.5 rounded-lg border border-blue-500/30">
                                        <Icons.Rocket className="w-5 h-5" />
                                    </span>
                                    Project Submission
                                </h3>

                                <div className="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-xl border border-blue-500/30 p-5 space-y-5 shadow-lg">
                                    <div className="text-xs text-blue-300 bg-blue-500/10 px-3 py-2 rounded-lg border border-blue-500/20 mb-2">
                                        ℹ️ <strong>Requirement:</strong> Provide a public GitHub Repository Link <u>OR</u> a detailed description (strictly for non-code/theoretical tasks).
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2">
                                            <Icons.Link className="w-4 h-4 text-blue-400" />
                                            Repository Link (Public)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.output_risultato || ''}
                                            onChange={(e) => setFormData({ ...formData, output_risultato: e.target.value })}
                                            disabled={!canEdit}
                                            placeholder="https://github.com/username/repo"
                                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm font-mono text-blue-300"
                                        />
                                    </div>

                                    <div className="relative">
                                        <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex items-center justify-center pointer-events-none">
                                            <span className="bg-gray-900 px-2 text-xs text-gray-500 uppercase font-bold tracking-widest">OR</span>
                                        </div>
                                        <div className="border-t border-white/5 w-full"></div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2">
                                            <Icons.FileText className="w-4 h-4 text-purple-400" />
                                            Project Description / Notes
                                        </label>
                                        <textarea
                                            value={formData.commenti_operativi || ''}
                                            onChange={(e) => setFormData({ ...formData, commenti_operativi: e.target.value })}
                                            disabled={!canEdit}
                                            placeholder="Describe your work, implementation details, or provide other delivery notes (min 150 characters)... Use this field ONLY for theoretical or non-code tasks."
                                            className={`w-full px-4 py-3 bg-black/40 border rounded-xl text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all min-h-[120px] text-sm ${formData.commenti_operativi && formData.commenti_operativi.length < 150
                                                ? 'border-red-500/30 focus:border-red-500'
                                                : 'border-white/10'
                                                }`}
                                        />
                                        <div className="flex justify-end mt-1">
                                            <span className={`text-[10px] ${(formData.commenti_operativi?.length || 0) >= 150 ? 'text-green-400' : 'text-gray-500'
                                                }`}>
                                                {formData.commenti_operativi?.length || 0} / 150 chars
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Revision Feedback Section */}
                            {task.revision_feedback && (
                                <div className="pt-6 border-t border-white/10">
                                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                        <Icons.Chat className="w-5 h-5 text-orange-400" /> Validator Feedback
                                    </h3>
                                    <div className="bg-orange-500/10 border-l-4 border-orange-500 rounded-r-xl p-4">
                                        <label className="block text-xs font-medium text-orange-300 mb-2">Changes Requested</label>
                                        {(isHost || workflowCreator === user?.id) ? (
                                            <textarea
                                                value={formData.revision_feedback || ''}
                                                onChange={(e) => setFormData({ ...formData, revision_feedback: e.target.value })}
                                                placeholder="Provide clear, constructive feedback..."
                                                className="w-full px-4 py-3 bg-black/30 border border-orange-500/30 rounded-xl text-white placeholder-orange-300/50 focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all h-32 text-sm"
                                            />
                                        ) : (
                                            <div className="bg-black/30 rounded-xl p-4 text-orange-100 leading-relaxed whitespace-pre-wrap border border-orange-500/20 min-h-[80px]">
                                                {task.revision_feedback}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN: Metadata & Status (1/3) */}
                        <div className="space-y-6">

                            {/* Assignment Card */}
                            <div className="bg-gray-800/20 rounded-xl border border-white/10 p-4 space-y-4">
                                <h4 className="text-xs font-bold text-gray-500 uppercase">Assignment</h4>

                                {/* Assigned To */}
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary-600/20 flex items-center justify-center text-primary-400 border border-primary-500/30">
                                        {task.assigned_to_profile?.display_name?.charAt(0) || task.assigned_to_profile?.email?.charAt(0).toUpperCase() || '?'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">
                                            {task.assigned_to_profile?.display_name || task.assigned_to_profile?.email?.split('@')[0] || 'Unassigned'}
                                        </p>
                                        <p className="text-xs text-gray-500">Owner</p>
                                    </div>
                                </div>

                                {/* Dates */}
                                <div className="space-y-3 pt-2">
                                    <div>
                                        <p className="text-xs text-gray-500">Started On</p>
                                        <p className="text-sm font-mono text-gray-300">
                                            {formData.assigned_at ? new Date(formData.assigned_at).toLocaleDateString() : '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Due Date</p>
                                        <DatePicker
                                            selected={formData.data_consegna}
                                            onChange={(date) => setFormData({ ...formData, data_consegna: date })}
                                            disabled={!canEdit}
                                            minDate={new Date()}
                                            className="w-full text-sm p-1 bg-transparent border-b border-white/20 focus:border-primary-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Status Change Buttons (Vertical List) */}
                            {!isPendingApproval && !isInMaintenance && formData.status !== 'awaiting_validation' && (
                                <div className="bg-gray-800/50 rounded-xl border border-white/10 p-4 shadow-lg">
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">
                                        Quick Actions
                                    </label>
                                    <div className="flex flex-col gap-2.5">

                                        {/* PRIMARY WORKFLOW ACTIONS */}

                                        {/* Start Task - BLUE */}
                                        {formData.status === 'todo' && canEdit && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => handleStatusChange('doing')}
                                                className="w-full justify-center py-3 bg-transparent hover:bg-blue-500/10 text-blue-400 font-semibold border-2 border-blue-500 rounded-full transition-all duration-200"
                                            >
                                                <span className="flex items-center justify-center gap-2">
                                                    <span><Icons.Rocket className="w-5 h-5" /></span>
                                                    <span>START TASK</span>
                                                </span>
                                            </Button>
                                        )}

                                        {/* Mark as Done - GREEN */}
                                        {formData.status === 'doing' && canEdit && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => handleStatusChange('awaiting_validation')}
                                                className="w-full justify-center py-3 bg-transparent hover:bg-green-500/10 text-green-400 font-semibold border-2 border-green-500 rounded-full transition-all duration-200"
                                            >
                                                <span className="flex items-center justify-center gap-2">
                                                    <span><Icons.Check className="w-5 h-5" /></span>
                                                    <span>MARK AS DONE</span>
                                                </span>
                                            </Button>
                                        )}

                                        {/* SECONDARY / MANAGEMENT ACTIONS */}

                                        {/* Leave Task - ORANGE */}
                                        {user && formData.assigned_to === user.id && formData.status !== 'todo' && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => {
                                                    setConfirmModal({
                                                        isOpen: true,
                                                        title: 'Leave Task',
                                                        message: 'Leave this task? It will return to the "Todo" pool and all progress will be reset.',
                                                        onConfirm: async () => {
                                                            try {
                                                                const { error } = await supabase
                                                                    .from('tasks')
                                                                    .update({
                                                                        assigned_to: null,
                                                                        status: 'todo',
                                                                        assigned_at: null,
                                                                        commenti_operativi: null,
                                                                        output_risultato: null,
                                                                        revision_feedback: null
                                                                    })
                                                                    .eq('id', task.id);
                                                                if (error) throw error;
                                                                onUpdate();
                                                                onClose();
                                                            } catch (err) { showToast(err.message, 'error'); }
                                                        }
                                                    });
                                                }}
                                                className="w-full justify-center py-3 bg-transparent hover:bg-orange-500/10 text-orange-400 font-semibold border-2 border-orange-500 rounded-full transition-all duration-200"
                                            >
                                                <span className="flex items-center justify-center gap-2">
                                                    <span><Icons.LogOut className="w-5 h-5" /></span>
                                                    <span>LEAVE TASK</span>
                                                </span>
                                            </Button>
                                        )}

                                        {/* RESOLVE MAINTENANCE - AMBER */}
                                        {isInMaintenance && (isHost || (user && (formData.assigned_to === user.id || task.assigned_to === user.id))) && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={async () => {
                                                    try {
                                                        // SERVER-SIDE CHECK: Fetch fresh data to be 100% sure of assignment
                                                        const { data: freshTask, error: fetchError } = await supabase
                                                            .from('tasks')
                                                            .select('assigned_to')
                                                            .eq('id', task.id)
                                                            .single();

                                                        if (fetchError) throw fetchError;

                                                        const targetStatus = freshTask.assigned_to ? 'doing' : 'todo';

                                                        const { error } = await supabase
                                                            .from('tasks')
                                                            .update({ status: targetStatus })
                                                            .eq('id', task.id);

                                                        if (error) throw error;
                                                        onUpdate();
                                                        onClose();
                                                    } catch (err) { showToast(err.message, 'error'); }
                                                }}
                                                className="w-full justify-center py-3 bg-transparent hover:bg-amber-500/10 text-amber-400 font-semibold border-2 border-amber-500 rounded-full transition-all duration-200"
                                            >
                                                <span className="flex items-center justify-center gap-2">
                                                    <span><Icons.Wrench className="w-5 h-5" /></span>
                                                    <span>RESOLVE ISSUE & RESUME</span>
                                                </span>
                                            </Button>
                                        )}

                                        {/* Report Issue - YELLOW */}
                                        {canPutInMaintenance && !isInMaintenance && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={handlePutInMaintenance}
                                                className="w-full justify-center py-3 bg-transparent hover:bg-yellow-500/10 text-yellow-400 font-semibold border-2 border-yellow-500 rounded-full transition-all duration-200"
                                            >
                                                <span className="flex items-center justify-center gap-2">
                                                    <span><Icons.Exclamation className="w-5 h-5" /></span>
                                                    <span>REPORT ISSUE</span>
                                                </span>
                                            </Button>
                                        )}

                                        {/* Host Force Release - RED */}
                                        {isHost && formData.assigned_to && (
                                            <div className="pt-2.5 mt-2.5 border-t border-red-500/20">
                                                <div className="mb-2 px-1">
                                                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                                        Host Only
                                                    </span>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    onClick={() => {
                                                        setConfirmModal({
                                                            isOpen: true,
                                                            title: 'Force Release',
                                                            message: "⚠️ ATTENZIONE (Host):\nStai per togliere forzatamente il task all'utente.\nIl task tornerà in 'To Do' e tutti i progressi saranno resettati.\n\nProcedere?",
                                                            onConfirm: async () => {
                                                                try {
                                                                    const { error } = await supabase
                                                                        .from('tasks')
                                                                        .update({
                                                                            assigned_to: null,
                                                                            status: 'todo',
                                                                            assigned_at: null,
                                                                            commenti_operativi: null,
                                                                            output_risultato: null,
                                                                            revision_feedback: null
                                                                        })
                                                                        .eq('id', task.id);
                                                                    if (error) throw error;
                                                                    onUpdate();
                                                                    onClose();
                                                                } catch (err) { showToast(err.message, 'error'); }
                                                            }
                                                        });
                                                    }}
                                                    className="w-full justify-center py-3 bg-transparent hover:bg-red-500/10 text-red-400 font-semibold border-2 border-red-500 rounded-full transition-all duration-200"
                                                >
                                                    <span className="flex items-center justify-center gap-2">
                                                        <span><Icons.Bomb className="w-5 h-5" /></span>
                                                        <span>FORCE RELEASE</span>
                                                    </span>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Confirm/Save Footer - Glassmorphic Fixed */}
                    <div className="mt-8 pt-4 border-t border-white/10 flex justify-end gap-3 sticky bottom-0 backdrop-blur-md bg-black/60 z-20 p-6 -mx-6 -mb-6 shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.5)]">
                        <Button type="button" variant="secondary" onClick={onClose} className="text-gray-400 hover:text-white hover:bg-white/5 font-bold">
                            Close
                        </Button>
                        {canEdit && (
                            <Button
                                type="submit"
                                disabled={saving}
                                variant="primary"
                                className="px-8"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        )}
                    </div>
                </form >
            </Modal>

            {/* Rejection Modal Reuse from before */}
            <Modal isOpen={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)} title="Request Changes from Collaborator" size="medium">
                <div className="space-y-4">
                    <p className="text-sm text-gray-300">
                        Please provide clear, constructive feedback. The task will be moved to <strong>'Doing'</strong>.
                    </p>
                    <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Feedback..."
                        className="w-full h-32 px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500/50"
                        autoFocus
                    />
                    <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                        <Button variant="ghost" onClick={() => setIsRejectModalOpen(false)}>Cancel</Button>
                        <Button variant="danger" onClick={handleRejectSubmit}>Submit Request</Button>
                    </div>
                </div>
            </Modal>
            {/* Generic Confirm Modal */}
            <Modal isOpen={confirmModal.isOpen} onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} title={confirmModal.title} size="small">
                <div className="space-y-4">
                    <p className="text-gray-300">{confirmModal.message}</p>
                    <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                        <Button variant="ghost" onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}>Cancel</Button>
                        <Button variant="danger" onClick={() => {
                            confirmModal.onConfirm();
                            setConfirmModal({ ...confirmModal, isOpen: false });
                        }}>Confirm</Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}