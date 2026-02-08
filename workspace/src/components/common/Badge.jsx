export function Badge({ status, type = 'workflow' }) {
    const workflowStyles = {
        proposed: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        approved: 'bg-green-100 text-green-800 border-green-200',
        active: 'bg-blue-100 text-blue-800 border-blue-200',
        completed: 'bg-gray-100 text-gray-800 border-gray-200',
        rejected: 'bg-red-100 text-red-800 border-red-200'
    }

    const taskStyles = {
        todo: 'bg-gray-100 text-gray-800 border-gray-200',
        doing: 'bg-blue-100 text-blue-800 border-blue-200',
        done: 'bg-green-100 text-green-800 border-green-200',
        pending_approval: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        maintenance: 'bg-orange-100 text-orange-800 border-orange-200'
    }

    const workflowLabels = {
        proposed: 'Proposto',
        approved: 'Approvato',
        active: 'Attivo',
        completed: 'Completato',
        rejected: 'Rifiutato'
    }

    const taskLabels = {
        todo: 'To Do',
        doing: 'Doing',
        done: 'Done',
        pending_approval: 'In Attesa',
        maintenance: 'Manutenzione'
    }

    const styles = type === 'workflow' ? workflowStyles : taskStyles
    const labels = type === 'workflow' ? workflowLabels : taskLabels
    const label = labels[status] || status.toUpperCase()

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.todo}`}>
            {label}
        </span>
    )
}
