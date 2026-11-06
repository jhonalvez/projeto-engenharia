import { Funcionario, Projeto, ProjectStatus, AnexoDocumento, Solicitante, PendenciaMelhoria, RegistroDDS, Usuario } from '../types';
import { 
  initialFuncionarios, 
  initialProjetos, 
  initialStatuses, 
  initialAnexos,
  initialSolicitantes,
  initialPendenciasMelhorias,
  initialDdsList,
  initialUsuarios
} from './initialData';

const DB_NAME = 'TeslaEngenhariaDB';
const DB_VERSION = 4;

const STORES = {
  FUNCIONARIOS: 'funcionarios',
  PROJETOS: 'projetos',
  STATUS: 'statusList',
  ANEXOS: 'anexos',
  SOLICITANTES: 'solicitantes',
  PENDENCIAS: 'pendenciasMelhorias',
  DDS: 'historicoDDS',
  USUARIOS: 'usuarios',
} as const;

class LocalDatabase {
  private dbPromise: Promise<IDBDatabase | null>;

  constructor() {
    this.dbPromise = this.initIndexedDB();
  }

  private async initIndexedDB(): Promise<IDBDatabase | null> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return null;
    }

    return new Promise((resolve) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORES.FUNCIONARIOS)) {
            db.createObjectStore(STORES.FUNCIONARIOS, { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains(STORES.PROJETOS)) {
            db.createObjectStore(STORES.PROJETOS, { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains(STORES.STATUS)) {
            db.createObjectStore(STORES.STATUS, { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains(STORES.ANEXOS)) {
            db.createObjectStore(STORES.ANEXOS, { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains(STORES.SOLICITANTES)) {
            db.createObjectStore(STORES.SOLICITANTES, { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains(STORES.PENDENCIAS)) {
            db.createObjectStore(STORES.PENDENCIAS, { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains(STORES.DDS)) {
            db.createObjectStore(STORES.DDS, { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains(STORES.USUARIOS)) {
            db.createObjectStore(STORES.USUARIOS, { keyPath: 'id' });
          }
        };

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = (err) => {
          console.warn('IndexedDB failed to open, falling back to LocalStorage', err);
          resolve(null);
        };
      } catch (e) {
        console.warn('IndexedDB initialization exception, using LocalStorage', e);
        resolve(null);
      }
    });
  }

  private async getFromIndexedDB<T>(storeName: string): Promise<T[]> {
    const db = await this.dbPromise;
    if (!db) return [];

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.getAll();
        req.onsuccess = () => resolve((req.result as T[]) || []);
        req.onerror = () => resolve([]);
      } catch {
        resolve([]);
      }
    });
  }

  private async putToIndexedDB<T>(storeName: string, item: T): Promise<void> {
    const db = await this.dbPromise;
    if (!db) return;

    return new Promise((resolve, reject) => {
      try {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.put(item);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      } catch (e) {
        reject(e);
      }
    });
  }

  private async deleteFromIndexedDB(storeName: string, id: string): Promise<void> {
    const db = await this.dbPromise;
    if (!db) return;

    return new Promise((resolve, reject) => {
      try {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      } catch (e) {
        reject(e);
      }
    });
  }

  private async clearIndexedDBStore(storeName: string): Promise<void> {
    const db = await this.dbPromise;
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.clear();
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  // --- LocalStorage Fallback Helpers ---
  private getFromLocalStorage<T>(key: string, defaultVal: T[]): T[] {
    try {
      const data = localStorage.getItem(`tesla_${key}`);
      return data ? JSON.parse(data) : defaultVal;
    } catch {
      return defaultVal;
    }
  }

  private saveToLocalStorage<T>(key: string, data: T[]): void {
    try {
      localStorage.setItem(`tesla_${key}`, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  // --- Initialization & Seeding ---
  public async initializeWithSeed(): Promise<{
    funcionarios: Funcionario[];
    projetos: Projeto[];
    statusList: ProjectStatus[];
    anexos: AnexoDocumento[];
    solicitantes: Solicitante[];
    pendencias: PendenciaMelhoria[];
    ddsList: RegistroDDS[];
    usuarios: Usuario[];
  }> {
    let [statusList, funcionarios, projetos, anexos, solicitantes, pendencias, ddsList, usuarios] = await Promise.all([
      this.getFromIndexedDB<ProjectStatus>(STORES.STATUS),
      this.getFromIndexedDB<Funcionario>(STORES.FUNCIONARIOS),
      this.getFromIndexedDB<Projeto>(STORES.PROJETOS),
      this.getFromIndexedDB<AnexoDocumento>(STORES.ANEXOS),
      this.getFromIndexedDB<Solicitante>(STORES.SOLICITANTES),
      this.getFromIndexedDB<PendenciaMelhoria>(STORES.PENDENCIAS),
      this.getFromIndexedDB<RegistroDDS>(STORES.DDS),
      this.getFromIndexedDB<Usuario>(STORES.USUARIOS),
    ]);

    if (statusList.length === 0) {
      statusList = this.getFromLocalStorage<ProjectStatus>(STORES.STATUS, initialStatuses);
      for (const s of statusList) await this.putToIndexedDB(STORES.STATUS, s);
      this.saveToLocalStorage(STORES.STATUS, statusList);
    }

    if (funcionarios.length === 0) {
      funcionarios = this.getFromLocalStorage<Funcionario>(STORES.FUNCIONARIOS, initialFuncionarios);
      for (const f of funcionarios) await this.putToIndexedDB(STORES.FUNCIONARIOS, f);
      this.saveToLocalStorage(STORES.FUNCIONARIOS, funcionarios);
    }

    if (projetos.length === 0) {
      projetos = this.getFromLocalStorage<Projeto>(STORES.PROJETOS, initialProjetos);
      for (const p of projetos) await this.putToIndexedDB(STORES.PROJETOS, p);
      this.saveToLocalStorage(STORES.PROJETOS, projetos);
    }

    if (anexos.length === 0) {
      anexos = this.getFromLocalStorage<AnexoDocumento>(STORES.ANEXOS, initialAnexos);
      for (const a of anexos) await this.putToIndexedDB(STORES.ANEXOS, a);
      try {
        localStorage.setItem(`tesla_${STORES.ANEXOS}`, JSON.stringify(anexos));
      } catch {
        // quota limit
      }
    }

    if (solicitantes.length === 0) {
      solicitantes = this.getFromLocalStorage<Solicitante>(STORES.SOLICITANTES, initialSolicitantes);
      for (const sol of solicitantes) await this.putToIndexedDB(STORES.SOLICITANTES, sol);
      this.saveToLocalStorage(STORES.SOLICITANTES, solicitantes);
    }

    if (pendencias.length === 0) {
      pendencias = this.getFromLocalStorage<PendenciaMelhoria>(STORES.PENDENCIAS, initialPendenciasMelhorias);
      for (const pend of pendencias) await this.putToIndexedDB(STORES.PENDENCIAS, pend);
      this.saveToLocalStorage(STORES.PENDENCIAS, pendencias);
    }

    if (ddsList.length === 0) {
      ddsList = this.getFromLocalStorage<RegistroDDS>(STORES.DDS, initialDdsList);
      for (const d of ddsList) await this.putToIndexedDB(STORES.DDS, d);
      this.saveToLocalStorage(STORES.DDS, ddsList);
    }

    if (usuarios.length === 0) {
      usuarios = this.getFromLocalStorage<Usuario>(STORES.USUARIOS, initialUsuarios);
      for (const u of usuarios) await this.putToIndexedDB(STORES.USUARIOS, u);
      this.saveToLocalStorage(STORES.USUARIOS, usuarios);
    }

    return { funcionarios, projetos, statusList, anexos, solicitantes, pendencias, ddsList, usuarios };
  }

  // --- CRUD Funcionários ---
  public async getFuncionarios(): Promise<Funcionario[]> {
    const list = await this.getFromIndexedDB<Funcionario>(STORES.FUNCIONARIOS);
    return list.length > 0 ? list : this.getFromLocalStorage(STORES.FUNCIONARIOS, initialFuncionarios);
  }

  public async saveFuncionario(funcionario: Funcionario): Promise<void> {
    await this.putToIndexedDB(STORES.FUNCIONARIOS, funcionario);
    const all = await this.getFuncionarios();
    const idx = all.findIndex((f) => f.id === funcionario.id);
    if (idx >= 0) all[idx] = funcionario;
    else all.push(funcionario);
    this.saveToLocalStorage(STORES.FUNCIONARIOS, all);
  }

  public async deleteFuncionario(id: string): Promise<void> {
    await this.deleteFromIndexedDB(STORES.FUNCIONARIOS, id);
    const all = await this.getFuncionarios();
    const filtered = all.filter((f) => f.id !== id);
    this.saveToLocalStorage(STORES.FUNCIONARIOS, filtered);
  }

  // --- CRUD Projetos ---
  public async getProjetos(): Promise<Projeto[]> {
    const list = await this.getFromIndexedDB<Projeto>(STORES.PROJETOS);
    return list.length > 0 ? list : this.getFromLocalStorage(STORES.PROJETOS, initialProjetos);
  }

  public async saveProjeto(projeto: Projeto): Promise<void> {
    await this.putToIndexedDB(STORES.PROJETOS, projeto);
    const all = await this.getProjetos();
    const idx = all.findIndex((p) => p.id === projeto.id);
    if (idx >= 0) all[idx] = projeto;
    else all.push(projeto);
    this.saveToLocalStorage(STORES.PROJETOS, all);
  }

  public async deleteProjeto(id: string): Promise<void> {
    await this.deleteFromIndexedDB(STORES.PROJETOS, id);
    const all = await this.getProjetos();
    const filtered = all.filter((p) => p.id !== id);
    this.saveToLocalStorage(STORES.PROJETOS, filtered);
  }

  // --- CRUD Solicitantes (Clientes) ---
  public async getSolicitantes(): Promise<Solicitante[]> {
    const list = await this.getFromIndexedDB<Solicitante>(STORES.SOLICITANTES);
    return list.length > 0 ? list : this.getFromLocalStorage(STORES.SOLICITANTES, initialSolicitantes);
  }

  public async saveSolicitante(solicitante: Solicitante): Promise<void> {
    await this.putToIndexedDB(STORES.SOLICITANTES, solicitante);
    const all = await this.getSolicitantes();
    const idx = all.findIndex((s) => s.id === solicitante.id);
    if (idx >= 0) all[idx] = solicitante;
    else all.push(solicitante);
    this.saveToLocalStorage(STORES.SOLICITANTES, all);
  }

  public async deleteSolicitante(id: string): Promise<void> {
    await this.deleteFromIndexedDB(STORES.SOLICITANTES, id);
    const all = await this.getSolicitantes();
    const filtered = all.filter((s) => s.id !== id);
    this.saveToLocalStorage(STORES.SOLICITANTES, filtered);
  }

  // --- CRUD Pendências & Melhorias ---
  public async getPendencias(): Promise<PendenciaMelhoria[]> {
    const list = await this.getFromIndexedDB<PendenciaMelhoria>(STORES.PENDENCIAS);
    return list.length > 0 ? list : this.getFromLocalStorage(STORES.PENDENCIAS, initialPendenciasMelhorias);
  }

  public async savePendencia(pendencia: PendenciaMelhoria): Promise<void> {
    await this.putToIndexedDB(STORES.PENDENCIAS, pendencia);
    const all = await this.getPendencias();
    const idx = all.findIndex((p) => p.id === pendencia.id);
    if (idx >= 0) all[idx] = pendencia;
    else all.push(pendencia);
    this.saveToLocalStorage(STORES.PENDENCIAS, all);
  }

  public async deletePendencia(id: string): Promise<void> {
    await this.deleteFromIndexedDB(STORES.PENDENCIAS, id);
    const all = await this.getPendencias();
    const filtered = all.filter((p) => p.id !== id);
    this.saveToLocalStorage(STORES.PENDENCIAS, filtered);
  }

  // --- CRUD Status ---
  public async getStatusList(): Promise<ProjectStatus[]> {
    const list = await this.getFromIndexedDB<ProjectStatus>(STORES.STATUS);
    return list.length > 0 ? list : this.getFromLocalStorage(STORES.STATUS, initialStatuses);
  }

  public async saveStatus(status: ProjectStatus): Promise<void> {
    await this.putToIndexedDB(STORES.STATUS, status);
    const all = await this.getStatusList();
    const idx = all.findIndex((s) => s.id === status.id);
    if (idx >= 0) all[idx] = status;
    else all.push(status);
    this.saveToLocalStorage(STORES.STATUS, all);
  }

  public async deleteStatus(id: string): Promise<void> {
    await this.deleteFromIndexedDB(STORES.STATUS, id);
    const all = await this.getStatusList();
    const filtered = all.filter((s) => s.id !== id);
    this.saveToLocalStorage(STORES.STATUS, filtered);
  }

  // --- CRUD Anexos (PT, APR, Fotos, Documentos) ---
  public async getAnexos(): Promise<AnexoDocumento[]> {
    const list = await this.getFromIndexedDB<AnexoDocumento>(STORES.ANEXOS);
    return list.length > 0 ? list : this.getFromLocalStorage(STORES.ANEXOS, initialAnexos);
  }

  public async saveAnexo(anexo: AnexoDocumento): Promise<void> {
    await this.putToIndexedDB(STORES.ANEXOS, anexo);
    try {
      const all = await this.getAnexos();
      const idx = all.findIndex((a) => a.id === anexo.id);
      if (idx >= 0) all[idx] = anexo;
      else all.push(anexo);
      this.saveToLocalStorage(STORES.ANEXOS, all);
    } catch {
      // quota exception
    }
  }

  public async deleteAnexo(id: string): Promise<void> {
    await this.deleteFromIndexedDB(STORES.ANEXOS, id);
    try {
      const all = await this.getAnexos();
      const filtered = all.filter((a) => a.id !== id);
      this.saveToLocalStorage(STORES.ANEXOS, filtered);
    } catch {
      // noop
    }
  }

  // --- CRUD Diálogo Diário de Segurança (DDS) ---
  public async getDdsList(): Promise<RegistroDDS[]> {
    const list = await this.getFromIndexedDB<RegistroDDS>(STORES.DDS);
    return list.length > 0 ? list : this.getFromLocalStorage(STORES.DDS, initialDdsList);
  }

  public async saveDds(dds: RegistroDDS): Promise<void> {
    await this.putToIndexedDB(STORES.DDS, dds);
    const all = await this.getDdsList();
    const idx = all.findIndex((d) => d.id === dds.id);
    if (idx >= 0) all[idx] = dds;
    else all.push(dds);
    this.saveToLocalStorage(STORES.DDS, all);
  }

  public async deleteDds(id: string): Promise<void> {
    await this.deleteFromIndexedDB(STORES.DDS, id);
    const all = await this.getDdsList();
    const filtered = all.filter((d) => d.id !== id);
    this.saveToLocalStorage(STORES.DDS, filtered);
  }

  // --- CRUD Usuários & Níveis de Acesso ---
  public async getUsuarios(): Promise<Usuario[]> {
    let list = await this.getFromIndexedDB<Usuario>(STORES.USUARIOS);
    if (list.length === 0) {
      list = this.getFromLocalStorage<Usuario>(STORES.USUARIOS, initialUsuarios);
    }
    if (list.length === 0) {
      list = initialUsuarios;
      for (const u of list) {
        await this.putToIndexedDB(STORES.USUARIOS, u);
      }
      this.saveToLocalStorage(STORES.USUARIOS, list);
    }
    return list;
  }

  public async saveUsuario(usuario: Usuario): Promise<void> {
    await this.putToIndexedDB(STORES.USUARIOS, usuario);
    const all = await this.getUsuarios();
    const idx = all.findIndex((u) => u.id === usuario.id);
    if (idx >= 0) all[idx] = usuario;
    else all.push(usuario);
    this.saveToLocalStorage(STORES.USUARIOS, all);
  }

  public async deleteUsuario(id: string): Promise<void> {
    await this.deleteFromIndexedDB(STORES.USUARIOS, id);
    const all = await this.getUsuarios();
    const filtered = all.filter((u) => u.id !== id);
    this.saveToLocalStorage(STORES.USUARIOS, filtered);
  }

  // --- Backup e Restauração em Arquivo JSON ---
  public async exportBackup(): Promise<string> {
    const [funcionarios, projetos, statusList, anexos, solicitantes, pendencias, ddsList, usuarios] = await Promise.all([
      this.getFuncionarios(),
      this.getProjetos(),
      this.getStatusList(),
      this.getAnexos(),
      this.getSolicitantes(),
      this.getPendencias(),
      this.getDdsList(),
      this.getUsuarios(),
    ]);

    const backupData = {
      sistema: 'Tesla Engenharia & Automação',
      versao: '2.5.0',
      dataExportacao: new Date().toISOString(),
      dados: {
        funcionarios,
        projetos,
        statusList,
        anexos,
        solicitantes,
        pendencias,
        ddsList,
        usuarios,
      },
    };

    return JSON.stringify(backupData, null, 2);
  }

  public async importBackup(jsonString: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(jsonString);
      const data = parsed.dados || parsed;

      if (!data.funcionarios || !data.projetos || !data.statusList) {
        throw new Error('Arquivo de backup inválido');
      }

      await Promise.all([
        this.clearIndexedDBStore(STORES.FUNCIONARIOS),
        this.clearIndexedDBStore(STORES.PROJETOS),
        this.clearIndexedDBStore(STORES.STATUS),
        this.clearIndexedDBStore(STORES.ANEXOS),
        this.clearIndexedDBStore(STORES.SOLICITANTES),
        this.clearIndexedDBStore(STORES.PENDENCIAS),
        this.clearIndexedDBStore(STORES.DDS),
        this.clearIndexedDBStore(STORES.USUARIOS),
      ]);

      for (const f of data.funcionarios) await this.putToIndexedDB(STORES.FUNCIONARIOS, f);
      for (const p of data.projetos) await this.putToIndexedDB(STORES.PROJETOS, p);
      for (const s of data.statusList) await this.putToIndexedDB(STORES.STATUS, s);
      if (Array.isArray(data.anexos)) {
        for (const a of data.anexos) await this.putToIndexedDB(STORES.ANEXOS, a);
      }
      if (Array.isArray(data.solicitantes)) {
        for (const sol of data.solicitantes) await this.putToIndexedDB(STORES.SOLICITANTES, sol);
      }
      if (Array.isArray(data.pendencias)) {
        for (const pend of data.pendencias) await this.putToIndexedDB(STORES.PENDENCIAS, pend);
      }
      if (Array.isArray(data.ddsList)) {
        for (const d of data.ddsList) await this.putToIndexedDB(STORES.DDS, d);
      }
      if (Array.isArray(data.usuarios)) {
        for (const u of data.usuarios) await this.putToIndexedDB(STORES.USUARIOS, u);
      }

      this.saveToLocalStorage(STORES.FUNCIONARIOS, data.funcionarios);
      this.saveToLocalStorage(STORES.PROJETOS, data.projetos);
      this.saveToLocalStorage(STORES.STATUS, data.statusList);
      if (data.solicitantes) this.saveToLocalStorage(STORES.SOLICITANTES, data.solicitantes);
      if (data.pendencias) this.saveToLocalStorage(STORES.PENDENCIAS, data.pendencias);
      if (data.ddsList) this.saveToLocalStorage(STORES.DDS, data.ddsList);
      if (data.usuarios) this.saveToLocalStorage(STORES.USUARIOS, data.usuarios);

      return true;
    } catch (err) {
      console.error('Falha ao importar backup:', err);
      return false;
    }
  }

  public async resetDatabase(): Promise<void> {
    await Promise.all([
      this.clearIndexedDBStore(STORES.FUNCIONARIOS),
      this.clearIndexedDBStore(STORES.PROJETOS),
      this.clearIndexedDBStore(STORES.STATUS),
      this.clearIndexedDBStore(STORES.ANEXOS),
      this.clearIndexedDBStore(STORES.SOLICITANTES),
      this.clearIndexedDBStore(STORES.PENDENCIAS),
      this.clearIndexedDBStore(STORES.DDS),
      this.clearIndexedDBStore(STORES.USUARIOS),
    ]);

    for (const f of initialFuncionarios) await this.putToIndexedDB(STORES.FUNCIONARIOS, f);
    for (const p of initialProjetos) await this.putToIndexedDB(STORES.PROJETOS, p);
    for (const s of initialStatuses) await this.putToIndexedDB(STORES.STATUS, s);
    for (const a of initialAnexos) await this.putToIndexedDB(STORES.ANEXOS, a);
    for (const sol of initialSolicitantes) await this.putToIndexedDB(STORES.SOLICITANTES, sol);
    for (const pend of initialPendenciasMelhorias) await this.putToIndexedDB(STORES.PENDENCIAS, pend);
    for (const d of initialDdsList) await this.putToIndexedDB(STORES.DDS, d);
    for (const u of initialUsuarios) await this.putToIndexedDB(STORES.USUARIOS, u);

    this.saveToLocalStorage(STORES.FUNCIONARIOS, initialFuncionarios);
    this.saveToLocalStorage(STORES.PROJETOS, initialProjetos);
    this.saveToLocalStorage(STORES.STATUS, initialStatuses);
    this.saveToLocalStorage(STORES.SOLICITANTES, initialSolicitantes);
    this.saveToLocalStorage(STORES.PENDENCIAS, initialPendenciasMelhorias);
    this.saveToLocalStorage(STORES.DDS, initialDdsList);
    this.saveToLocalStorage(STORES.USUARIOS, initialUsuarios);
  }
}

export const dbService = new LocalDatabase();
