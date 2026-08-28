'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Cliente {
  id: string;
  nome: string;
<<<<<<< HEAD
=======
  email?: string;
  senha?: string;
  created_at?: string;
>>>>>>> 446e0c1 (Atualizacao JL IT - Layout e novas funcionalidades)
}

interface Motorista {
  id: string;
  nome: string;
<<<<<<< HEAD
=======
  created_at?: string;
>>>>>>> 446e0c1 (Atualizacao JL IT - Layout e novas funcionalidades)
}

interface Projeto {
  id: string;
  numero_projeto: string;
<<<<<<< HEAD
  status: string;
  comprovante_url: string | null;
=======
  po_cliente?: string | null;
  po_blackbox?: string | null;
  numero_nf?: number | null;
  pv?: string | null;
  cliente_id?: string | null;
  motorista_id?: string | null;
  status: string;
  comprovante_url: string | null;
  created_at?: string | null;
>>>>>>> 446e0c1 (Atualizacao JL IT - Layout e novas funcionalidades)
  entregue_em: string | null;
  latitude: number | null;
  longitude: number | null;
  clientes: { nome: string } | null;
  motoristas: { nome: string } | null;
}

export default function AdminPage() {
<<<<<<< HEAD
  const [aba, setAba] = useState<'projeto' | 'cliente' | 'motorista'>('projeto');

  // Formulários
  const [nomeCliente, setNomeCliente] = useState('');
  const [nomeMotorista, setNomeMotorista] = useState('');
  const [numeroProjeto, setNumeroProjeto] = useState('');
  const [clienteId, setClienteId] = useState('');
  const [motoristaId, setMotoristaId] = useState('');

  // Filtros da Tabela
  const [filtroBusca, setFiltroBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
=======
  const [aba, setAba] = useState<
    'projeto' | 'cliente' | 'motorista' | 'consultar_clientes' | 'consultar_motoristas'
  >('projeto');

  // Formulários de Cadastro
  const [nomeCliente, setNomeCliente] = useState('');
  const [emailCliente, setEmailCliente] = useState('');
  const [senhaCliente, setSenhaCliente] = useState('');

  const [nomeMotorista, setNomeMotorista] = useState('');
  
  // Campos do Projeto
  const [numeroProjeto, setNumeroProjeto] = useState('');
  const [poCliente, setPoCliente] = useState('');
  const [poBlackbox, setPoBlackbox] = useState('');
  const [numeroNf, setNumeroNf] = useState('');
  const [pv, setPv] = useState('');
  const [clienteId, setClienteId] = useState('');
  const [motoristaId, setMotoristaId] = useState('');

  // Edição de Cliente na Tabela
  const [clienteEditandoId, setClienteEditandoId] = useState<string | null>(null);
  const [editNomeCliente, setEditNomeCliente] = useState('');
  const [editEmailCliente, setEditEmailCliente] = useState('');
  const [editSenhaCliente, setEditSenhaCliente] = useState('');

  // Edição de Motorista na Tabela
  const [motoristaEditandoId, setMotoristaEditandoId] = useState<string | null>(null);
  const [editNomeMotorista, setEditNomeMotorista] = useState('');

  // Edição de Projeto na Tabela
  const [projetoEditandoId, setProjetoEditandoId] = useState<string | null>(null);
  const [editNumeroProjeto, setEditNumeroProjeto] = useState('');
  const [editPoCliente, setEditPoCliente] = useState('');
  const [editPoBlackbox, setEditPoBlackbox] = useState('');
  const [editNumeroNf, setEditNumeroNf] = useState('');
  const [editPv, setEditPv] = useState('');
  const [editClienteIdProjeto, setEditClienteIdProjeto] = useState('');
  const [editMotoristaIdProjeto, setEditMotoristaIdProjeto] = useState('');

  // Modal Lightbox
  const [modalImagemUrl, setModalImagemUrl] = useState<string | null>(null);

  // Filtros Avançados
  const [filtroBusca, setFiltroBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const [buscaCliente, setBuscaCliente] = useState('');
  const [buscaMotorista, setBuscaMotorista] = useState('');
>>>>>>> 446e0c1 (Atualizacao JL IT - Layout e novas funcionalidades)

  // Listas
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('user_role');
    if (role !== 'admin') {
      window.location.href = '/login';
      return;
    }
    carregarDados();
  }, []);

  function handleLogout() {
    localStorage.removeItem('user_role');
    window.location.href = '/login';
  }

  async function carregarDados() {
    setCarregando(true);
<<<<<<< HEAD
    const { data: cData } = await supabase.from('clientes').select('id, nome').order('nome');
    const { data: mData } = await supabase.from('motoristas').select('id, nome').order('nome');
=======
    const { data: cData } = await supabase.from('clientes').select('id, nome, email, senha, created_at').order('nome');
    const { data: mData } = await supabase.from('motoristas').select('id, nome, created_at').order('nome');
>>>>>>> 446e0c1 (Atualizacao JL IT - Layout e novas funcionalidades)
    
    const { data: pData } = await supabase
      .from('projetos')
      .select(`
<<<<<<< HEAD
        id, numero_projeto, status, comprovante_url, entregue_em, latitude, longitude,
=======
        id, numero_projeto, po_cliente, po_blackbox, numero_nf, pv, cliente_id, motorista_id, status, comprovante_url, created_at, entregue_em, latitude, longitude,
>>>>>>> 446e0c1 (Atualizacao JL IT - Layout e novas funcionalidades)
        clientes ( nome ),
        motoristas ( nome )
      `)
      .order('created_at', { ascending: false });

    if (cData) setClientes(cData);
    if (mData) setMotoristas(mData);
    if (pData) {
      const projetosFormatados: Projeto[] = pData.map((p: any) => ({
        ...p,
        clientes: Array.isArray(p.clientes) ? p.clientes[0] : p.clientes,
        motoristas: Array.isArray(p.motoristas) ? p.motoristas[0] : p.motoristas,
      }));
      setProjetos(projetosFormatados);
    }
    setCarregando(false);
  }

<<<<<<< HEAD
  async function handleCadastrarCliente(e: React.FormEvent) {
    e.preventDefault();
    setMensagem('');
    const { error } = await supabase.from('clientes').insert([{ nome: nomeCliente }]);
    if (error) setMensagem(`Erro: ${error.message}`);
    else {
      setMensagem('Cliente cadastrado com sucesso!');
      setNomeCliente('');
=======
  // CADASTRAR CLIENTE
  async function handleCadastrarCliente(e: React.FormEvent) {
    e.preventDefault();
    setMensagem('');

    const { error } = await supabase.from('clientes').insert([
      { 
        nome: nomeCliente,
        email: emailCliente.toLowerCase().trim(),
        senha: senhaCliente
      }
    ]);

    if (error) {
      setMensagem(`Erro ao cadastrar cliente: ${error.message}`);
    } else {
      setMensagem('Cliente cadastrado com sucesso!');
      setNomeCliente('');
      setEmailCliente('');
      setSenhaCliente('');
>>>>>>> 446e0c1 (Atualizacao JL IT - Layout e novas funcionalidades)
      carregarDados();
    }
  }

<<<<<<< HEAD
=======
  // EDIÇÃO DE CLIENTE
  function handleIniciarEdicaoCliente(cli: Cliente) {
    setClienteEditandoId(cli.id);
    setEditNomeCliente(cli.nome);
    setEditEmailCliente(cli.email || '');
    setEditSenhaCliente(cli.senha || '');
  }

  async function handleSalvarCliente(id: string) {
    const { error } = await supabase
      .from('clientes')
      .update({
        nome: editNomeCliente,
        email: editEmailCliente.toLowerCase().trim(),
        senha: editSenhaCliente,
      })
      .eq('id', id);

    if (error) {
      alert(`Erro ao atualizar cliente: ${error.message}`);
    } else {
      setClienteEditandoId(null);
      setMensagem('Dados do cliente atualizados com sucesso!');
      carregarDados();
    }
  }

  // CADASTRAR MOTORISTA
>>>>>>> 446e0c1 (Atualizacao JL IT - Layout e novas funcionalidades)
  async function handleCadastrarMotorista(e: React.FormEvent) {
    e.preventDefault();
    setMensagem('');
    const { error } = await supabase.from('motoristas').insert([{ nome: nomeMotorista }]);
    if (error) setMensagem(`Erro: ${error.message}`);
    else {
      setMensagem('Motorista cadastrado com sucesso!');
      setNomeMotorista('');
      carregarDados();
    }
  }

<<<<<<< HEAD
=======
  // EDIÇÃO DE MOTORISTA
  function handleIniciarEdicaoMotorista(mot: Motorista) {
    setMotoristaEditandoId(mot.id);
    setEditNomeMotorista(mot.nome);
  }

  async function handleSalvarMotorista(id: string) {
    if (!editNomeMotorista.trim()) {
      alert('O nome do motorista não pode ficar em branco.');
      return;
    }

    const { error } = await supabase
      .from('motoristas')
      .update({ nome: editNomeMotorista })
      .eq('id', id);

    if (error) {
      alert(`Erro ao atualizar motorista: ${error.message}`);
    } else {
      setMotoristaEditandoId(null);
      setMensagem('Dados do motorista atualizados com sucesso!');
      carregarDados();
    }
  }

  // CADASTRAR PROJETO
>>>>>>> 446e0c1 (Atualizacao JL IT - Layout e novas funcionalidades)
  async function handleCadastrarProjeto(e: React.FormEvent) {
    e.preventDefault();
    setMensagem('');
    const { error } = await supabase.from('projetos').insert([
      {
        numero_projeto: numeroProjeto,
<<<<<<< HEAD
=======
        po_cliente: poCliente || null,
        po_blackbox: poBlackbox || null,
        numero_nf: numeroNf ? parseInt(numeroNf) : null,
        pv: pv || null,
>>>>>>> 446e0c1 (Atualizacao JL IT - Layout e novas funcionalidades)
        cliente_id: clienteId || null,
        motorista_id: motoristaId || null,
        status: 'pendente',
      },
    ]);
    if (error) setMensagem(`Erro: ${error.message}`);
    else {
      setMensagem('Projeto cadastrado com sucesso!');
      setNumeroProjeto('');
<<<<<<< HEAD
=======
      setPoCliente('');
      setPoBlackbox('');
      setNumeroNf('');
      setPv('');
>>>>>>> 446e0c1 (Atualizacao JL IT - Layout e novas funcionalidades)
      setClienteId('');
      setMotoristaId('');
      carregarDados();
    }
  }

<<<<<<< HEAD
  // Projetos filtrados na busca
  const projetosFiltrados = projetos.filter((prj) => {
    const textoMatch =
      prj.numero_projeto.toLowerCase().includes(filtroBusca.toLowerCase()) ||
=======
  // EDIÇÃO DE PROJETO
  function handleIniciarEdicaoProjeto(prj: Projeto) {
    setProjetoEditandoId(prj.id);
    setEditNumeroProjeto(prj.numero_projeto);
    setEditPoCliente(prj.po_cliente || '');
    setEditPoBlackbox(prj.po_blackbox || '');
    setEditNumeroNf(prj.numero_nf ? String(prj.numero_nf) : '');
    setEditPv(prj.pv || '');
    setEditClienteIdProjeto(prj.cliente_id || '');
    setEditMotoristaIdProjeto(prj.motorista_id || '');
  }

  async function handleSalvarProjeto(id: string) {
    const { error } = await supabase
      .from('projetos')
      .update({
        numero_projeto: editNumeroProjeto,
        po_cliente: editPoCliente || null,
        po_blackbox: editPoBlackbox || null,
        numero_nf: editNumeroNf ? parseInt(editNumeroNf) : null,
        pv: editPv || null,
        cliente_id: editClienteIdProjeto || null,
        motorista_id: editMotoristaIdProjeto || null,
      })
      .eq('id', id);

    if (error) {
      alert(`Erro ao atualizar projeto: ${error.message}`);
    } else {
      setProjetoEditandoId(null);
      setMensagem('Dados do projeto atualizados com sucesso!');
      carregarDados();
    }
  }

  // EXCLUSÕES
  async function handleExcluirCliente(id: string, nome: string) {
    if (!confirm(`Tem certeza que deseja excluir o cliente "${nome}"?`)) return;
    const { error } = await supabase.from('clientes').delete().eq('id', id);
    if (error) alert(`Erro ao excluir: ${error.message}`);
    else {
      setClientes(clientes.filter((c) => c.id !== id));
      setMensagem(`Cliente ${nome} excluído.`);
    }
  }

  async function handleExcluirMotorista(id: string, nome: string) {
    if (!confirm(`Tem certeza que deseja excluir o motorista "${nome}"?`)) return;
    const { error } = await supabase.from('motoristas').delete().eq('id', id);
    if (error) alert(`Erro ao excluir: ${error.message}`);
    else {
      setMotoristas(motoristas.filter((m) => m.id !== id));
      setMensagem(`Motorista ${nome} excluído.`);
    }
  }

  async function handleExcluirProjeto(id: string, numero: string) {
    if (!confirm(`Tem certeza que deseja excluir o projeto ${numero}?`)) return;
    const { error } = await supabase.from('projetos').delete().eq('id', id);
    if (error) alert(`Erro ao excluir: ${error.message}`);
    else {
      setProjetos(projetos.filter((p) => p.id !== id));
      setMensagem(`Projeto ${numero} excluído.`);
    }
  }

  async function handleAlterarStatus(id: string, novoStatus: string) {
    const { error } = await supabase
      .from('projetos')
      .update({ status: novoStatus })
      .eq('id', id);

    if (error) alert(`Erro ao atualizar status: ${error.message}`);
    else {
      setProjetos(projetos.map((p) => (p.id === id ? { ...p, status: novoStatus } : p)));
    }
  }

  // FILTRAGEM AVANÇADA POR TEXTO, STATUS E DATAS
  const projetosFiltrados = projetos.filter((prj) => {
    const textoMatch =
      prj.numero_projeto.toLowerCase().includes(filtroBusca.toLowerCase()) ||
      prj.po_cliente?.toLowerCase().includes(filtroBusca.toLowerCase()) ||
      prj.po_blackbox?.toLowerCase().includes(filtroBusca.toLowerCase()) ||
      String(prj.numero_nf || '').includes(filtroBusca) ||
      prj.pv?.toLowerCase().includes(filtroBusca.toLowerCase()) ||
>>>>>>> 446e0c1 (Atualizacao JL IT - Layout e novas funcionalidades)
      prj.clientes?.nome?.toLowerCase().includes(filtroBusca.toLowerCase()) ||
      prj.motoristas?.nome?.toLowerCase().includes(filtroBusca.toLowerCase());

    const statusMatch = filtroStatus === 'todos' || prj.status === filtroStatus;

<<<<<<< HEAD
    return textoMatch && statusMatch;
  });

  return (
    <div className="max-w-5xl mx-auto my-6 p-4 sm:p-8 bg-white rounded-2xl shadow-sm border border-slate-200 space-y-6">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <img 
            src="watermarked_img_9035154237853069771.jpg" 
            alt="Sistema Pro Logo" 
            className="h-10 w-auto object-contain rounded"
          />
          <div className="border-l pl-3 border-slate-200">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Painel Administrativo</h1>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              Perfil: Administrador
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="text-xs font-semibold bg-slate-50 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 px-3.5 py-2 rounded-lg transition border border-slate-200 shadow-2xs"
        >
          🚪 Sair
        </button>
      </div>

      {/* NAVEGAÇÃO POR ABAS (ESTILO PÍLULAS) */}
      <div className="flex bg-slate-100/80 p-1 rounded-xl gap-1 overflow-x-auto border border-slate-200/60">
        {(['projeto', 'cliente', 'motorista'] as const).map((abaNome) => (
          <button
            key={abaNome}
            onClick={() => { setAba(abaNome); setMensagem(''); }}
            className={`py-2 px-4 text-xs font-semibold capitalize rounded-lg transition-all duration-150 whitespace-nowrap ${
              aba === abaNome 
                ? 'bg-white text-blue-600 shadow-sm font-bold' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            {abaNome === 'projeto' ? '➕ Novo Projeto' : `➕ Cadastrar ${abaNome}`}
          </button>
        ))}
      </div>

      {mensagem && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
          <span>✅</span> {mensagem}
        </div>
      )}

      {/* FORMULÁRIOS */}
      <div className="bg-slate-50/50 p-4 sm:p-5 rounded-xl border border-slate-200/80">
        {aba === 'projeto' && (
          <form onSubmit={handleCadastrarProjeto} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Número do Projeto</label>
              <input
                type="text"
                required
                placeholder="Ex: PRJ-2026-101"
                value={numeroProjeto}
                onChange={(e) => setNumeroProjeto(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cliente</label>
                <select
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="">Selecione o Cliente...</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Motorista</label>
                <select
                  value={motoristaId}
                  onChange={(e) => setMotoristaId(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="">Selecione o Motorista...</option>
                  {motoristas.map((m) => (
                    <option key={m.id} value={m.id}>{m.nome}</option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-xs font-bold transition shadow-sm hover:shadow active:scale-[0.99]">
              Criar Projeto
            </button>
          </form>
        )}

        {aba === 'cliente' && (
          <form onSubmit={handleCadastrarCliente} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nome do Cliente</label>
              <input
                type="text"
                required
                placeholder="Digite o nome do cliente"
                value={nomeCliente}
                onChange={(e) => setNomeCliente(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-xs font-bold transition shadow-sm hover:shadow active:scale-[0.99]">
              Salvar Cliente
            </button>
          </form>
        )}

        {aba === 'motorista' && (
          <form onSubmit={handleCadastrarMotorista} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nome do Motorista</label>
              <input
                type="text"
                required
                placeholder="Digite o nome do motorista"
                value={nomeMotorista}
                onChange={(e) => setNomeMotorista(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-xs font-bold transition shadow-sm hover:shadow active:scale-[0.99]">
              Salvar Motorista
            </button>
          </form>
        )}
      </div>

      {/* TABELA DE PROJETOS E FILTROS */}
      <div className="pt-2 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-base font-bold text-slate-800">Projetos Cadastrados</h2>
          <button onClick={carregarDados} className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 transition">
            🔄 Atualizar Tabela
          </button>
        </div>

        {/* BARRA DE FILTROS */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="🔍 Buscar por projeto, cliente ou motorista..."
            value={filtroBusca}
            onChange={(e) => setFiltroBusca(e.target.value)}
            className="flex-1 p-2.5 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="p-2.5 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="todos">Todos os Status</option>
            <option value="pendente">Pendente</option>
            <option value="entregue">Entregue</option>
          </select>
        </div>

        {/* LISTA E TABELA REFINADA */}
        {carregando ? (
          <p className="text-xs text-slate-500 py-4 text-center">Carregando dados...</p>
        ) : projetosFiltrados.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center border rounded-lg border-dashed">Nenhum projeto encontrado.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3">Projeto</th>
                  <th className="p-3">Cliente</th>
                  <th className="p-3">Motorista</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Comprovante</th>
                  <th className="p-3 text-center">GPS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {projetosFiltrados.map((prj) => (
                  <tr key={prj.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-semibold text-slate-900">{prj.numero_projeto}</td>
                    <td className="p-3 text-slate-600">{prj.clientes?.nome || '—'}</td>
                    <td className="p-3 text-slate-600">{prj.motoristas?.nome || '—'}</td>
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        prj.status === 'entregue' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {prj.status}
                      </span>
                    </td>

                    <td className="p-3 text-center align-middle">
                      {prj.comprovante_url ? (
                        <a 
                          href={prj.comprovante_url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="inline-block hover:scale-105 transition transform"
                          title="Clique para abrir foto inteira"
                        >
                          <img 
                            src={prj.comprovante_url} 
                            alt="Comprovante" 
                            className="w-9 h-9 object-cover rounded-md border border-slate-200 shadow-2xs mx-auto" 
                          />
                        </a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="p-3 text-center">
                      {prj.latitude && prj.longitude ? (
                        <a
                          href={`https://www.google.com/maps?q=${prj.latitude},${prj.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 hover:text-emerald-900 font-semibold underline text-[11px]"
                        >
                          📍 Ver Mapa
                        </a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
=======
    let dataMatch = true;
    const dataProjeto = prj.created_at ? new Date(prj.created_at) : null;

    if (dataInicio && dataProjeto) {
      dataMatch = dataMatch && dataProjeto >= new Date(`${dataInicio}T00:00:00`);
    }
    if (dataFim && dataProjeto) {
      dataMatch = dataMatch && dataProjeto <= new Date(`${dataFim}T23:59:59`);
    }

    return textoMatch && statusMatch && dataMatch;
  });

  // EXPORTAÇÃO EXCEL (.CSV)
  function handleExportarExcel() {
    if (projetosFiltrados.length === 0) {
      alert('Nenhum dado para exportar.');
      return;
    }

    const cabecalho = ['Projeto', 'PO Cliente', 'PO Blackbox', 'N NF', 'PV', 'Cliente', 'Motorista', 'Status', 'Entregue Em', 'Comprovante URL'];
    const linhas = projetosFiltrados.map((p) => [
      `"${p.numero_projeto}"`,
      `"${p.po_cliente || ''}"`,
      `"${p.po_blackbox || ''}"`,
      `"${p.numero_nf || ''}"`,
      `"${p.pv || ''}"`,
      `"${p.clientes?.nome || ''}"`,
      `"${p.motoristas?.nome || ''}"`,
      `"${p.status.toUpperCase()}"`,
      `"${p.entregue_em ? new Date(p.entregue_em).toLocaleString('pt-BR') : ''}"`,
      `"${p.comprovante_url || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [cabecalho.join(','), ...linhas.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Relatorio_JL_IT_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // EXPORTAÇÃO PDF DINÂMICA
  async function handleExportarPDF() {
    if (projetosFiltrados.length === 0) {
      alert('Nenhum dado para exportar.');
      return;
    }

    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

      const doc = new jsPDF();

      // Cabeçalho PDF
      doc.setFontSize(18);
      doc.text('JL IT — Relatorio de Entregas e Projetos', 14, 20);
      doc.setFontSize(10);
      doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 28);
      doc.text(`Total de Registros: ${projetosFiltrados.length}`, 14, 34);

      const tableData = projetosFiltrados.map((p) => [
        p.numero_projeto,
        p.po_cliente || '—',
        p.numero_nf || '—',
        p.clientes?.nome || '—',
        p.motoristas?.nome || '—',
        p.status.toUpperCase(),
        p.entregue_em ? new Date(p.entregue_em).toLocaleDateString('pt-BR') : '—',
      ]);

      autoTable(doc, {
        startY: 40,
        head: [['Projeto', 'PO Cliente', 'Nº NF', 'Cliente', 'Motorista', 'Status', 'Data Entrega']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [16, 185, 129] },
      });

      doc.save(`Relatorio_JL_IT_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      alert('Para exportar em PDF com formatação avançada, verifique a conexão.');
    }
  }

  const clientesFiltrados = clientes.filter((c) =>
    c.nome.toLowerCase().includes(buscaCliente.toLowerCase()) ||
    c.email?.toLowerCase().includes(buscaCliente.toLowerCase())
  );

  const motoristasFiltrados = motoristas.filter((m) =>
    m.nome.toLowerCase().includes(buscaMotorista.toLowerCase())
  );

  const totalProjetos = projetos.length;
  const entregues = projetos.filter((p) => p.status === 'entregue').length;
  const pendentes = projetos.filter((p) => p.status !== 'entregue').length;
  const taxaEntrega = totalProjetos > 0 ? Math.round((entregues / totalProjetos) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* CABEÇALHO */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800 backdrop-blur-md shadow-xl">
          <div className="flex items-center gap-4">
            <img 
              src="LOGO.jpg" 
              alt="Logo JL IT" 
              className="h-11 w-auto object-contain rounded-lg border border-slate-700/80 shadow-md p-1 bg-slate-900"
            />
            <div className="border-l border-slate-800 pl-4">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">JL IT — Painel Administrativo</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-medium text-slate-400">Sistema Conectado & Live</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="text-xs font-semibold bg-slate-800/80 text-slate-300 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 px-4 py-2.5 rounded-xl transition-all duration-200 border border-slate-700/80 shadow-sm flex items-center gap-2"
          >
            <span>🚪</span> Sair da Conta
          </button>
        </div>

        {/* CARDS DE ESTATÍSTICAS (KPIs) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-2xl shadow-lg relative overflow-hidden group">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Projetos</p>
            <p className="text-3xl font-black text-white mt-1">{totalProjetos}</p>
            <p className="text-[11px] text-slate-500 mt-1">Registrados no sistema</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-2xl shadow-lg relative overflow-hidden group">
            <p className="text-xs font-medium text-amber-400/90 uppercase tracking-wider">Em Andamento</p>
            <p className="text-3xl font-black text-amber-400 mt-1">{pendentes}</p>
            <p className="text-[11px] text-slate-500 mt-1">Aguardando entrega</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-2xl shadow-lg relative overflow-hidden group">
            <p className="text-xs font-medium text-emerald-400/90 uppercase tracking-wider">Entregues</p>
            <p className="text-3xl font-black text-emerald-400 mt-1">{entregues}</p>
            <p className="text-[11px] text-slate-500 mt-1">Com comprovante/GPS</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-2xl shadow-lg relative overflow-hidden group">
            <p className="text-xs font-medium text-teal-400/90 uppercase tracking-wider">Taxa de Conclusão</p>
            <p className="text-3xl font-black text-teal-400 mt-1">{taxaEntrega}%</p>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500" style={{ width: `${taxaEntrega}%` }}></div>
            </div>
          </div>
        </div>

        {/* NAVEGAÇÃO POR ABAS */}
        <div className="flex bg-slate-900/80 p-1.5 rounded-2xl gap-1.5 overflow-x-auto border border-slate-800 shadow-inner">
          {[
            { id: 'projeto', label: '⚡ Novo Projeto' },
            { id: 'cliente', label: '👤 Cadastrar Cliente' },
            { id: 'motorista', label: '🚚 Cadastrar Motorista' },
            { id: 'consultar_clientes', label: '👥 Consultar Clientes' },
            { id: 'consultar_motoristas', label: '🚛 Consultar Motoristas' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { 
                setAba(item.id as any); 
                setMensagem(''); 
                setClienteEditandoId(null);
                setMotoristaEditandoId(null);
                setProjetoEditandoId(null);
              }}
              className={`py-2.5 px-4 text-xs font-bold rounded-xl transition-all duration-200 whitespace-nowrap ${
                aba === item.id 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md font-extrabold' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {mensagem && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl text-xs font-semibold flex items-center gap-3 backdrop-blur-md">
            <span className="text-lg">✅</span> {mensagem}
          </div>
        )}

        {/* FORMULÁRIOS E CONSULTAS */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800/90 shadow-xl backdrop-blur-md">
          
          {/* ABA: NOVO PROJETO */}
          {aba === 'projeto' && (
            <form onSubmit={handleCadastrarProjeto} className="space-y-4 max-w-3xl">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">Cadastrar Novo Projeto</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Número do Projeto *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: PRJ-2026-101"
                    value={numeroProjeto}
                    onChange={(e) => setNumeroProjeto(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">PO Cliente (máx 15 chars)</label>
                  <input
                    type="text"
                    maxLength={15}
                    placeholder="Ex: PO-CLI-12345"
                    value={poCliente}
                    onChange={(e) => setPoCliente(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">PO Blackbox (máx 10 chars)</label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="Ex: BBOX-99"
                    value={poBlackbox}
                    onChange={(e) => setPoBlackbox(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Nº Nota Fiscal (até 7 dígitos)</label>
                  <input
                    type="number"
                    max={9999999}
                    placeholder="Ex: 1234567"
                    value={numeroNf}
                    onChange={(e) => setNumeroNf(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">PV (máx 10 chars)</label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="Ex: PV-8840"
                    value={pv}
                    onChange={(e) => setPv(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Cliente Vinculado</label>
                  <select
                    value={clienteId}
                    onChange={(e) => setClienteId(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500 transition"
                  >
                    <option value="">Selecione o Cliente...</option>
                    {clientes.map((c) => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Motorista Designado</label>
                  <select
                    value={motoristaId}
                    onChange={(e) => setMotoristaId(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500 transition"
                  >
                    <option value="">Selecione o Motorista...</option>
                    {motoristas.map((m) => (
                      <option key={m.id} value={m.id}>{m.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black py-3 rounded-xl text-xs transition-all shadow-lg active:scale-[0.99] mt-2">
                Criar Projeto
              </button>
            </form>
          )}

          {/* ABA: CADASTRAR CLIENTE */}
          {aba === 'cliente' && (
            <form onSubmit={handleCadastrarCliente} className="space-y-4 max-w-xl">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">Cadastrar Novo Cliente</h2>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Nome do Cliente / Razão Social</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Empresa Silva Ltda"
                  value={nomeCliente}
                  onChange={(e) => setNomeCliente(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500 transition"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">E-mail de Acesso</label>
                  <input
                    type="email"
                    required
                    placeholder="cliente@empresa.com"
                    value={emailCliente}
                    onChange={(e) => setEmailCliente(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Senha de Acesso</label>
                  <input
                    type="password"
                    required
                    placeholder="Senha do cliente"
                    value={senhaCliente}
                    onChange={(e) => setSenhaCliente(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black py-3 rounded-xl text-xs transition-all shadow-lg active:scale-[0.99]">
                Cadastrar Cliente
              </button>
            </form>
          )}

          {/* ABA: CADASTRAR MOTORISTA */}
          {aba === 'motorista' && (
            <form onSubmit={handleCadastrarMotorista} className="space-y-4 max-w-xl">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">Cadastrar Novo Motorista</h2>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Nome Completo do Motorista</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Eduardo Silva"
                  value={nomeMotorista}
                  onChange={(e) => setNomeMotorista(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500 transition"
                />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black py-3 rounded-xl text-xs transition-all shadow-lg active:scale-[0.99]">
                Salvar Motorista
              </button>
            </form>
          )}

          {/* ABA: CONSULTAR CLIENTES */}
          {aba === 'consultar_clientes' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Clientes Cadastrados ({clientesFiltrados.length})</h2>
                <input
                  type="text"
                  placeholder="🔍 Buscar cliente..."
                  value={buscaCliente}
                  onChange={(e) => setBuscaCliente(e.target.value)}
                  className="w-full sm:w-72 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="p-3.5">Nome / Razão Social</th>
                      <th className="p-3.5">E-mail</th>
                      <th className="p-3.5">Senha</th>
                      <th className="p-3.5 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {clientesFiltrados.map((cli) => {
                      const estaEditando = clienteEditandoId === cli.id;
                      return (
                        <tr key={cli.id} className="hover:bg-slate-900/50 transition">
                          <td className="p-3.5 font-medium text-slate-200">
                            {estaEditando ? (
                              <input type="text" value={editNomeCliente} onChange={(e) => setEditNomeCliente(e.target.value)} className="w-full p-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white" />
                            ) : cli.nome}
                          </td>
                          <td className="p-3.5 text-slate-400">
                            {estaEditando ? (
                              <input type="email" value={editEmailCliente} onChange={(e) => setEditEmailCliente(e.target.value)} className="w-full p-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white" />
                            ) : cli.email || '—'}
                          </td>
                          <td className="p-3.5 text-slate-400">
                            {estaEditando ? (
                              <input type="text" value={editSenhaCliente} onChange={(e) => setEditSenhaCliente(e.target.value)} className="w-full p-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white" />
                            ) : <span className="font-mono text-slate-600">••••••••</span>}
                          </td>
                          <td className="p-3.5 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {estaEditando ? (
                                <>
                                  <button onClick={() => handleSalvarCliente(cli.id)} className="bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold">💾 Salvar</button>
                                  <button onClick={() => setClienteEditandoId(null)} className="bg-slate-800 text-slate-300 px-2 py-1 rounded-lg text-[11px]">❌</button>
                                </>
                              ) : (
                                <>
                                  <button onClick={() => handleIniciarEdicaoCliente(cli)} className="text-blue-400 hover:text-blue-300 p-1">✏️</button>
                                  <button onClick={() => handleExcluirCliente(cli.id, cli.nome)} className="text-rose-400 hover:text-rose-300 p-1">🗑️</button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ABA: CONSULTAR MOTORISTAS */}
          {aba === 'consultar_motoristas' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Motoristas Cadastrados ({motoristasFiltrados.length})</h2>
                <input
                  type="text"
                  placeholder="🔍 Buscar motorista..."
                  value={buscaMotorista}
                  onChange={(e) => setBuscaMotorista(e.target.value)}
                  className="w-full sm:w-72 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="p-3.5">Nome do Motorista</th>
                      <th className="p-3.5 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {motoristasFiltrados.map((mot) => {
                      const estaEditando = motoristaEditandoId === mot.id;
                      return (
                        <tr key={mot.id} className="hover:bg-slate-900/50 transition">
                          <td className="p-3.5 font-medium text-slate-200">
                            {estaEditando ? (
                              <input type="text" value={editNomeMotorista} onChange={(e) => setEditNomeMotorista(e.target.value)} className="w-full sm:w-80 p-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white" />
                            ) : mot.nome}
                          </td>
                          <td className="p-3.5 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {estaEditando ? (
                                <>
                                  <button onClick={() => handleSalvarMotorista(mot.id)} className="bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold">💾 Salvar</button>
                                  <button onClick={() => setMotoristaEditandoId(null)} className="bg-slate-800 text-slate-300 px-2 py-1 rounded-lg text-[11px]">❌</button>
                                </>
                              ) : (
                                <>
                                  <button onClick={() => handleIniciarEdicaoMotorista(mot)} className="text-blue-400 hover:text-blue-300 p-1">✏️</button>
                                  <button onClick={() => handleExcluirMotorista(mot.id, mot.nome)} className="text-rose-400 hover:text-rose-300 p-1">🗑️</button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* BARRA DE FILTROS AVANÇADOS E BOTÕES DE EXPORTAÇÃO */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="text-base font-bold text-white tracking-tight">Projetos & Acompanhamento de Entregas</h2>
            
            {/* BOTÕES DE EXPORTAÇÃO */}
            <div className="flex items-center gap-2">
              <button 
                onClick={handleExportarExcel}
                className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                📊 Exportar Excel (.csv)
              </button>
              <button 
                onClick={handleExportarPDF}
                className="bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 border border-rose-500/30 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                📄 Exportar PDF
              </button>
              <button onClick={carregarDados} className="text-xs text-slate-400 hover:text-white font-semibold flex items-center gap-1 transition ml-2">
                🔄 Atualizar
              </button>
            </div>
          </div>

          {/* PAINEL DE FILTROS COM BUSCA + DATA INÍCIO E DATA FIM */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Buscar por Texto</label>
              <input
                type="text"
                placeholder="🔍 Projeto, PO, NF, PV, cliente ou motorista..."
                value={filtroBusca}
                onChange={(e) => setFiltroBusca(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Data Início</label>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Data Fim</label>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* TABELA PRINCIPAL DE PROJETOS */}
          {carregando ? (
            <p className="text-xs text-slate-500 py-8 text-center">Carregando dados...</p>
          ) : projetosFiltrados.length === 0 ? (
            <p className="text-xs text-slate-500 py-10 text-center border rounded-2xl border-dashed border-slate-800">Nenhum projeto encontrado para os filtros selecionados.</p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-md">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3.5">Projeto</th>
                    <th className="p-3.5">PO Cliente</th>
                    <th className="p-3.5">PO Blackbox</th>
                    <th className="p-3.5">Nº NF</th>
                    <th className="p-3.5">PV</th>
                    <th className="p-3.5">Cliente</th>
                    <th className="p-3.5">Motorista</th>
                    <th className="p-3.5 text-center">Status</th>
                    <th className="p-3.5 text-center">Comprovante</th>
                    <th className="p-3.5 text-center">GPS</th>
                    <th className="p-3.5 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {projetosFiltrados.map((prj) => {
                    const estaEditando = projetoEditandoId === prj.id;
                    const isEntregue = prj.status === 'entregue';

                    return (
                      <tr key={prj.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 font-bold text-white">
                          {estaEditando ? (
                            <input type="text" value={editNumeroProjeto} onChange={(e) => setEditNumeroProjeto(e.target.value)} className="w-24 p-1 bg-slate-950 border border-slate-700 rounded text-xs text-white" />
                          ) : prj.numero_projeto}
                        </td>

                        <td className="p-3.5 text-slate-300">
                          {estaEditando ? (
                            <input type="text" maxLength={15} value={editPoCliente} onChange={(e) => setEditPoCliente(e.target.value)} className="w-24 p-1 bg-slate-950 border border-slate-700 rounded text-xs text-white" />
                          ) : prj.po_cliente || '—'}
                        </td>

                        <td className="p-3.5 text-slate-300">
                          {estaEditando ? (
                            <input type="text" maxLength={10} value={editPoBlackbox} onChange={(e) => setEditPoBlackbox(e.target.value)} className="w-20 p-1 bg-slate-950 border border-slate-700 rounded text-xs text-white" />
                          ) : prj.po_blackbox || '—'}
                        </td>

                        <td className="p-3.5 text-slate-300">
                          {estaEditando ? (
                            <input type="number" value={editNumeroNf} onChange={(e) => setEditNumeroNf(e.target.value)} className="w-20 p-1 bg-slate-950 border border-slate-700 rounded text-xs text-white" />
                          ) : prj.numero_nf || '—'}
                        </td>

                        <td className="p-3.5 text-slate-300">
                          {estaEditando ? (
                            <input type="text" maxLength={10} value={editPv} onChange={(e) => setEditPv(e.target.value)} className="w-20 p-1 bg-slate-950 border border-slate-700 rounded text-xs text-white" />
                          ) : prj.pv || '—'}
                        </td>

                        <td className="p-3.5 text-slate-300">
                          {estaEditando ? (
                            <select value={editClienteIdProjeto} onChange={(e) => setEditClienteIdProjeto(e.target.value)} className="w-28 p-1 bg-slate-950 border border-slate-700 rounded text-xs text-white">
                              <option value="">Selecione...</option>
                              {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                            </select>
                          ) : prj.clientes?.nome || '—'}
                        </td>

                        <td className="p-3.5 text-slate-300">
                          {estaEditando ? (
                            <select value={editMotoristaIdProjeto} onChange={(e) => setEditMotoristaIdProjeto(e.target.value)} className="w-28 p-1 bg-slate-950 border border-slate-700 rounded text-xs text-white">
                              <option value="">Selecione...</option>
                              {motoristas.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}
                            </select>
                          ) : prj.motoristas?.nome || '—'}
                        </td>

                        <td className="p-3.5 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                            isEntregue 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isEntregue ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                            {prj.status}
                          </span>
                        </td>

                        <td className="p-3.5 text-center align-middle">
                          {prj.comprovante_url ? (
                            <button 
                              onClick={() => setModalImagemUrl(prj.comprovante_url)}
                              className="inline-block hover:scale-110 transition-transform"
                              title="Clique para ampliar"
                            >
                              <img src={prj.comprovante_url} alt="Comprovante" className="w-9 h-9 object-cover rounded-lg border border-slate-700 shadow-md mx-auto" />
                            </button>
                          ) : <span className="text-slate-600">—</span>}
                        </td>

                        <td className="p-3.5 text-center">
                          {prj.latitude && prj.longitude ? (
                            <a href={`https://www.google.com/maps?q=${prj.latitude},${prj.longitude}`} target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-300 font-semibold underline text-[11px]">
                              📍 Ver Mapa
                            </a>
                          ) : <span className="text-slate-600">—</span>}
                        </td>

                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {estaEditando ? (
                              <>
                                <button onClick={() => handleSalvarProjeto(prj.id)} className="bg-emerald-600 text-white p-1.5 rounded-lg text-xs font-bold">💾</button>
                                <button onClick={() => setProjetoEditandoId(null)} className="bg-slate-800 text-slate-300 p-1.5 rounded-lg text-xs">❌</button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => handleIniciarEdicaoProjeto(prj)} className="text-blue-400 hover:text-blue-300 p-1 text-xs">✏️</button>
                                <button onClick={() => handleExcluirProjeto(prj.id, prj.numero_projeto)} className="text-rose-400 hover:text-rose-300 p-1 text-xs">🗑️</button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* LIGHTBOX MODAL */}
        {modalImagemUrl && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <div className="relative max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-2">
              <button 
                onClick={() => setModalImagemUrl(null)} 
                className="absolute top-4 right-4 bg-slate-800/80 text-white hover:bg-rose-600 p-2 rounded-full text-xs font-bold transition z-10"
              >
                ✖ Fechar
              </button>
              <img src={modalImagemUrl} alt="Comprovante Ampliado" className="w-full max-h-[80vh] object-contain rounded-xl mx-auto" />
            </div>
          </div>
        )}

>>>>>>> 446e0c1 (Atualizacao JL IT - Layout e novas funcionalidades)
      </div>
    </div>
  );
}
