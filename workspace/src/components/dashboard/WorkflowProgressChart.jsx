import { useState } from 'react';

const STATUS_LEVELS = {
    'pending_approval': 1,
    'todo': 2,
    'doing': 3,
    'done': 4
};

const STATUS_COLORS = {
    'pending_approval': '#FFA500',
    'todo': '#808080',
    'doing': '#0088FE',
    'done': '#00C49F'
};

const STATUS_LABELS = {
    1: 'Pending Approval',
    2: 'To Do',
    3: 'Doing',
    4: 'Done'
};

export function WorkflowProgressChart({ workflowId, tasks }) {
    const [hoveredTask, setHoveredTask] = useState(null);

    if (!tasks || tasks.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                Nessuna task per questo workflow
            </div>
        );
    }

    const width = Math.max(600, tasks.length * 60);
    const height = 300;
    const padding = { top: 40, right: 40, bottom: 40, left: 80 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const xStep = chartWidth / (tasks.length - 1 || 1);
    const yStep = chartHeight / 3; // 4 levels, 3 gaps

    return (
        <div className="space-y-2">
            <div className="flex gap-4 text-xs text-gray-600 mb-2">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
                    <span>Task Assegnata</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-white border-blue-500" style={{ borderWidth: '3px' }}></div>
                    <span>Task Libera</span>
                </div>
            </div>
            <div className="overflow-x-auto">
                <svg width={width} height={height} className="bg-white">
                    {/* Y-axis labels */}
                    {[1, 2, 3, 4].map(level => {
                        const y = padding.top + chartHeight - (level - 1) * yStep;
                        return (
                            <g key={level}>
                                <line
                                    x1={padding.left}
                                    y1={y}
                                    x2={width - padding.right}
                                    y2={y}
                                    stroke="#e5e7eb"
                                    strokeWidth="1"
                                    strokeDasharray="4 4"
                                />
                                <text
                                    x={padding.left - 10}
                                    y={y + 5}
                                    textAnchor="end"
                                    className="text-xs fill-gray-600"
                                >
                                    {STATUS_LABELS[level]}
                                </text>
                            </g>
                        );
                    })}

                    {/* Connecting lines */}
                    {tasks.map((task, index) => {
                        if (index === tasks.length - 1) return null;
                        const nextTask = tasks[index + 1];
                        const x1 = padding.left + index * xStep;
                        const y1 = padding.top + chartHeight - (STATUS_LEVELS[task.status] - 1) * yStep;
                        const x2 = padding.left + (index + 1) * xStep;
                        const y2 = padding.top + chartHeight - (STATUS_LEVELS[nextTask.status] - 1) * yStep;

                        return (
                            <line
                                key={`line-${index}`}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke="#cbd5e1"
                                strokeWidth="2"
                            />
                        );
                    })}

                    {/* Task dots */}
                    {tasks.map((task, index) => {
                        const x = padding.left + index * xStep;
                        const y = padding.top + chartHeight - (STATUS_LEVELS[task.status] - 1) * yStep;
                        const isHovered = hoveredTask === task.id;
                        const isAssigned = task.assigned_to !== null;

                        return (
                            <g key={task.id}>
                                <circle
                                    cx={x}
                                    cy={y}
                                    r={isHovered ? 10 : 8}
                                    fill={isAssigned ? STATUS_COLORS[task.status] : 'white'}
                                    stroke={STATUS_COLORS[task.status]}
                                    strokeWidth={isAssigned ? 2 : 3}
                                    className="cursor-pointer transition-all"
                                    onMouseEnter={() => setHoveredTask(task.id)}
                                    onMouseLeave={() => setHoveredTask(null)}
                                />
                                {isHovered && (
                                    <g>
                                        <rect
                                            x={x + 15}
                                            y={y - 40}
                                            width="180"
                                            height="65"
                                            fill="white"
                                            stroke="#cbd5e1"
                                            strokeWidth="1"
                                            rx="4"
                                        />
                                        <text
                                            x={x + 20}
                                            y={y - 22}
                                            className="text-xs fill-gray-800 font-semibold"
                                        >
                                            {task.title?.substring(0, 22) || 'Task'}
                                        </text>
                                        <text
                                            x={x + 20}
                                            y={y - 8}
                                            className="text-xs fill-gray-600"
                                        >
                                            Status: {task.status}
                                        </text>
                                        <text
                                            x={x + 20}
                                            y={y + 6}
                                            className="text-xs fill-gray-600"
                                        >
                                            {isAssigned ? '✓ Assegnata' : '○ Libera'}
                                        </text>
                                    </g>
                                )}
                            </g>
                        );
                    })}

                    {/* X-axis task numbers */}
                    {tasks.map((task, index) => {
                        const x = padding.left + index * xStep;
                        return (
                            <text
                                key={`label-${index}`}
                                x={x}
                                y={height - padding.bottom + 20}
                                textAnchor="middle"
                                className="text-xs fill-gray-600"
                            >
                                T{index + 1}
                            </text>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}
