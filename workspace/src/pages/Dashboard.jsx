import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { WorkflowProgressChart } from '../components/dashboard/WorkflowProgressChart';
import PageTransition from '../components/common/PageTransition';

const COLORS = ['#c0672a', '#1a2b4b', '#f4a261', '#2a3f5f', '#e76f51']; // ARQtype palette

function Dashboard() {
  const [stats, setStats] = useState({
    workflowCount: 0,
    taskCount: 0,
    workflowStatusDistribution: [],
    taskStatusDistribution: [],
    workflowsWithTasks: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [workflowsRes, tasksRes] = await Promise.all([
          supabase.from('workflows').select('id, title, status'),
          supabase.from('tasks').select('id, workflow_id, status, title, created_at, assigned_to')
        ]);

        if (workflowsRes.error) throw workflowsRes.error;
        if (tasksRes.error) throw tasksRes.error;

        const workflows = workflowsRes.data || [];
        const tasks = tasksRes.data || [];

        // Calculate workflow status distribution
        const statusCounts = workflows.reduce((acc, wf) => {
          acc[wf.status] = (acc[wf.status] || 0) + 1;
          return acc;
        }, {});

        const workflowStatusDistribution = Object.entries(statusCounts).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
        }));

        // Calculate workflow completion percentage
        const tasksByWorkflow = tasks.reduce((acc, task) => {
          if (!acc[task.workflow_id]) {
            acc[task.workflow_id] = [];
          }
          acc[task.workflow_id].push(task);
          return acc;
        }, {});

        const workflowCompletion = workflows
          .filter(wf => wf.status === 'active' || wf.status === 'completed')
          .map(wf => {
            const wfTasks = tasksByWorkflow[wf.id] || [];
            const totalTasks = wfTasks.length;
            if (totalTasks === 0) {
              return { name: wf.title, completion: 0 };
            }
            const completedTasks = wfTasks.filter(t => t.status === 'done').length;
            const completion = Math.round((completedTasks / totalTasks) * 100);
            return { name: wf.title, completion };
          })
          .slice(0, 10); // Limit to 10 workflows for clarity

        // Calculate task status distribution
        const taskStatusCounts = tasks.reduce((acc, task) => {
          acc[task.status] = (acc[task.status] || 0) + 1;
          return acc;
        }, {});

        const taskStatusDistribution = Object.entries(taskStatusCounts).map(([name, value]) => ({
          name: name === 'pending_approval' ? 'Pending Approval' :
            name.charAt(0).toUpperCase() + name.slice(1),
          value,
        }));

        // Prepare workflows with their tasks for visualization
        const workflowsWithTasks = workflows
          .map(wf => ({
            ...wf,
            tasks: (tasksByWorkflow[wf.id] || []).sort((a, b) =>
              new Date(a.created_at) - new Date(b.created_at)
            )
          }))
          .filter(wf => wf.tasks.length > 0)
          .slice(0, 5); // Show top 5 workflows

        console.log('DEBUG - Total workflows:', workflows.length);
        console.log('DEBUG - Workflows with tasks:', workflowsWithTasks.length);
        console.log('DEBUG - Workflows with tasks data:', workflowsWithTasks);

        setStats({
          workflowCount: workflows.length,
          taskCount: tasks.length,
          workflowStatusDistribution,
          taskStatusDistribution,
          workflowsWithTasks,
        });

      } catch (err) {
        setError(err.message);
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-deep-blue-brand to-slate-900">
        <div className="text-white text-xl font-semibold animate-pulse">Caricamento Dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-deep-blue-brand to-slate-900">
        <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-8 rounded-xl text-center max-w-md mx-auto">
          <div className="text-2xl mb-4">⚠️</div>
          <p className="text-lg font-semibold mb-2">Errore nel Caricamento</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <PageTransition className="min-h-screen bg-gradient-to-br from-slate-900 via-deep-blue-brand to-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-2">Dashboard</h1>
        <p className="text-gray-300 text-lg">Panoramica delle tue attività e progressi</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-300 font-medium">Total Workflows</h3>
            <div className="w-12 h-12 bg-warm-orange-brand/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-warm-orange-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-black text-white">{stats.workflowCount}</p>
          <p className="text-gray-400 text-sm mt-2">Workflow totali</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-300 font-medium">Total Tasks</h3>
            <div className="w-12 h-12 bg-deep-blue-brand/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-deep-blue-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-black text-white">{stats.taskCount}</p>
          <p className="text-gray-400 text-sm mt-2">Task totali</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-300 font-medium">Active Workflows</h3>
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-black text-white">{stats.workflowStatusDistribution.find(s => s.name === 'Active')?.value || 0}</p>
          <p className="text-gray-400 text-sm mt-2">Workflow attivi</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-warm-orange-brand rounded-full"></div>
            Workflow Status
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.workflowStatusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {stats.workflowStatusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(26, 43, 75, 0.9)', 
                    border: '1px solid rgba(192, 103, 42, 0.3)',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="lg:col-span-3 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-deep-blue-brand rounded-full"></div>
            Task Status Distribution
          </h2>
          {stats.taskStatusDistribution.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.taskStatusDistribution}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(26, 43, 75, 0.9)', 
                      border: '1px solid rgba(192, 103, 42, 0.3)',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="value" fill="#c0672a" name="Number of Tasks" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-700/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-lg font-medium mb-2">Nessuna Task Disponibile</p>
                <p className="text-sm">Non ci sono task da visualizzare in questo momento</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Workflow Progress Visualization */}
      {stats.workflowsWithTasks.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-3 h-3 bg-gradient-brand rounded-full"></div>
            Workflow Progress
          </h2>
          {stats.workflowsWithTasks.map(workflow => (
            <div key={workflow.id} className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4">{workflow.title}</h3>
              <WorkflowProgressChart
                workflowId={workflow.id}
                tasks={workflow.tasks}
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Empty State */}
      {stats.workflowsWithTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-700/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Nessun Dato Disponibile</h3>
          <p className="text-gray-400">Inizia creando i tuoi primi workflow e task per vedere i progressi qui</p>
        </div>
      )}
    </PageTransition>
  );
}

export default Dashboard;
