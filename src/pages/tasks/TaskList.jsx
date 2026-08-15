import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout.jsx';
import { TaskCard, Empty, Loading, ErrorBanner, useToast } from '../../components/UI.jsx';
import { api } from '../../lib/api.js';
import { ENDPOINTS } from '../../lib/config.js';

const STATUSES = [
    { value: '',            label: 'OPEN' },
    { value: 'Pending',     label: 'PENDING' },
    { value: 'In Progress', label: 'IN PROGRESS' },
    { value: 'Blocked',     label: 'BLOCKED' },
    { value: 'Completed',   label: 'COMPLETED' },
    { value: 'Skipped',     label: 'SKIPPED' },
];

export default function TaskList() {
    const navigate = useNavigate();
    const { show: showToast, ToastNode } = useToast();

    const [tasks,   setTasks]   = useState([]);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(null);
    const [status,  setStatus]  = useState('');

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = status ? { status } : {};
            const data   = await api.get(ENDPOINTS.get_my_tasks, params);
            setTasks(Array.isArray(data) ? data : []);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [status]);

    useEffect(() => { load(); }, [load]);

    return (
        <AppLayout>
            {/* Filter pills */}
            <div style={S.filterRow}>
                {STATUSES.map(s => (
                    <button
                        key={s.value || 'open'}
                        onClick={() => setStatus(s.value)}
                        style={{
                            ...S.pill,
                            ...(status === s.value ? S.pillActive : {}),
                        }}>
                        {s.label}
                    </button>
                ))}
            </div>

            <div style={S.label}>
                // {loading ? '…' : tasks.length} task{tasks.length !== 1 ? 's' : ''} · {status || 'Open'}
            </div>

            <ErrorBanner message={error} />

            {loading ? (
                <Loading />
            ) : tasks.length === 0 ? (
                <Empty text="// No open tasks. Pull to refresh." />
            ) : (
                tasks.map(t => (
                    <TaskCard
                        key={t.name}
                        task={t}
                        clickable
                        onClick={t => navigate(`/tasks/${t.name}`)}
                    />
                ))
            )}

            {ToastNode}
        </AppLayout>
    );
}

const S = {
    filterRow: { display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 },
    pill: {
        flexShrink: 0, padding: '6px 12px', borderRadius: 2,
        fontFamily: 'var(--mono)', fontSize: 10, cursor: 'pointer',
        background: 'var(--bg2)', color: 'var(--text2)',
        border: '1px solid var(--border)', letterSpacing: '0.06em',
        transition: 'all .15s',
    },
    pillActive: { background: 'var(--primary)', color: '#ffffff', border: '1px solid var(--primary)' },
    label: { fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)', letterSpacing: '0.1em', marginBottom: 12 },
};
