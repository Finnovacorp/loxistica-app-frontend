import { useState } from 'react';
import AppLayout from '../../components/AppLayout.jsx';
import { Button, Field, inputStyle, ResultBanner, ErrorBanner } from '../../components/UI.jsx';
import { api } from '../../lib/api.js';
import { ENDPOINTS } from '../../lib/config.js';

export default function GenerateTasks() {
    const [orderId,     setOrderId]     = useState('');
    const [templateId,  setTemplateId]  = useState('');
    const [loading,     setLoading]     = useState(false);
    const [error,       setError]       = useState(null);
    const [result,      setResult]      = useState(null);

    async function handleSubmit(e) {
        e?.preventDefault();
        if (!orderId.trim() || !templateId.trim()) {
            setError('Both fields are required.');
            return;
        }
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const data = await api.post(ENDPOINTS.generate_tasks, {
                logistics_order: orderId.trim(),
                template_id:     templateId.trim(),
            });
            setResult(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <AppLayout>
            <div style={S.box}>
                <div style={S.title}>// Generate Tasks from Template</div>
                <p style={S.hint}>
                    Creates Job Task records on the specified Logistics Order using the chosen template.
                    Draft and Submitted orders are supported. Only Cancelled orders are rejected.
                    The order must have an Operations Manager assigned.
                </p>

                <form onSubmit={handleSubmit}>
                    <Field label="Logistics Order ID" required>
                        <input value={orderId} onChange={e => setOrderId(e.target.value)}
                            placeholder="LOX-ORD-2026-0042" style={inputStyle} />
                    </Field>
                    <Field label="Template ID" required>
                        <input value={templateId} onChange={e => setTemplateId(e.target.value)}
                            placeholder="JTT-00001" style={inputStyle} />
                    </Field>
                    <Button variant="primary" onClick={handleSubmit} disabled={loading} fullWidth>
                        {loading ? 'Generating…' : 'Generate Tasks →'}
                    </Button>
                </form>
            </div>

            <ErrorBanner message={error} />

            {result && (
                <ResultBanner type="success">
                    <div>✓ {result.tasks_created} tasks created successfully</div>
                    {result.task_ids?.length > 0 && (
                        <div style={{ marginTop: 8, color: 'var(--text2)', fontSize: 11, wordBreak: 'break-word' }}>
                            {result.task_ids.slice(0, 6).join('  ·  ')}
                            {result.task_ids.length > 6 && `  … +${result.task_ids.length - 6} more`}
                        </div>
                    )}
                </ResultBanner>
            )}
        </AppLayout>
    );
}

const S = {
    box: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 4, padding: 16, marginBottom: 12 },
    title: { fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 },
    hint: { fontSize: 12, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 18 },
};
