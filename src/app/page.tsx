'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Cliente {
  id: string;
  nome: string;
}

interface Motorista {
  id: string;
  nome: string;
}

interface Projeto {
  id: string;
  numero_projeto: string;
  status: string;
  comprovante_url: string | null;
  entregue_em: string | null;
  latitude: number | null;
  longitude: number | null;
  clientes: { nome: string } | null;
  motoristas: { nome: string } | null;
}

export default function AdminPage() {
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
    const { data: cData } = await supabase.from('clientes').select('id, nome').order('nome');
    const { data: mData } = await supabase.from('motoristas').select('id, nome').order('nome');
    
    const { data: pData } = await supabase
      .from('projetos')
      .select(`
        id, numero_projeto, status, comprovante_url, entregue_em, latitude, longitude,
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

  async function handleCadastrarCliente(e: React.FormEvent) {
    e.preventDefault();
    setMensagem('');
    const { error } = await supabase.from('clientes').insert([{ nome: nomeCliente }]);
    if (error) setMensagem(`Erro: ${error.message}`);
    else {
      setMensagem('Cliente cadastrado com sucesso!');
      setNomeCliente('');
      carregarDados();
    }
  }

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

  async function handleCadastrarProjeto(e: React.FormEvent) {
    e.preventDefault();
    setMensagem('');
    const { error } = await supabase.from('projetos').insert([
      {
        numero_projeto: numeroProjeto,
        cliente_id: clienteId || null,
        motorista_id: motoristaId || null,
        status: 'pendente',
      },
    ]);
    if (error) setMensagem(`Erro: ${error.message}`);
    else {
      setMensagem('Projeto cadastrado com sucesso!');
      setNumeroProjeto('');
      setClienteId('');
      setMotoristaId('');
      carregarDados();
    }
  }

  // Projetos filtrados na busca
  const projetosFiltrados = projetos.filter((prj) => {
    const textoMatch =
      prj.numero_projeto.toLowerCase().includes(filtroBusca.toLowerCase()) ||
      prj.clientes?.nome?.toLowerCase().includes(filtroBusca.toLowerCase()) ||
      prj.motoristas?.nome?.toLowerCase().includes(filtroBusca.toLowerCase());

    const statusMatch = filtroStatus === 'todos' || prj.status === filtroStatus;

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
      </div>
    </div>
  );
}
