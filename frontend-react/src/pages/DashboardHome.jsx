import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
);

const DashboardHome = () => {
    const { theme, toggleTheme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalGoals: 0,
        completedGoals: 0,
        totalTasks: 0,
        completedTasks: 0,
        totalNotes: 0,
        pinnedNotes: 0
    });

    // Data states
    const [goals, setGoals] = useState([]);
    const [activities, setActivities] = useState([]);

    const [chartData, setChartData] = useState({
        goals: { labels: [], datasets: [] },
        tasks: { labels: [], datasets: [] }
    });

    const serverUrl = "https://classmate-juji.onrender.com";

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };

            const [tasksRes, notesRes] = await Promise.all([
                fetch(`${serverUrl}/api/tasks`, { headers }),
                fetch(`${serverUrl}/api/notes`, { headers })
            ]);

            let tasksData = [];
            let notesData = [];

            if (tasksRes.ok) tasksData = await tasksRes.json();
            if (notesRes.ok) notesData = await notesRes.json();

            // --- Process Goals (Derived from Tasks) ---
            const processedGoals = tasksData.map((task, taskArrayIndex) => {
                const goalTitle = task.text.split('\n')[0].trim().replace(/^Goal:\s*/, '');
                const phases = task.text.split(/Phase\s*\d*:/i).slice(1);
                let totalTasksInGoal = 0;
                let completedTasksInGoal = 0;

                const checkboxStates = task.checkbox_states || {};

                phases.forEach((phaseBlock, phaseIndex) => {
                    const lines = phaseBlock.trim().split('\n').map(l => l.trim()).filter(Boolean);
                    if (lines.length <= 1) return;

                    const phaseTasks = lines.slice(1);
                    totalTasksInGoal += phaseTasks.length;

                    phaseTasks.forEach((_, taskItemIndex) => {
                        const checkboxId = `task_${taskArrayIndex}_phase_${phaseIndex}_item_${taskItemIndex}`;
                        if (checkboxStates[checkboxId]) {
                            completedTasksInGoal++;
                        }
                    });
                });

                return {
                    id: task.id || task._id,
                    title: goalTitle,
                    totalItems: totalTasksInGoal, // Renamed from totalTasks to avoid confusion with global total
                    completedItems: completedTasksInGoal,
                    pinned: task.pinned || false,
                };
            });

            setGoals(processedGoals);

            // --- Generate Sample Activity ---
            const generatedActivities = [];
            processedGoals.forEach(goal => {
                generatedActivities.push({
                    id: 'act-g-' + goal.id, action: 'created', item: 'goal', title: goal.title,
                    time: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
                });
                if (goal.completedItems > 0) {
                    generatedActivities.push({
                        id: 'act-t-' + goal.id, action: 'completed', item: 'task', title: `Task in ${goal.title}`,
                        time: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString()
                    });
                }
            });
            notesData.forEach(note => {
                generatedActivities.push({
                    id: 'act-n-' + (note.id || Math.random().toString(36).substr(2, 9)), action: 'created', item: 'note', title: note.title || 'Untitled Note',
                    time: new Date(note.timestamp || Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString()
                });
            });
            generatedActivities.sort((a, b) => new Date(b.time) - new Date(a.time));
            setActivities(generatedActivities.slice(0, 10));


            // --- Calculate Global Stats ---
            const totalGoals = processedGoals.length;
            const completedGoals = processedGoals.filter(g => g.totalItems > 0 && g.completedItems === g.totalItems).length;
            const totalTasks = processedGoals.reduce((sum, goal) => sum + goal.totalItems, 0);
            const completedTasks = processedGoals.reduce((sum, goal) => sum + goal.completedItems, 0);
            const totalNotes = notesData.length;
            const pinnedNotes = notesData.filter(n => n.isPinned).length;

            setStats({
                totalGoals,
                completedGoals,
                totalTasks,
                completedTasks,
                totalNotes,
                pinnedNotes
            });

            // --- Chart Data ---
            const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
            const accentSecondary = getComputedStyle(document.documentElement).getPropertyValue('--accent-secondary').trim(); // Or success color
            const cardBorder = getComputedStyle(document.documentElement).getPropertyValue('--card-border').trim();
            const successColor = getComputedStyle(document.documentElement).getPropertyValue('--success').trim() || '#22c55e'; // Fallback

            setChartData({
                goals: {
                    labels: ['Completed', 'Pending'],
                    datasets: [{
                        data: [completedGoals, totalGoals - completedGoals],
                        backgroundColor: [successColor, cardBorder],
                        borderWidth: 0
                    }]
                },
                tasks: {
                    labels: ['Completed', 'Pending'],
                    datasets: [{
                        data: [completedTasks, totalTasks - completedTasks],
                        backgroundColor: [accentColor, cardBorder],
                        borderWidth: 0
                    }]
                }
            });

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [theme]);

    const handleRefresh = () => {
        setLoading(true);
        fetchData();
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div className="spinner" style={{
                    width: '50px', height: '50px',
                    border: '5px solid rgba(0,0,0,0.1)',
                    borderTopColor: 'var(--accent)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <>
            <header className="dashboard-header">
                <div className="header-brand">
                    <i className="fas fa-chart-bar" style={{ fontSize: '1.5rem', color: 'var(--accent)' }}></i>
                    <div>
                        <h1 className="page-title">Progress Dashboard</h1>
                        <p className="header-subtitle">Track your goals, tasks, and notes</p>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary" onClick={handleRefresh} title="Refresh Data">
                        <i className="fas fa-sync-alt"></i> <span>Refresh</span>
                    </button>
                    <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme" style={{ display: 'flex', border: '1px solid var(--card-border)' }}>
                        <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
                    </button>
                    <a href="/settings" className="theme-toggle" title="Settings" style={{ display: 'flex', textDecoration: 'none', color: 'inherit', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fas fa-cog"></i>
                    </a>
                </div>
            </header>

            <div className="container" style={{ padding: '0 20px 20px 20px' }}>
                <div className="stats-overview">
                    <StatCard title="Total Goals" value={stats.totalGoals} desc="Goals you've set" />
                    <StatCard title="Completed Goals" value={stats.completedGoals} desc="Goals fully achieved" />
                    <StatCard title="Total Tasks" value={stats.totalTasks} desc="Tasks across all goals" />
                    <StatCard title="Completed Tasks" value={stats.completedTasks} desc="Tasks you've finished" />
                    <StatCard title="Total Notes" value={stats.totalNotes} desc="Notes created" />
                    <StatCard title="Pinned Notes" value={stats.pinnedNotes} desc="Important notes" />
                </div>

                <div className="chart-container">
                    <div className="chart-card">
                        <h2><i className="fas fa-chart-pie"></i> Goal Completion</h2>
                        <div className="chart-wrapper">
                            <Doughnut data={chartData.goals} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>
                    <div className="chart-card">
                        <h2><i className="fas fa-chart-pie"></i> Task Completion</h2>
                        <div className="chart-wrapper">
                            <Doughnut data={chartData.tasks} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>
                </div>

                <h2 className="section-title"><i className="fas fa-bullseye"></i> Your Goals</h2>
                <div className="goals-container">
                    {goals.length === 0 ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                            <i className="fas fa-clipboard-list" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}></i>
                            <p>No goals yet. Create some in your Task Manager!</p>
                        </div>
                    ) : (
                        goals.map(goal => {
                            const completionPercentage = goal.totalItems > 0 ? Math.round((goal.completedItems / goal.totalItems) * 100) : 0;
                            const isCompleted = completionPercentage === 100 && goal.totalItems > 0;
                            return (
                                <div key={goal.id} className={`goal-card ${isCompleted ? 'completed' : ''}`}>
                                    <h3>
                                        <i className={`fas ${goal.pinned ? 'fa-thumbtack' : 'fa-bullseye'}`}></i>
                                        {goal.title}
                                    </h3>
                                    <div className="goal-progress">
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${completionPercentage}%` }}></div>
                                        </div>
                                        <div className="progress-text">
                                            <span>Progress</span>
                                            <span>{completionPercentage}%</span>
                                        </div>
                                    </div>
                                    <div className="goal-stats">
                                        <div className="stat">
                                            <div className="number">{goal.completedItems}</div><div className="label">Completed</div>
                                        </div>
                                        <div className="stat">
                                            <div className="number">{goal.totalItems - goal.completedItems}</div><div className="label">Remaining</div>
                                        </div>
                                        <div className="stat">
                                            <div className="number">{goal.totalItems}</div><div className="label">Total</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <h2 className="section-title"><i className="fas fa-history"></i> Recent Activity</h2>
                <div className="recent-activity">
                    <ul className="activity-list" style={{ listStyle: 'none', padding: 0 }}>
                        {activities.length === 0 ? (
                            <li style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                                <i className="fas fa-clock" style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.5 }}></i>
                                <p>No recent activity</p>
                            </li>
                        ) : (
                            activities.map(activity => (
                                <ActivityItem key={activity.id} activity={activity} />
                            ))
                        )}
                    </ul>
                </div>
            </div>
        </>
    );
};

const StatCard = ({ title, value, desc }) => (
    <div className="stat-card">
        <h3>{title}</h3>
        <div className="stat-value">{value}</div>
        <div className="stat-description">{desc}</div>
    </div>
);

const ActivityItem = ({ activity }) => {
    const timeAgo = (isoString) => {
        const seconds = Math.floor((new Date() - new Date(isoString)) / 1000);
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    const getActionIcon = (action, item) => {
        if (item === 'note') return action === 'created' ? 'fa-file-alt' : 'fa-edit';
        switch (action) {
            case 'completed': return 'fa-check-circle';
            case 'created': return 'fa-plus-circle';
            default: return 'fa-info-circle';
        }
    };

    const getActionText = (action, item) => {
        return `${action.charAt(0).toUpperCase() + action.slice(1)} ${item}`;
    };

    return (
        <li className="activity-item">
            <div className="activity-icon"><i className={`fas ${getActionIcon(activity.action, activity.item)}`}></i></div>
            <div className="activity-content">
                <div className="activity-title">{getActionText(activity.action, activity.item)} "{activity.title}"</div>
                <div className="activity-time">{timeAgo(activity.time)}</div>
            </div>
        </li>
    );
};

export default DashboardHome;
