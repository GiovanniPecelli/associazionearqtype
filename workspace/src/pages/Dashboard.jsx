import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { WorkflowProgressChart } from '../components/dashboard/WorkflowProgressChart';
import PageTransition from '../components/common/PageTransition';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

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
    return <div className="text-center p-8">Loading Dashboard...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <PageTransition className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500">Total Workflows</h3>
          <p className="text-3xl font-bold">{stats.workflowCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500">Total Tasks</h3>
          <p className="text-3xl font-bold">{stats.taskCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500">Active Workflows</h3>
          <p className="text-3xl font-bold">{stats.workflowStatusDistribution.find(s => s.name === 'Active')?.value || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Workflow Status</h2>
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
                >
                  {stats.workflowStatusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Task Status Distribution</h2>
          {stats.taskStatusDistribution.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.taskStatusDistribution}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" name="Number of Tasks" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              Nessuna task disponibile
            </div>
          )}
        </div>
      </div>

      {/* Workflow Progress Visualization */}
      {stats.workflowsWithTasks.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Workflow Progress</h2>
          {stats.workflowsWithTasks.map(workflow => (
            <div key={workflow.id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">{workflow.title}</h3>
              <WorkflowProgressChart
                workflowId={workflow.id}
                tasks={workflow.tasks}
              />
            </div>
          ))}
        </div>
      )}
    </PageTransition>
  );
}

export default Dashboard;
