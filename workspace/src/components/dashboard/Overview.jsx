import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../contexts/ToastContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Icons } from '../common/Icons'

export function Overview() {
  const { user, isHost } = useAuth()
  const { showToast } = useToast()
  const [stats, setStats] = useState({
    pendingProposals: 0,
    activeWorkflows: 0,
    myTasks: 0,
    overdueTasks: 0,
    completedTasks: 0
  })
  const [userRole, setUserRole] = useState(null) // This will be redundant with useAuth's isHost, but keeping for now if other roles are needed
  const [pendingWorkflows, setPendingWorkflows] = useState([])
  const [userName, setUserName] = useState('')
  const [displayText, setDisplayText] = useState('')
  const fullText = `Welcome, ${userName || 'Commander'} !` // Define fullText here

  useEffect(() => {
    async function fetchStats() {
      if (!user) return

      // Get profile for name and role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, display_name, email')
        .eq('id', user.id)
        .single()

      setUserRole(profile?.role)
      setUserName(profile?.display_name || profile?.email?.split('@')[0])

      // Pending proposals
      const { count: proposals } = await supabase
        .from('workflows')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'proposed')

      // Active workflows
      const { count: workflows } = await supabase
        .from('workflows')
        .select('*', { count: 'exact', head: true })
        .in('status', ['approved', 'active'])

      // My tasks (not done)
      const { count: tasks } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('assigned_to', user.id)
        .neq('status', 'done')

      // Overdue tasks
      const { data: overdueTasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('assigned_to', user.id)
        .neq('status', 'done')
        .not('data_consegna', 'is', null)
        .lt('data_consegna', new Date().toISOString())

      // Completed tasks
      const { count: completed } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'done')

      // Pending workflows for Direction
      if (isHost) { // Use isHost from useAuth
        const { data: pending } = await supabase
          .from('workflows')
          .select('*, created_by_profile:profiles!workflows_created_by_fkey(email)')
          .eq('status', 'proposed')
          .order('created_at', { ascending: false })
          .limit(5)

        setPendingWorkflows(pending || [])
      }

      setStats({
        pendingProposals: proposals || 0,
        activeWorkflows: workflows || 0,
        myTasks: tasks || 0,
        overdueTasks: overdueTasks?.length || 0,
        completedTasks: completed || 0
      })
    }

    fetchStats()
  }, [user, isHost]) // Add user and isHost to dependencies

  // Typewriter Effect
  useEffect(() => {
    if (!userName) return
    let i = 0
    setDisplayText('')
    const typing = setInterval(() => {
      setDisplayText(fullText.slice(0, i + 1))
      i++
      if (i === fullText.length) clearInterval(typing)
    }, 50)

    return () => clearInterval(typing)
  }, [userName, fullText])

  async function approveWorkflow(workflowId) {
    try {
      const { error } = await supabase
        .from('workflows')
        .update({ status: 'approved' })
        .eq('id', workflowId)

      if (error) throw error

      // Optimistic Update
      setPendingWorkflows(prev => prev.filter(w => w.id !== workflowId))
      setStats(prev => ({
        ...prev,
        pendingProposals: prev.pendingProposals - 1,
        activeWorkflows: prev.activeWorkflows + 1
      }))
    } catch (error) {
      alert('Error approving workflow: ' + error.message)
    }
  }

  async function rejectWorkflow(workflowId) {
    try {
      const { error } = await supabase
        .from('workflows')
        .update({ status: 'rejected' })
        .eq('id', workflowId)

      if (error) throw error

      // Optimistic Update
      setPendingWorkflows(prev => prev.filter(w => w.id !== workflowId))
      setStats(prev => ({
        ...prev,
        pendingProposals: prev.pendingProposals - 1
      }))
    } catch (error) {
      alert('Error rejecting workflow: ' + error.message)
    }
  }

  return (
    <div className="space-y-12">

      {/* Hero / Welcome */}
      <div className="relative pt-8 pb-4">
        {/* Background Hype */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-50%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/10 blur-[100px] rounded-full" />
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-gray-400 tracking-tight h-[1.2em]">
          {displayText}
          <span className="animate-pulse text-indigo-500">|</span>
        </h1>
        <p className="text-gray-400 mt-2 text-lg max-w-2xl">
          Your command center is ready. System status: <span className="text-green-400 font-bold">ONLINE</span>
        </p>
      </div>

      {/* Stats Grid - Glassmorphism */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Pending Proposals"
          value={stats.pendingProposals}
          icon={<Icons.Lightning className="w-10 h-10" />}
          color="yellow"
          delay={0.1}
        />
        <StatCard
          label="Active Workflows"
          value={stats.activeWorkflows}
          icon={<Icons.Rocket className="w-10 h-10" />}
          color="indigo"
          delay={0.2}
        />
        <StatCard
          label="My Active Tasks"
          value={stats.myTasks}
          icon={<Icons.Swords className="w-10 h-10" />}
          color="blue"
          alert={stats.overdueTasks > 0 ? `${stats.overdueTasks} Overdue` : null}
          delay={0.3}
        />
        <StatCard
          label="Completed Missions"
          value={stats.completedTasks}
          icon={<Icons.Trophy className="w-10 h-10" />}
          color="green"
          delay={0.4}
        />
      </div>

      {/* Quick Actions - Holographic Buttons */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: "rgba(99, 102, 241, 0.15)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate?.('workflows')}
          className="group relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-indigo-900/10 p-8 text-left transition-all"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">Propose Workflow</h3>
              <p className="text-gray-400 text-sm">Submit a new initiative for team approval.</p>
            </div>
            <div className="h-16 w-16 rounded-full bg-indigo-500/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform border border-indigo-500/30">
              <Icons.LightBulb className="w-8 h-8 text-indigo-400" />
            </div>
          </div>
        </motion.button>

        <motion.Link
          to="/mytasks"
          whileHover={{ scale: 1.02, backgroundColor: "rgba(14, 165, 233, 0.15)" }}
          whileTap={{ scale: 0.98 }}
          className="group relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-cyan-900/10 p-8 text-left transition-all block"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">Manage Tasks</h3>
              <p className="text-gray-400 text-sm">Track your daily objectives and progress.</p>
            </div>
            <div className="h-16 w-16 rounded-full bg-cyan-500/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform border border-cyan-500/30">
              <Icons.Check className="w-8 h-8 text-cyan-400" />
            </div>
          </div>
        </motion.Link>
      </div>

      {/* Host Console - Pending Approvals */}
      <AnimatePresence>
        {userRole === 'host' && pendingWorkflows.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-3xl border border-yellow-500/20 bg-[#0a0500] overflow-hidden"
          >
            <div className="px-8 py-6 border-b border-yellow-500/10 bg-gradient-to-r from-yellow-900/10 to-transparent flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />
              <h3 className="text-xl font-bold text-yellow-100 tracking-wide">COMMAND CONSOLE: PENDING APPROVALS</h3>
            </div>

            <div className="p-6 space-y-4">
              {pendingWorkflows.map(workflow => (
                <div key={workflow.id} className="relative group p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-yellow-500/30 transition-all">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors">
                        {workflow.title}
                      </h4>
                      <p className="text-sm text-gray-400 max-w-xl">{workflow.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 font-mono uppercase tracking-wider">
                        <span>ID: {workflow.id.slice(0, 8)}</span>
                        <span>BY: {workflow.created_by_profile?.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-center">
                      <button
                        onClick={() => approveWorkflow(workflow.id)}
                        className="px-6 py-2 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-black border border-green-500/30 rounded-lg font-bold text-sm transition-all uppercase tracking-wide"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectWorkflow(workflow.id)}
                        className="px-6 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-black border border-red-500/30 rounded-lg font-bold text-sm transition-all uppercase tracking-wide"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Reusable Stat Card Component
const StatCard = ({ label, value, icon, color, alert, delay }) => {
  const colors = {
    yellow: "from-yellow-500/20 to-orange-500/20 border-yellow-500/20 text-yellow-400",
    indigo: "from-indigo-500/20 to-purple-500/20 border-indigo-500/20 text-indigo-400",
    blue: "from-blue-500/20 to-cyan-500/20 border-blue-500/20 text-blue-400",
    green: "from-emerald-500/20 to-teal-500/20 border-emerald-500/20 text-emerald-400",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`relative p - 6 rounded - 2xl border bg - gradient - to - br backdrop - blur - xl ${colors[color]} overflow - hidden group`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-6xl select-none">
        {icon}
      </div>

      <div className="relative z-10">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">{label}</h3>
        <div className="flex items-end gap-3">
          <span className="text-5xl font-black text-white tracking-tighter shadow-lg">{value}</span>
          {alert && (
            <span className="text-xs font-bold bg-red-500/20 text-red-400 px-2 py-1 rounded border border-red-500/30 mb-2 animate-pulse">
              {alert}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
