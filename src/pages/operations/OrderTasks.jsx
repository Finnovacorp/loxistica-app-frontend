import { useState } from 'react';
import AppLayout from '../../components/AppLayout.jsx';
import { TaskCard, Empty, Button, Field, inputStyle, ErrorBanner, Loading } from '../../components/UI.jsx';
import { api } from '../../lib/api.js';
import { ENDPOINTS } from '../../lib/config.js';

export default function OrderTasks() {
    const [input,   setInput]   = useState('');
    const [tasks,   setTasks]   = useState(null);
    const [orderId, setOrderId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState(null);

    async function handleSearch(e) {
        e?.preventDefault();
        if (!input.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const data = await api.get(ENDPOINTS.get_order_tasks, { logistics_order: input.trim() });
            setTasks(Array.isArray(data) ? data : []);
            setOrderId(input.trim());
        } catch (e) {
            setError(e.message);
            setTasks(null);
        } finally {
            setLoading(false);
        }
    }

    return (
        <AppLayout>
            <div style={S.box}>
                <div style={S.title}>// Search Order Tasks</div>
                <form onSubmit={handleSearch}>
                    <Field label="Logistics Order ID">
                        <input value={input} onChange={e => setInput(e.target.value)}
                            placeholder="LOX-ORD-2026-0042" style={inputStyle}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()} />
                    </Field>
                    <Button variant="primary" onClick={handleSearch} disabled={loading} fullWidth>
                        {loading ? 'Searching…' : 'Search →'}
                    </Button>
                </form>
            </div>

            <ErrorBanner message={error} />
            {loading && <Loading />}

            {tasks !== null && !loading && (
                <>
                    <div style={S.label}>
                        // {tasks.length} task{tasks.length !== 1 ? 's' : ''} for {orderId}
                    </div>
                    {tasks.length === 0
                        ? <Empty text="// No tasks found for this order." />
                        : tasks.map(t => <TaskCard key={t.name} task={t} clickable={false} />)
                    }
                </>
            )}
        </AppLayout>
    );
}

const S = {
    box: {
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 4, padding: 16, marginBottom: 16,
    },
    title: {
        fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)',
        letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14,
    },
    label: { fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)', letterSpacing: '0.1em', marginBottom: 12 },
};
