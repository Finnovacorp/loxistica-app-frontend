import { useState } from 'react';
import AppLayout from '../../components/AppLayout.jsx';
import { Button, Field, inputStyle, ResultBanner, ErrorBanner } from '../../components/UI.jsx';
import { api } from '../../lib/api.js';
import { ENDPOINTS } from '../../lib/config.js';

export default function AssignTask() {
    const [taskId,   setTaskId]   = useState('');
    const [employee, setEmployee] = useState('');
    const [loading,  setLoading]  = useState(false);
    const [error,    setError]    = useState(null);
    const [result,   setResult]   = useState(null);

    async function handleSubmit(e) {
        e?.preventDefault();
        if (!taskId.trim() || !employee.trim()) {
            setError('Both fields are required.');
            return;
        }
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const data = await api.post(ENDPOINTS.assign_task, {
                task_id:  taskId.trim(),
                employee: employee.trim(),
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
                <div style={S.title}>// Assign / Reassign Task</div>
                <p style={S.hint}>
                    Assign or reassign a Pending task to a field staff employee.
                    Only tasks in Pending status can be reassigned.
                </p>

                <form onSubmit={handleSubmit}>
                    <Field label="Task ID" required>
                        <input value={taskId} onChange={e => setTaskId(e.target.value)}
                            placeholder="JT-2026-00001" style={inputStyle} />
                    </Field>
                    <Field label="Employee ID" required>
                        <input value={employee} onChange={e => setEmployee(e.target.value)}
                            placeholder="EMP-0015" style={inputStyle} />
                    </Field>
                    <Button variant="primary" onClick={handleSubmit} disabled={loading} fullWidth>
                        {loading ? 'Assigning…' : 'Assign Task →'}
                    </Button>
                </form>
            </div>

            <ErrorBanner message={error} />

            {result && (
                <ResultBanner type="success">
                    <div>✓ {result.task} assigned successfully</div>
                    <div style={{ marginTop: 6, color: 'var(--text2)', fontSize: 11 }}>
                        → {result.assigned_to_name}
                        <span style={{ marginLeft: 8, color: 'var(--text3)' }}>({result.assigned_to})</span>
                    </div>
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
