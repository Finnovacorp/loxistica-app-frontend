import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout.jsx';
import {
    StatusBadge, Section, KVGrid, KVItem,
    Button, Field, inputStyle, FreightChips,
    Modal, Loading, ErrorBanner, ResultBanner, useToast,
} from '../../components/UI.jsx';
import { api } from '../../lib/api.js';
import { ENDPOINTS } from '../../lib/config.js';

function formatDuration(sec) {
    if (!sec) return '—';
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60);
    if (h && m) return `${h}h ${m}m`;
    if (h) return `${h}h`;
    return `${m}m`;
}

export default function TaskDetail() {
    const { taskId } = useParams();
    const navigate   = useNavigate();
    const { show: showToast, ToastNode } = useToast();

    const [task,    setTask]    = useState(null);
    const [order,   setOrder]   = useState(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(null);

    // Modal state
    const [modal,         setModal]         = useState(null); // 'start'|'complete'|'block'|'unblock'
    const [remarks,       setRemarks]       = useState('');
    const [blockedReason, setBlockedReason] = useState('');
    const [submitting,    setSubmitting]    = useState(false);
    const [fieldError,    setFieldError]    = useState('');

    useEffect(() => {
        (async () => {
            try {
                const data = await api.get(ENDPOINTS.get_task_detail, { task_id: taskId });
                setTask(data.task ?? data);
                setOrder(data.order ?? null);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [taskId]);

    function openModal(type) {
        setModal(type);
        setRemarks('');
        setBlockedReason('');
        setFieldError('');
    }

    async function handleSubmit() {
        const STATUS_MAP = { start: 'In Progress', complete: 'Completed', block: 'Blocked', unblock: 'In Progress' };
        const newStatus  = STATUS_MAP[modal];

        if (modal === 'block' && !blockedReason.trim()) {
            setFieldError('Blocked reason is required.');
            return;
        }

        setSubmitting(true);
        setFieldError('');
        try {
            const body = { task_id: taskId, status: newStatus };
            if (remarks.trim())       body.remarks        = remarks.trim();
            if (modal === 'block')    body.blocked_reason = blockedReason.trim();

            await api.post(ENDPOINTS.update_task_status, body);

            const label = { start: 'started', complete: 'completed', block: 'blocked', unblock: 'unblocked' }[modal];
            showToast(`Task ${label} successfully.`);
            setModal(null);

            // Reload task data
            const data = await api.get(ENDPOINTS.get_task_detail, { task_id: taskId });
            setTask(data.task ?? data);
            setOrder(data.order ?? null);
        } catch (e) {
            setFieldError(e.message);
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) return <AppLayout><Loading /></AppLayout>;

    if (error) return (
        <AppLayout>
            <button style={S.back} onClick={() => navigate('/tasks')}>← Back to Tasks</button>
            <ErrorBanner message={error} />
        </AppLayout>
    );

    const isPending    = task?.status === 'Pending';
    const isInProgress = task?.status === 'In Progress';
    const isBlocked    = task?.status === 'Blocked';

    return (
        <AppLayout>
            <button style={S.back} onClick={() => navigate('/tasks')}>← Back to Tasks</button>

            {/* Task Info */}
            <Section title="Task Info">
                <KVGrid>
                    <KVItem label="Task ID">
                        <span style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{task.name}</span>
                    </KVItem>
                    <KVItem label="Status"><StatusBadge status={task.status} /></KVItem>
                    <KVItem label="Task Name" full>{task.task_name}</KVItem>
                    <KVItem label="Sequence">
                        <span style={{ fontFamily: 'var(--mono)' }}>{task.sequence}</span>
                    </KVItem>
                    <KVItem label="Assigned To">{task.assigned_to_name}</KVItem>
                    <KVItem label="External">
                        <span style={{ color: task.is_external ? 'var(--primary)' : 'var(--text2)' }}>
                            {task.is_external ? 'Yes' : 'No'}
                        </span>
                    </KVItem>
                    <KVItem label="Parallel">{task.is_parallel ? 'Yes' : 'No'}</KVItem>
                    {task.expected_duration_hours && (
                        <KVItem label="Expected Duration">{task.expected_duration_hours}h</KVItem>
                    )}
                    {task.description && (
                        <KVItem label="Description" full>
                            <span style={{ fontSize: 12, lineHeight: 1.7, color: 'var(--text2)' }}>{task.description}</span>
                        </KVItem>
                    )}
                    {task.remarks && (
                        <KVItem label="Remarks" full>
                            <span style={{ fontSize: 12 }}>{task.remarks}</span>
                        </KVItem>
                    )}
                    {task.blocked_reason && (
                        <KVItem label="Blocked Reason" full>
                            <span style={{ fontSize: 12, color: 'var(--red)' }}>{task.blocked_reason}</span>
                        </KVItem>
                    )}
                </KVGrid>
            </Section>

            {/* Timing */}
            {(task.started_at || task.confirmed_at || task.duration || task.blocked_at) && (
                <Section title="Timing">
                    <KVGrid>
                        {task.started_at && (
                            <KVItem label="Started At" full>
                                <span style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{task.started_at}</span>
                            </KVItem>
                        )}
                        {task.confirmed_at && (
                            <KVItem label="Completed At" full>
                                <span style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{task.confirmed_at}</span>
                            </KVItem>
                        )}
                        {task.confirmed_by && <KVItem label="Completed By">{task.confirmed_by}</KVItem>}
                        {task.duration != null && (
                            <KVItem label="Time Spent">
                                <span style={{ fontFamily: 'var(--mono)', color: 'var(--primary)', fontWeight: 600 }}>
                                    {formatDuration(task.duration)}
                                </span>
                            </KVItem>
                        )}
                        {task.blocked_at && (
                            <KVItem label="Blocked At" full>
                                <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--red)' }}>{task.blocked_at}</span>
                            </KVItem>
                        )}
                        {task.resolved_at && (
                            <KVItem label="Unblocked At" full>
                                <span style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{task.resolved_at}</span>
                            </KVItem>
                        )}
                    </KVGrid>
                </Section>
            )}

            {/* Order Context */}
            {order && (
                <Section title="Order Context">
                    <KVGrid>
                        <KVItem label="Order ID" full>
                            <span style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{order.name}</span>
                        </KVItem>
                        <KVItem label="Customer" full>{order.customer}</KVItem>
                        <KVItem label="B/L Number">
                            <span style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{order.bl_no}</span>
                        </KVItem>
                        {order.ucr && (
                            <KVItem label="UCR">
                                <span style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{order.ucr}</span>
                            </KVItem>
                        )}
                        <KVItem label="Ops Status">{order.operations_status}</KVItem>
                        {order.service_type && <KVItem label="Service Type" full>{order.service_type}</KVItem>}
                        <KVItem label="Freight" full>
                            <FreightChips type={order.freight_type} dir={order.direction} />
                        </KVItem>
                        {order.vessel_name && <KVItem label="Vessel" full>{order.vessel_name}</KVItem>}
                        <KVItem label="Terminal">{order.terminal}</KVItem>
                        <KVItem label="Port of Loading">{order.port_of_loading}</KVItem>
                        <KVItem label="Port of Discharge">{order.port_of_discharge}</KVItem>
                    </KVGrid>
                </Section>
            )}

            {/* Action buttons */}
            {isPending && (
                <div style={S.actionBar}>
                    <Button variant="confirm" onClick={() => openModal('start')} fullWidth>▶ Start Task</Button>
                    <Button variant="block"   onClick={() => openModal('block')} fullWidth>✕ Block Task</Button>
                </div>
            )}
            {isInProgress && (
                <div style={S.actionBar}>
                    <Button variant="confirm" onClick={() => openModal('complete')} fullWidth>✓ Complete Task</Button>
                    <Button variant="block"   onClick={() => openModal('block')}    fullWidth>✕ Block Task</Button>
                </div>
            )}
            {isBlocked && (
                <div style={{ ...S.actionBar, gridTemplateColumns: '1fr' }}>
                    <Button variant="blue" onClick={() => openModal('unblock')} fullWidth>↩ Unblock Task</Button>
                </div>
            )}

            {/* Modals */}
            {modal === 'start' && (
                <Modal title="// Start Task" onClose={() => setModal(null)} footer={<>
                    <Button variant="ghost"   onClick={() => setModal(null)}>Cancel</Button>
                    <Button variant="confirm" onClick={handleSubmit} disabled={submitting}>
                        {submitting ? 'Saving…' : 'Start →'}
                    </Button>
                </>}>
                    <p style={S.hint}>
                        Marking this task as <strong>In Progress</strong> stamps the start time.
                        Prior tasks in sequence must already be completed.
                    </p>
                    {fieldError && <ErrorBanner message={fieldError} />}
                </Modal>
            )}

            {modal === 'complete' && (
                <Modal title="// Complete Task" onClose={() => setModal(null)} footer={<>
                    <Button variant="ghost"   onClick={() => setModal(null)}>Cancel</Button>
                    <Button variant="confirm" onClick={handleSubmit} disabled={submitting}>
                        {submitting ? 'Saving…' : 'Complete →'}
                    </Button>
                </>}>
                    <Field label="Remarks (optional)">
                        <textarea value={remarks} onChange={e => setRemarks(e.target.value)}
                            placeholder="Officer name, timestamp, observations…"
                            style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} />
                    </Field>
                    {fieldError && <ErrorBanner message={fieldError} />}
                </Modal>
            )}

            {modal === 'block' && (
                <Modal title="// Block Task" onClose={() => setModal(null)} footer={<>
                    <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
                    <Button variant="block" onClick={handleSubmit} disabled={submitting}>
                        {submitting ? 'Saving…' : 'Block →'}
                    </Button>
                </>}>
                    <Field label="Blocked Reason" required error={fieldError}>
                        <textarea value={blockedReason} onChange={e => setBlockedReason(e.target.value)}
                            placeholder="Describe why this task is blocked…"
                            style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} />
                    </Field>
                    <Field label="Remarks (optional)">
                        <textarea value={remarks} onChange={e => setRemarks(e.target.value)}
                            placeholder="Additional context…"
                            style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} />
                    </Field>
                </Modal>
            )}

            {modal === 'unblock' && (
                <Modal title="// Unblock Task" onClose={() => setModal(null)} footer={<>
                    <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
                    <Button variant="blue"  onClick={handleSubmit} disabled={submitting}>
                        {submitting ? 'Saving…' : 'Unblock →'}
                    </Button>
                </>}>
                    <p style={S.hint}>
                        Moves the task back to <strong>In Progress</strong> and stamps the resolved time.
                    </p>
                    {fieldError && <ErrorBanner message={fieldError} />}
                </Modal>
            )}

            {ToastNode}
        </AppLayout>
    );
}

const S = {
    back: {
        display: 'inline-flex', alignItems: 'center', gap: 8,
        fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text2)',
        marginBottom: 16, background: 'none', border: 'none', cursor: 'pointer', padding: 0,
    },
    actionBar: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4, marginBottom: 16 },
    hint: { fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 8 },
};
