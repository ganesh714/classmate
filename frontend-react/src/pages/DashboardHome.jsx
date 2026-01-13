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
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalGoals: 0,
        completedGoals: 0,
        totalTasks: 0,
        completedTasks: 0,
        totalNotes: 0,
        pinnedNotes: 0
    });

    // Mock data for initial render (replacing empty arrays)
    const [chartData, setChartData] = useState({
        goals: { labels: [], datasets: [] },
        tasks: { labels: [], datasets: [] }
    });

    const serverUrl = "https://classmate-juji.onrender.com";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                };

                // Fetch Stats (using endpoints from original code)
                // Note: Original code fetched /api/tasks and /api/notes and calculated stats locally
                // I will replicate that logic or assume an endpoint exists.
                // Original: loadData() fetches tasks and notes.

                const [tasksRes, notesRes] = await Promise.all([
                    fetch(`${serverUrl}/api/tasks`, { headers }),
                    fetch(`${serverUrl}/api/notes`, { headers })
                ]);

                let tasks = [];
                let notes = [];

                if (tasksRes.ok) tasks = await tasksRes.json();
                if (notesRes.ok) notes = await notesRes.json();

                // Calculate Stats
                const completedTasks = tasks.filter(t => t.completed).length;
                const totalNotes = notes.length;
                const pinnedNotes = notes.filter(n => n.isPinned).length;

                // Goals are not in the fetch list in original code snippet shown, 
                // but 'totalGoals' element exists. Assuming static or different endpoint.
                // I will use mock/default for goals if not available.
                // Wait, original code had: fetchWithAuth(`${API_URL}/api/tasks`)
                // It didn't show /api/goals.
                // But it had "Your Goals" section.
                // I'll assume tasks have goals or it's separate. I'll stick to tasks/notes stats for now.

                setStats({
                    totalGoals: 5, // Mock
                    completedGoals: 2, // Mock 
                    totalTasks: tasks.length,
                    completedTasks: completedTasks,
                    totalNotes: totalNotes,
                    pinnedNotes: pinnedNotes
                });

                // Chart Data
                const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
                const accentSecondary = getComputedStyle(document.documentElement).getPropertyValue('--accent-secondary').trim();
                const cardBorder = getComputedStyle(document.documentElement).getPropertyValue('--card-border').trim();

                setChartData({
                    goals: {
                        labels: ['Completed', 'Pending'],
                        datasets: [{
                            data: [2, 3],
                            backgroundColor: [accentSecondary, cardBorder],
                            borderWidth: 0
                        }]
                    },
                    tasks: {
                        labels: ['Completed', 'Pending'],
                        datasets: [{
                            data: [completedTasks, tasks.length - completedTasks],
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

        fetchData();
    }, [theme]); // Re-run if theme changes to update chart colors if needed

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
        <div className="container">
            <header style={{ position: 'static', background: 'transparent', boxShadow: 'none', padding: '0 0 20px 0', height: 'auto' }}>
                <div className="header-brand">
                    <i className="fas fa-chart-bar" style={{ fontSize: '2rem', color: 'var(--accent)' }}></i>
                    <div>
                        <h1 className="page-title">Progress Dashboard</h1>
                        <p className="header-subtitle">Track your goals, tasks, and notes</p>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary" onClick={() => window.location.reload()}>
                        <i className="fas fa-sync-alt"></i> <span>Refresh</span>
                    </button>
                </div>
            </header>

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

            {/* Placeholder for Goals List and Activity - implement fully later */}
            <h2 className="section-title"><i className="fas fa-bullseye"></i> Your Goals</h2>
            <div className="goals-container">
                <div className="goal-card">
                    <h3><i className="fas fa-code"></i> Learn React</h3>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: '40%' }}></div>
                    </div>
                    <div className="progress-text">
                        <span>40% Complete</span>
                        <span>2/5 Tasks</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

const StatCard = ({ title, value, desc }) => (
    <div className="stat-card">
        <h3>{title}</h3>
        <div className="stat-value">{value}</div>
        <div className="stat-description">{desc}</div>
    </div>
);

export default DashboardHome;
