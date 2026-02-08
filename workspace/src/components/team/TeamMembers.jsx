import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth.jsx'
import SEO from '../common/SEO'
import PageTransition from '../common/PageTransition'
import { useToast } from '../../contexts/ToastContext';
import { Icons } from '../common/Icons'

export function TeamMembers() {
  const { user, isHost } = useAuth()
  const { showToast } = useToast();
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMembers()
  }, [])

  async function fetchMembers() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      console.log('📋 Fetched members:', data)

      if (error) throw error
      setMembers(data)
    } catch (error) {
      console.error('Error fetching members:', error)
      showToast('Error fetching members: ' + error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  async function updateRole(userId, newRole) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) throw error

      // Force immediate UI update
      setMembers(prev => prev.map(m => m.id === userId ? { ...m, role: newRole } : m))
      showToast('Role updated successfully', 'success')
    } catch (error) {
      console.error('Error updating role:', error)
      showToast('Error updating role: ' + error.message, 'error')
    }
  }

  async function approveMember(userId) {
    console.log('🔍 Approving member:', userId)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ is_approved: true })
        .eq('id', userId)

      console.log('✅ Approve result:', { data, error })

      if (error) throw error

      // Force immediate UI update
      setMembers(prev => prev.map(m =>
        m.id === userId ? { ...m, is_approved: true } : m
      ))
      showToast('Member approved successfully!', 'success')

      // Also fetch to ensure consistency
      fetchMembers()
    } catch (error) {
      console.error('❌ Error approving member:', error)
      showToast('Error approving member: ' + error.message, 'error')
    }
  }

  async function removeMember(userId, email) {
    if (!confirm(`Are you sure you want to remove ${email} from the team ? This action cannot be undone.`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)

      if (error) throw error

      // Remove from UI immediately
      setMembers(prev => prev.filter(m => m.id !== userId))
      showToast('Member removed successfully!', 'success')
    } catch (error) {
      console.error('❌ Error removing member:', error)
      showToast('Error removing member: ' + error.message, 'error')
    }
  }

  return (
    <PageTransition className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Team Members</h2>
        <span className="text-sm text-gray-400">{members.length} members</span>
      </div>

      {!isHost && (
        <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-4 backdrop-blur-sm">
          <p className="text-sm text-yellow-400 font-medium">
            <Icons.Exclamation className="w-4 h-4 text-yellow-500 inline mr-2" /> Only Hosts can manage team member roles.
          </p>
        </div>
      )}

      {/* Desktop: Table View */}
      <div className="hidden md:block bg-[#0a0a0a] rounded-3xl shadow-2xl border border-white/5 overflow-hidden backdrop-blur-md">
        <table className="min-w-full divide-y divide-white/5">
          <thead className="bg-[#111]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              {isHost && (
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {members.map(member => (
              <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4"> {/* Removed whitespace-nowrap to allow wrapping */}
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-900/50 to-purple-900/50 flex items-center justify-center text-white font-bold border border-white/10 shadow-lg">
                        {member.display_name ? member.display_name[0].toUpperCase() : member.email[0].toUpperCase()}
                      </div>
                    </div>
                    <div className="ml-4 max-w-xs"> {/* Added max-w-xs to force wrap */}
                      <div className="text-sm font-bold text-white break-words">
                        {member.display_name || member.email.split('@')[0]}
                      </div>
                      <div className="text-sm text-gray-500 break-all">{member.email}</div>
                      {member.skills && (
                        <div className="text-xs text-indigo-400 mt-1 whitespace-normal leading-tight">
                          {member.skills}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {isHost ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-purple-900/30 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30 font-bold tracking-wide">HOST ONLY</span>
                      <select
                        value={member.role}
                        onChange={(e) => updateRole(member.id, e.target.value)}
                        className="text-sm bg-[#111] border border-white/10 text-white rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none cursor-pointer"
                      >
                        <option value="tasker">Collaborator</option>
                        <option value="architect">Coordinator</option>
                        <optgroup label="Association Board" className="bg-gray-800">
                          <option value="president">President</option>
                          <option value="secretary">Secretary</option>
                          <option value="treasurer">Treasurer</option>
                          <option value="counselor">Counselor</option>
                        </optgroup>
                      </select>
                    </div>
                  ) : (
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${member.role === 'host' ? 'bg-purple-900/30 text-purple-300 border border-purple-500/30' :
                      member.role === 'architect' ? 'bg-blue-900/30 text-blue-300 border border-blue-500/30' :
                        'bg-gray-800 text-gray-300 border border-gray-700'
                      } `}>
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                  {new Date(member.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {member.is_approved ? (
                    <span className="px-2.5 py-1 inline-flex items-center text-xs leading-5 font-bold rounded-full bg-green-900/20 text-green-400 border border-green-500/20">
                      Active
                      <span className="ml-2 flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-yellow-900/20 text-yellow-400 border border-yellow-500/20">
                      Pending
                    </span>
                  )}
                </td>
                {isHost && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {member.id === user.id ? (
                      <span className="text-indigo-400 font-bold">You</span>
                    ) : (
                      <div className="flex space-x-2 items-center">
                        {!member.is_approved && (
                          <button
                            onClick={() => approveMember(member.id)}
                            className="px-3 py-1.5 bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 rounded-lg font-bold transition-colors text-xs uppercase"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => removeMember(member.id, member.email)}
                          className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-lg font-bold transition-colors text-xs uppercase"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: Card View - Updated Dark Theme */}
      <div className="md:hidden space-y-4">
        {members.map(member => (
          <div key={member.id} className="bg-[#0a0a0a] rounded-2xl shadow-lg border border-white/5 p-5 relative overflow-hidden">

            {/* Header */}
            <div className="flex items-start justify-between relative z-10 mb-4">
              <div className="flex items-center space-x-4 min-w-0 pr-24"> {/* Added padding-right to avoid overlap with absolute badge */}
                <div className="h-12 w-12 rounded-full flex-shrink-0 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 flex items-center justify-center text-white font-bold text-lg border border-white/10">
                  {member.display_name ? member.display_name[0].toUpperCase() : member.email[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-white break-words leading-tight"> {/* Removed truncate */}
                    {member.display_name || member.email.split('@')[0]}
                  </h3>
                  <p className="text-sm text-gray-500 break-all">{member.email}</p> {/* break-all for long emails */}
                  {member.skills && (
                    <p className="text-xs text-indigo-400 mt-1 font-medium whitespace-normal leading-snug"> {/* Allow wrap */}
                      {member.skills}
                    </p>
                  )}
                </div>
              </div>

              {/* Status Badge - Absolute Positioned to prevent layout shift/cut-off */}
              <div className="absolute top-5 right-5">
                {member.is_approved ? (
                  <span className="flex items-center justify-center px-2.5 py-1 text-xs font-bold rounded-full bg-green-900/20 text-green-400 border border-green-500/20 shadow-sm backdrop-blur-md">
                    Active
                  </span>
                ) : (
                  <span className="flex items-center justify-center px-2.5 py-1 text-xs font-bold rounded-full bg-yellow-900/20 text-yellow-400 border border-yellow-500/20 shadow-sm backdrop-blur-md">
                    Pending
                  </span>
                )}
              </div>
            </div>

            {/* Role */}
            <div className="mb-4 relative z-10">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Role</label>
              {isHost ? (
                <select
                  value={member.role}
                  onChange={(e) => updateRole(member.id, e.target.value)}
                  className="w-full text-sm bg-[#111] border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none font-medium"
                >
                  <option value="tasker">Collaborator</option>
                  <option value="architect">Coordinator</option>
                  <optgroup label="Association Board">
                    <option value="president">President</option>
                    <option value="secretary">Secretary</option>
                    <option value="treasurer">Treasurer</option>
                    <option value="counselor">Counselor</option>
                  </optgroup>
                </select>
              ) : (
                <div className="mt-1">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${member.role === 'host' ? 'bg-purple-900/30 text-purple-300 border border-purple-500/30' :
                    member.role === 'architect' ? 'bg-blue-900/30 text-blue-300 border border-blue-500/30' :
                      'bg-gray-800 text-gray-300 border border-gray-700'
                    } `}>
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            {isHost && member.id !== user.id && (
              <div className="flex space-x-3 pt-4 border-t border-white/5 relative z-10">
                {!member.is_approved && (
                  <button
                    onClick={() => approveMember(member.id)}
                    className="flex-1 px-4 py-2.5 bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 rounded-xl font-bold transition-colors text-sm"
                  >
                    Approve
                  </button>
                )}
                <button
                  onClick={() => removeMember(member.id, member.email)}
                  className="flex-1 px-4 py-2.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-xl font-bold transition-colors text-sm"
                >
                  Remove
                </button>
              </div>
            )}
            {isHost && member.id === user.id && (
              <div className="pt-4 border-t border-white/5 text-center text-indigo-400 font-bold relative z-10">
                You
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-white/5 shadow-inner">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-indigo-400"><Icons.Shield className="w-6 h-6" /></span> Role Permissions
        </h3>
        <ul className="space-y-3 text-sm text-gray-400">
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-2 flex-shrink-0" />
            <span><strong className="text-white">Collaborator:</strong> Can view all workflows, assign self to tasks, and update status of own tasks.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
            <span><strong className="text-white">Coordinator:</strong> Advanced access. Can create tasks, manage workflows, and assign tasks to others.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
            <span><strong className="text-white">Counselor/Host:</strong> Full System Control. Can approve new accounts, manage team roles, and configure system settings.</span>
          </li>
        </ul>
      </div>
    </PageTransition>
  )
}
