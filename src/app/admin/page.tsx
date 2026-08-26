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
      setMensagem('Cliente cadastrado!');
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
      setMensagem('Motorista cadastrado!');
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
      setMensagem('Projeto cadastrado!');
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
    <div className="max-w-5xl mx-auto my-4 p-4 sm:p-6 bg-white rounded-xl shadow border space-y-6">
      
      {/* CABEÇALHO COM LOGO PROFISSIONAL */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b">
        <div className="flex items-center gap-3">
          <img 
            src="watermarked_img_9035154237853069771.jpg" 
            alt="Sistema Pro Logo" 
            className="h-10 w-auto object-contain rounded"
          />
          <div className="border-l pl-3 border-gray-200">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Painel Administrativo</h1>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              Perfil: Administrador
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded transition border border-red-200"
        >
          🚪 Sair
        </button>
      </div>

      {/* Navegação por Abas */}
      <div className="flex border-b gap-2 overflow-x-auto">
        {(['projeto', 'cliente', 'motorista'] as const).map((abaNome) => (
          <button
            key={abaNome}
            onClick={() => { setAba(abaNome); setMensagem(''); }}
            className={`pb-2 px-3 sm:px-4 text-xs sm:text-sm font-semibold capitalize whitespace-nowrap transition ${
              aba === abaNome ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {abaNome === 'projeto' ? 'Novo Projeto' : `Cadastrar ${abaNome}`}
          </button>
        ))}
      </div>

      {mensagem && (
        <div className="p-3 bg-blue-50 text-blue-700 rounded text-sm font-medium">
          {mensagem}
        </div>
      )}

      {/* Formulários */}
      {aba === 'projeto' && (
        <form onSubmit={handleCadastrarProjeto} className="space-y-3 max-w-xl">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Número do Projeto</label>
            <input
              type="text"
              required
              placeholder="Ex: PRJ-2026-101"
              value={numeroProjeto}
              onChange={(e) => setNumeroProjeto(e.target.value)}
              className="w-full p-2 border rounded text-sm text-black outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Cliente</label>
            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              className="w-full p-2 border rounded text-sm text-black outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione o Cliente...</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Motorista</label>
            <select
              value={motoristaId}
              onChange={(e) => setMotoristaId(e.target.value)}
              className="w-full p-2 border rounded text-sm text-black outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione o Motorista...</option>
              {motoristas.map((m) => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700">
            Criar Projeto
          </button>
        </form>
      )}

      {aba === 'cliente' && (
        <form onSubmit={handleCadastrarCliente} className="space-y-3 max-w-xl">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nome do Cliente</label>
            <input
              type="text"
              required
              placeholder="Digite o nome do cliente"
              value={nomeCliente}
              onChange={(e) => setNomeCliente(e.target.value)}
              className="w-full p-2 border rounded text-sm text-black outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700">
            Salvar Cliente
          </button>
        </form>
      )}

      {aba === 'motorista' && (
        <form onSubmit={handleCadastrarMotorista} className="space-y-3 max-w-xl">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nome do Motorista</label>
            <input
              type="text"
              required
              placeholder="Digite o nome do motorista"
              value={nomeMotorista}
              onChange={(e) => setNomeMotorista(e.target.value)}
              className="w-full p-2 border rounded text-sm text-black outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700">
            Salvar Motorista
          </button>
        </form>
      )}

      {/* Tabela de Projetos + Filtros */}
      <div className="border-t pt-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-lg font-bold text-gray-800">Projetos Cadastrados</h2>
          <button onClick={carregarDados} className="text-xs text-blue-600 hover:text-blue-800 underline">
            🔄 Atualizar
          </button>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="🔍 Buscar por projeto, cliente ou motorista..."
            value={filtroBusca}
            onChange={(e) => setFiltroBusca(e.target.value)}
            className="flex-1 p-2 border rounded text-xs text-black outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="p-2 border rounded text-xs text-black outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos os Status</option>
            <option value="pendente">Pendente</option>
            <option value="entregue">Entregue</option>
          </select>
        </div>

        {/* Lista de Projetos */}
        {carregando ? (
          <p className="text-xs text-gray-500">Carregando...</p>
        ) : projetosFiltrados.length === 0 ? (
          <p className="text-xs text-gray-500">Nenhum projeto encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold uppercase">
                  <th className="p-2.5 border">Projeto</th>
                  <th className="p-2.5 border">Cliente</th>
                  <th className="p-2.5 border">Motorista</th>
                  <th className="p-2.5 border text-center">Status</th>
                  <th className="p-2.5 border text-center">Comprovante</th>
                  <th className="p-2.5 border text-center">GPS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {projetosFiltrados.map((prj) => (
                  <tr key={prj.id} className="hover:bg-slate-50">
                    <td className="p-2.5 border font-semibold text-slate-800">{prj.numero_projeto}</td>
                    <td className="p-2.5 border text-slate-700">{prj.clientes?.nome || '—'}</td>
                    <td className="p-2.5 border text-slate-700">{prj.motoristas?.nome || '—'}</td>
                    <td className="p-2.5 border text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        prj.status === 'entregue' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {prj.status}
                      </span>
                    </td>

                    {/* MINIATURA DO COMPROVANTE */}
                    <td className="p-2.5 border text-center align-middle">
                      {prj.comprovante_url ? (
                        <a 
                          href={prj.comprovante_url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="inline-block hover:opacity-80 transition"
                          title="Clique para abrir foto inteira"
                        >
                          <img 
                            src={prj.comprovante_url} 
                            alt="Comprovante" 
                            className="w-10 h-10 object-cover rounded border shadow-sm mx-auto" 
                          />
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    <td className="p-2.5 border text-center">
                      {prj.latitude && prj.longitude ? (
                        <a
                          href={`https://www.google.com/maps?q=${prj.latitude},${prj.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-green-700 underline font-medium"
                        >
                          📍 Ver Mapa
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
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
