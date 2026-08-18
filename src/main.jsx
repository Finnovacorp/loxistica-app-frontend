import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import { AuthProvider, useAuth } from "./hooks//useAuth.jsx";
import InstallBanner from "./components/InstallBanner.jsx";

import Login from "./pages/auth/Login.jsx";
import Callback from "./pages/auth/Callback.jsx";
import TaskList from "./pages/tasks/TaskList.jsx";
import TaskDetail from "./pages/tasks/TaskDetail.jsx";
import Dashboard from "./pages/operations/Dashboard.jsx";
import OrderTasks from "./pages/operations/OrderTasks.jsx";
import GenerateTasks from "./pages/operations/GenerateTasks.jsx";
import AssignTask from "./pages/operations/AssignTask.jsx";

// ─── Route guards ─────────────────────────────────────────────────────────────

function RequireAuth({ children }) {
  const { user, checking } = useAuth();
  if (checking) return <Spinner />;
  if (!user) return <Navigate to="/" replace />;
  return children;
}

function RequireOps({ children }) {
  const { user, checking, isOpsManager } = useAuth();
  if (checking) return <Spinner />;
  if (!user) return <Navigate to="/" replace />;
  if (!isOpsManager) return <Navigate to="/tasks" replace />;
  return children;
}

function RootRedirect() {
  const { user, checking, isOpsManager } = useAuth();
  if (checking) return <Spinner />;
  if (!user) return <Login />;
  return (
    <Navigate to={isOpsManager ? "/operations/dashboard" : "/tasks"} replace />
  );
}

function Spinner() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        fontFamily: "var(--mono)",
        fontSize: 12,
        color: "var(--primary)",
        letterSpacing: "0.1em",
      }}
    >
      Loading…
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

function App() {
  return (
    <AuthProvider>
      {/* InstallBanner lives outside the router so it's always rendered */}
      <InstallBanner />

      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="/auth/callback" element={<Callback />} />

          {/* Field Staff */}
          <Route
            path="/tasks"
            element={
              <RequireAuth>
                <TaskList />
              </RequireAuth>
            }
          />
          <Route
            path="/tasks/:taskId"
            element={
              <RequireAuth>
                <TaskDetail />
              </RequireAuth>
            }
          />

          {/* Operations Manager */}
          <Route
            path="/operations/dashboard"
            element={
              <RequireOps>
                <Dashboard />
              </RequireOps>
            }
          />
          <Route
            path="/operations/order-tasks"
            element={
              <RequireOps>
                <OrderTasks />
              </RequireOps>
            }
          />
          <Route
            path="/operations/generate-tasks"
            element={
              <RequireOps>
                <GenerateTasks />
              </RequireOps>
            }
          />
          <Route
            path="/operations/assign-task"
            element={
              <RequireOps>
                <AssignTask />
              </RequireOps>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
