import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../contexts/ToastContext';
import Button from '../common/Button.jsx';
import { Modal } from '../common/Modal';
import PageTransition from '../common/PageTransition';

export function CategoryManagement() {
    const { user, isHost } = useAuth();
    const { showToast } = useToast();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        color: '#3B82F6'
    });
    const [workflowCounts, setWorkflowCounts] = useState({});

    useEffect(() => {
        if (isHost) {
            fetchCategories();
        }
    }, [isHost]);

    async function fetchCategories() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('workflow_categories')
                .select('*')
                .order('name');

            if (error) throw error;
            setCategories(data || []);

            // Fetch workflow counts for each category
            const { data: workflows, error: workflowError } = await supabase
                .from('workflows')
                .select('category_id');

            if (workflowError) throw workflowError;

            const counts = {};
            workflows.forEach(wf => {
                counts[wf.category_id] = (counts[wf.category_id] || 0) + 1;
            });
            setWorkflowCounts(counts);
        } catch (error) {
            console.error('Error fetching categories:', error);
            showToast('Error loading categories: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                // Update existing category
                const { error } = await supabase
                    .from('workflow_categories')
                    .update({
                        name: formData.name,
                        description: formData.description,
                        color: formData.color
                    })
                    .eq('id', editingCategory.id);

                if (error) throw error;
                showToast('Category updated successfully', 'success');
            } else {
                // Create new category
                const { error } = await supabase
                    .from('workflow_categories')
                    .insert([{
                        name: formData.name,
                        description: formData.description,
                        color: formData.color,
                        created_by: user.id
                    }]);

                if (error) throw error;
                showToast('Category created successfully', 'success');
            }

            // Reset form and refresh
            setFormData({ name: '', description: '', color: '#3B82F6' });
            setEditingCategory(null);
            setShowForm(false);
            fetchCategories();
        } catch (error) {
            showToast('Error saving category: ' + error.message, 'error');
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || '',
            color: category.color
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        try {
            const { count, error: checkError } = await supabase
                .from('workflows')
                .select('*', { count: 'exact', head: true })
                .eq('category_id', id);

            if (checkError) throw checkError;

            if (count > 0) {
                showToast(`Cannot delete this category because it has ${count} workflow(s) assigned. Please reassign or delete those workflows first.`, 'warning');
                return;
            }

            if (!confirm('Are you sure you want to delete this category?')) {
                return;
            }

            const { error } = await supabase
                .from('workflow_categories')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchCategories();
            showToast('Category deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting category:', error);
            showToast('Error deleting category: ' + error.message, 'error');
        }
    };

    const handleCancel = () => {
        setFormData({ name: '', description: '', color: '#3B82F6' });
        setEditingCategory(null);
        setShowForm(false);
    };

    if (!isHost) {
        return (
            <PageTransition className="p-8 text-center">
                <p className="text-gray-600">Only hosts can manage workflow categories.</p>
            </PageTransition>
        );
    }

    return (
        <PageTransition className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Workflow Categories</h1>
                <Button onClick={() => setShowForm(true)} variant="primary">
                    + Add Category
                </Button>
            </div>

            {loading && <p className="text-white">Loading categories...</p>}

            {!loading && categories.length === 0 && (
                <div className="text-center py-12 bg-gray-900/60 backdrop-blur-xl rounded-lg shadow-lg border border-white/10">
                    <h3 className="text-xl font-medium text-white">No categories yet</h3>
                    <p className="text-gray-400 mt-2">Create your first category to organize workflows.</p>
                </div>
            )}

            {!loading && categories.length > 0 && (
                <div className="bg-gray-900/60 backdrop-blur-xl rounded-lg shadow-lg overflow-hidden border border-white/10">
                    <table className="min-w-full divide-y divide-white/10">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Color
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Workflows
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-transparent divide-y divide-white/10">
                            {categories.map((category) => (
                                <tr key={category.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div
                                            className="w-8 h-8 rounded-full border-2 border-white/20"
                                            style={{ backgroundColor: category.color }}
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-white">{category.name}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-400">{category.description || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900/50 text-blue-200 border border-blue-800">
                                            {workflowCounts[category.id] || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Button
                                            onClick={() => handleEdit(category)}
                                            variant="outline"
                                            className="mr-2"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() => handleDelete(category.id)}
                                            variant="danger"
                                            disabled={workflowCounts[category.id] > 0}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Category Form Modal */}
            <Modal
                isOpen={showForm}
                onClose={handleCancel}
                title={editingCategory ? 'Edit Category' : 'Add Category'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-white placeholder-gray-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-white placeholder-gray-500"
                            rows="3"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Color
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={formData.color}
                                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                className="h-10 w-20 border border-white/10 rounded cursor-pointer bg-transparent"
                            />
                            <span className="text-sm text-gray-400">{formData.color}</span>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" onClick={handleCancel} variant="outline">
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            {editingCategory ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </PageTransition>
    );
}
