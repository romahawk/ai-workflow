import { createBrowserRouter } from "react-router";
import Home from "./Home";
import { PrivateGuard } from "./components/PrivateGuard";
import { Dashboard } from "./pages/Dashboard";
import { ProjectDetail } from "./pages/ProjectDetail";
import { SprintPlanning } from "./pages/SprintPlanning";
import { DailyLoop } from "./pages/DailyLoop";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateGuard>
        <Dashboard />
      </PrivateGuard>
    ),
  },
  {
    path: "/projects/:id",
    element: (
      <PrivateGuard>
        <ProjectDetail />
      </PrivateGuard>
    ),
  },
  {
    path: "/sprint",
    element: (
      <PrivateGuard>
        <SprintPlanning />
      </PrivateGuard>
    ),
  },
  {
    path: "/daily",
    element: (
      <PrivateGuard>
        <DailyLoop />
      </PrivateGuard>
    ),
  },
]);
