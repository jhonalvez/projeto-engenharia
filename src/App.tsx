import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { WarroomOverview } from './components/WarroomOverview';
import { ProjectsView } from './components/ProjectsView';
import { TeamView } from './components/TeamView';
import { DocumentsView } from './components/DocumentsView';
import { SegurancaQualidadeView } from './components/SegurancaQualidadeView';
import { StatusSettingsModal } from './components/StatusSettingsModal';
import { ProjectModal } from './components/ProjectModal';
import { ProjectDetailsModal } from './components/ProjectDetailsModal';
import { EmployeeModal } from './components/EmployeeModal';
import { BackupModal } from './components/BackupModal';
import { PrintableWorkOrder } from './components/PrintableWorkOrder';
import { LoginView } from './components/LoginView';
import { UserManagementModal } from './components/UserManagementModal';
import { Projeto, Funcionario } from './types';
import { Shield, Smartphone, Monitor } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab, selectedProjectId, setSelectedProjectId, isLoaded, currentUser } = useApp();

  // Modals state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Projeto | null>(null);

  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Funcionario | null>(null);

  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isUserManagementModalOpen, setIsUserManagementModalOpen] = useState(false);

  // Handlers
  const handleOpenNewProject = () => {
    setProjectToEdit(null);
    setIsProjectModalOpen(true);
  };

  const handleEditProject = (prj: Projeto) => {
    setProjectToEdit(prj);
    setIsProjectModalOpen(true);
  };

  const handleOpenNewEmployee = () => {
    setEmployeeToEdit(null);
    setIsEmployeeModalOpen(true);
  };

  const handleEditEmployee = (emp: Funcionario) => {
    setEmployeeToEdit(emp);
    setIsEmployeeModalOpen(true);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#080c14] flex flex-col items-center justify-center text-slate-400 space-y-4">
        <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono uppercase tracking-widest text-slate-300">
          Carregando Banco de Dados Local Tesla Engenharia...
        </p>
      </div>
    );
  }

  // Se o usuário não estiver autenticado, exibe a tela de login com animação da marca
  if (!currentUser) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col warroom-grid">
      {/* Top Bar Contract Header */}
      <Header
        onOpenNewProject={handleOpenNewProject}
        onOpenNewEmployee={handleOpenNewEmployee}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        onOpenUsers={() => setIsUserManagementModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {activeTab === 'overview' && (
          <WarroomOverview
            onOpenNewProject={handleOpenNewProject}
            onOpenNewEmployee={handleOpenNewEmployee}
            onSelectProject={(id) => setSelectedProjectId(id)}
          />
        )}

        {activeTab === 'projetos' && (
          <ProjectsView
            onOpenNewProject={handleOpenNewProject}
            onEditProject={handleEditProject}
            onSelectProject={(id) => setSelectedProjectId(id)}
          />
        )}

        {activeTab === 'equipes' && (
          <TeamView
            onOpenNewEmployee={handleOpenNewEmployee}
            onEditEmployee={handleEditEmployee}
          />
        )}

        {activeTab === 'seguranca_qualidade' && <SegurancaQualidadeView />}

        {activeTab === 'documentos' && <DocumentsView />}

        {activeTab === 'status_config' && <StatusSettingsModal />}
      </main>

      {/* Footer corporativo sutil sem ruído */}
      <footer className="border-t border-slate-800/80 bg-[#070a12] py-4 px-4 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Tesla Engenharia & Automação</span>
            <span>·</span>
            <span>Centro de Operações e Engenharia</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <Monitor className="w-3.5 h-3.5 text-blue-400" />
              Windows / Linux
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              Android PWA
            </span>
            <span>·</span>
            <button
              onClick={() => setIsBackupModalOpen(true)}
              className="hover:text-blue-400 transition-colors underline cursor-pointer"
            >
              Backup & Arquivos
            </button>
          </div>
        </div>
      </footer>

      {/* Modals Globais */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        projectToEdit={projectToEdit}
      />

      <ProjectDetailsModal
        projectId={selectedProjectId}
        onClose={() => setSelectedProjectId(null)}
        onEdit={handleEditProject}
      />

      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        employeeToEdit={employeeToEdit}
      />

      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
      />

      <UserManagementModal
        isOpen={isUserManagementModalOpen}
        onClose={() => setIsUserManagementModalOpen(false)}
      />

      <PrintableWorkOrder />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
