import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Modal } from '../common/Modal'
import { DatePicker } from '../common/DatePicker'
import { useAuth } from '../../hooks/useAuth.jsx'
import Button from '../common/Button.jsx'

export function TaskDetail({ task, isOpen, onClose, onUpdate }) {
    const { user, isHost, isArchitect } = useAuth();
    const [formData, setFormData] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // Update form data when task changes
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                data_consegna: task.data_consegna || null,
                commenti_operativi: task.commenti_operativi || '',
                output_risultato: task.output_risultato || '',
                status: task.status || 'todo'
            });
        }
    }, [task]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const { error } = await supabase
                .from('tasks')
                .update({
                    title: formData.title,
                    description: formData.description,
                    data_consegna: formData.data_consegna,
                    commenti_operativi: formData.commenti_operativi,
                    output_risultato: formData.output_risultato,
                    status: formData.status
                })
                .eq('id', task.id);

            if (error) throw error;

            onUpdate();
            onClose();
        } catch (error) {
            alert('Error updating task: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            const { error } = await supabase
                .from('tasks')
                .update({ status: newStatus })
                .eq('id', task.id);

            if (error) throw error;
            setFormData({ ...formData, status: newStatus });
            onUpdate();
        } catch (error) {
            alert('Error updating status: ' + error.message);
        }
    };

    const handleApprove = async () => {
        await handleStatusChange('todo');
        onClose();
    };

    if (!task) return null;

    const isPendingApproval = task.status === 'pending_approval';
    const canEdit = isHost || (isArchitect && !isPendingApproval) || (user && task.assigned_to === user.id && !isPendingApproval);
    const isOverdue = task.data_consegna && new Date(task.data_consegna) < new Date() && task.status !== 'done';

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Dettagli Task" size="large">
            <form onSubmit={handleSubmit} className="space-y-6">

                {isPendingApproval && (
                    <div className="p-4 mb-4 text-yellow-800 bg-yellow-100 border-l-4 border-yellow-500">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-bold">In attesa di approvazione</p>
                                <p>Questa task deve essere approvata da un Host prima di poter essere lavorata.</p>
                            </div>
                            {isHost && (
                                <Button
                                    type="button"
                                    onClick={handleApprove}
                                    variant="success"
                                >
                                    Approva Task
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {/* Status Badges */}
                {!isPendingApproval && (
                    <div className="flex items-center gap-3 pb-4 border-b">
                        <Button
                            type="button"
                            onClick={() => handleStatusChange('todo')}
                            disabled={!canEdit}
                            variant={formData.status === 'todo' ? 'secondary' : 'outline'}
                            className={formData.status === 'todo' ? 'border-2 border-gray-400' : ''}
                        >
                            To Do
                        </Button>
                        <Button
                            type="button"
                            onClick={() => handleStatusChange('doing')}
                            disabled={!canEdit}
                            variant={formData.status === 'doing' ? 'secondary' : 'outline'}
                            className={formData.status === 'doing' ? 'border-2 border-blue-400' : ''}
                        >
                            Doing
                        </Button>
                        <Button
                            type="button"
                            onClick={() => handleStatusChange('done')}
                            disabled={!canEdit}
                            variant={formData.status === 'done' ? 'secondary' : 'outline'}
                            className={formData.status === 'done' ? 'border-2 border-green-400' : ''}
                        >
                            Done
                        </Button>

                        {isOverdue && (
                            <span className="ml-auto px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                                ⚠️ Scaduto
                            </span>
                        )}
                    </div>
                )}

                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Titolo <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                        required
                        disabled={!canEdit}
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descrizione
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                        rows="3"
                        disabled={!canEdit}
                    />
                </div>

                {/* Assigned To */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">Assegnato a</p>
                    <p className="text-gray-900">
                        {task.assigned_to_profile?.email || 'Non assegnato'}
                    </p>
                </div>

                {/* Data Consegna (Due Date) */}
                <DatePicker
                    label="Data Consegna"
                    value={formData.data_consegna}
                    onChange={(date) => setFormData({ ...formData, data_consegna: date })}
                    disabled={!canEdit}
                />

                {/* Commenti Operativi */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Commenti Operativi
                    </label>
                    <p className="text-xs text-gray-500 mb-2">Note brevi e link utili durante il lavoro</p>
                    <textarea
                        value={formData.commenti_operativi}
                        onChange={(e) => setFormData({ ...formData, commenti_operativi: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                        rows="4"
                        placeholder="Es: Link a documenti, note operative, riferimenti..."
                        disabled={!canEdit}
                    />
                </div>

                {/* Output/Risultato */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Output / Risultato
                    </label>
                    <p className="text-xs text-gray-500 mb-2">Link o file dell'output finale</p>
                    <textarea
                        value={formData.output_risultato}
                        onChange={(e) => setFormData({ ...formData, output_risultato: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                        rows="3"
                        placeholder="Es: Link al deliverable, file caricati, risultati..."
                        disabled={!canEdit}
                    />
                </div>

                {/* Metadata */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                    <p className="text-gray-600">
                        <span className="font-medium">Creato:</span> {new Date(task.created_at).toLocaleString('it-IT')}
                    </p>
                    {task.workflow_id && (
                        <p className="text-gray-600">
                            <span className="font-medium">Workflow:</span> {task.workflow_id}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                        type="button"
                        onClick={onClose}
                        variant="outline"
                    >
                        Annulla
                    </Button>
                    {canEdit && (
                        <Button
                            type="submit"
                            disabled={saving}
                            variant="primary"
                        >
                            {saving ? 'Salvataggio...' : 'Salva Modifiche'}
                        </Button>
                    )}
                </div>
            </form>
        </Modal>
    )
}