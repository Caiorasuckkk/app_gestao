import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Onboarding } from "./components/Onboarding";
import { DashboardLayout } from "./components/DashboardLayout";
import { DashboardHome } from "./pages/DashboardHome";
import { Agenda } from "./pages/Agenda";
import { Pacientes } from "./pages/Pacientes";
import { Prontuarios } from "./pages/Prontuarios";
import { Equipes } from "./pages/Equipes";
import { Financeiro } from "./pages/Financeiro";
import { NotasFiscais } from "./pages/NotasFiscais";
import { Teleconsulta } from "./pages/Teleconsulta";
import { Relatorios } from "./pages/Relatorios";
import { Configuracoes } from "./pages/Configuracoes";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/onboarding",
    Component: Onboarding,
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      { index: true, Component: DashboardHome },
      { path: "agenda", Component: Agenda },
      { path: "pacientes", Component: Pacientes },
      { path: "prontuarios", Component: Prontuarios },
      { path: "equipes", Component: Equipes },
      { path: "financeiro", Component: Financeiro },
      { path: "notas-fiscais", Component: NotasFiscais },
      { path: "teleconsulta", Component: Teleconsulta },
      { path: "relatorios", Component: Relatorios },
      { path: "configuracoes", Component: Configuracoes },
    ],
  },
]);