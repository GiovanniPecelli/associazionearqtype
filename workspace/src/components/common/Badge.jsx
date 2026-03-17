export function Badge({ status, type = 'workflow' }) {
    const workflowStyles = {
        proposed: 'bg-amber-100 text-amber-900 border-amber-200',
        approved: 'bg-emerald-100 text-emerald-900 border-emerald-200',
        active: 'bg-[#1a2b4b]/10 text-[#1a2b4b] border-[#1a2b4b]/20',
        completed: 'bg-slate-100 text-slate-700 border-slate-200',
        rejected: 'bg-rose-100 text-rose-900 border-rose-200'
    }

    const taskStyles = {
        todo: 'bg-slate-100 text-slate-700 border-slate-200',
        doing: 'bg-[#1a2b4b]/10 text-[#1a2b4b] border-[#1a2b4b]/20',
        done: 'bg-emerald-100 text-emerald-900 border-emerald-200',
        pending_approval: 'bg-amber-100 text-amber-900 border-amber-200',
        maintenance: 'bg-[#c0672a]/10 text-[#c0672a] border-[#c0672a]/20'
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
