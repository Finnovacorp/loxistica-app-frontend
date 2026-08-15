import { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout.jsx';
import { StatCard, TaskCard, Empty, Loading, ErrorBanner } from '../../components/UI.jsx';
import { api } from '../../lib/api.js';
import { ENDPOINTS } from '../../lib/config.js';

export default function Dashboard() {
    const [data,    setData]    = useState(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(null);

    useEffect(() => {
        (async () => {
            try {
                setData(await api.get(ENDPOINTS.get_operations_dashboard));
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const tasks       = data?.tasks  ?? {};
    const orders      = data?.orders ?? {};
    const blockedTasks = data?.blocked_tasks ?? [];

    return (
        <AppLayout>
            <ErrorBanner message={error} />

            {loading ? <Loading /> : <>
                <div style={S.label}>// Tasks Overview</div>
                <div style={S.statsGrid}>
                    <StatCard value={tasks.pending     ?? 0} label="Pending"     color="primary" />
                    <StatCard value={tasks.in_progress ?? 0} label="In Progress" color="blue"    />
                    <StatCard value={tasks.completed   ?? 0} label="Completed"   color="green"   />
                    <StatCard value={tasks.blocked     ?? 0} label="Blocked"     color="red"     />
                </div>

                <div style={S.label}>// Orders</div>
                <div style={S.ordersGrid}>
                    <StatCard value={orders.active    ?? 0} label="Active"    color="primary" />
                    <StatCard value={orders.completed ?? 0} label="Completed" color="green"   />
                </div>

                <div style={S.label}>
                    // Blocked Tasks
                    {blockedTasks.length > 0 && (
                        <span style={S.badge}>{blockedTasks.length}</span>
                    )}
                </div>

                {blockedTasks.length === 0
                    ? <Empty text="// No blocked tasks. All clear." />
                    : blockedTasks.map(t => <TaskCard key={t.name} task={t} clickable={false} />)
                }
            </>}
        </AppLayout>
    );
}

const S = {
    label: {
        fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)',
        letterSpacing: '0.12em', textTransform: 'uppercase',
        marginBottom: 10, marginTop: 4,
        display: 'flex', alignItems: 'center', gap: 8,
    },
    statsGrid:  { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8,  marginBottom: 20 },
    ordersGrid: { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginBottom: 20 },
    badge: {
        background: 'var(--red-dim)', color: 'var(--red)', border: '1px solid var(--red)',
        borderRadius: 2, padding: '1px 7px', fontSize: 10, fontFamily: 'var(--mono)',
    },
};
