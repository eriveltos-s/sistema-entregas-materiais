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
  clientes: { nome: string } | null;
  motoristas: { nome: string } | null;
}

export default function AdminPage() {
  const [aba, setAba] = useState<'projeto' | 'cliente' | 'motorista'>('projeto');

  // Estados dos Formulários
  const [nomeCliente, setNomeCliente] = useState('');
  const [nomeMotorista, setNomeMotorista] = useState('');
  
  const [numeroProjeto, setNumeroProjeto] = useState('');
  const [clienteId, setClienteId] = useState('');
  const [motoristaId, setMotoristaId] = useState('');

  // Listas do Banco
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Verificação de permissão + Carregamento dos dados
  useEffect(() => {
    const role = localStorage.getItem('user_role');
    if (role !== 'admin') {
      alert('Acesso negado! Esta área é exclusiva para Administradores.');
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
    
    // Busca clientes e motoristas para os selects
    const { data: cData } = await supabase.from('clientes').select('id, nome').order('nome');
    const { data: mData } = await supabase.from('motoristas').select('id, nome').order('nome');
    
    // Busca projetos unindo com clientes e motoristas
    const { data: pData } = await supabase
      .from('projetos')
      .select(`
        id,
        numero_projeto,
        status,
        comprovante_url,
        entregue_em,
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

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-xl shadow-md border space-y-8">
      {/* Cabeçalho com Perfil e Botão Sair */}
      <div className="flex justify-between items-center pb-4 border-b">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Painel Administrativo</h1>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
            Perfil: Administrador
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded transition border border-red-200"
        >
          🚪 Sair / Trocar Perfil
        </button>
      </div>

      <div>
        {/* Navegação por Abas */}
        <div className="flex border-b mb-6 gap-2">
          <button
            onClick={() => { setAba('projeto'); setMensagem(''); }}
            className={`pb-2 px-4 font-semibold text-sm transition ${
              aba === 'projeto' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Novo Projeto
          </button>
          <button
            onClick={() => { setAba('cliente'); setMensagem(''); }}
            className={`pb-2 px-4 font-semibold text-sm transition ${
              aba === 'cliente' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Cadastrar Cliente
          </button>
          <button
            onClick={() => { setAba('motorista'); setMensagem(''); }}
            className={`pb-2 px-4 font-semibold text-sm transition ${
              aba === 'motorista' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Cadastrar Motorista
          </button>
        </div>

        {mensagem && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded text-sm font-medium">
            {mensagem}
          </div>
        )}

        {/* Form de Projetos */}
        {aba === 'projeto' && (
          <form onSubmit={handleCadastrarProjeto} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número do Projeto</label>
              <input
                type="text"
                required
                placeholder="Ex: PRJ-2026-101"
                value={numeroProjeto}
                onChange={(e) => setNumeroProjeto(e.target.value)}
                className="w-full p-2 border rounded text-black outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente Responsável</label>
              <select
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
                className="w-full p-2 border rounded text-black outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione o Cliente...</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Motorista Designado</label>
              <select
                value={motoristaId}
                onChange={(e) => setMotoristaId(e.target.value)}
                className="w-full p-2 border rounded text-black outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione o Motorista...</option>
                {motoristas.map((m) => (
                  <option key={m.id} value={m.id}>{m.nome}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700">
              Criar Projeto
            </button>
          </form>
        )}

        {/* Form de Clientes */}
        {aba === 'cliente' && (
          <form onSubmit={handleCadastrarCliente} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Cliente / Empresa</label>
              <input
                type="text"
                required
                placeholder="Digite o nome do cliente"
                value={nomeCliente}
                onChange={(e) => setNomeCliente(e.target.value)}
                className="w-full p-2 border rounded text-black outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700">
              Salvar Cliente
            </button>
          </form>
        )}

        {/* Form de Motoristas */}
        {aba === 'motorista' && (
          <form onSubmit={handleCadastrarMotorista} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Motorista</label>
              <input
                type="text"
                required
                placeholder="Digite o nome do motorista"
                value={nomeMotorista}
                onChange={(e) => setNomeMotorista(e.target.value)}
                className="w-full p-2 border rounded text-black outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700">
              Salvar Motorista
            </button>
          </form>
        )}
      </div>

      {/* SEÇÃO DA TABELA DE PROJETOS */}
      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Projetos Cadastrados</h2>
          <button
            onClick={carregarDados}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium underline"
          >
            🔄 Atualizar Lista
          </button>
        </div>

        {carregando ? (
          <p className="text-sm text-gray-500">Carregando lista de projetos...</p>
        ) : projetos.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhum projeto cadastrado até o momento.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-gray-200">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-xs uppercase font-semibold">
                  <th className="p-3 border">Projeto</th>
                  <th className="p-3 border">Cliente</th>
                  <th className="p-3 border">Motorista</th>
                  <th className="p-3 border text-center">Status</th>
                  <th className="p-3 border text-center">Comprovante</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-200">
                {projetos.map((prj) => (
                  <tr key={prj.id} className="hover:bg-slate-50">
                    <td className="p-3 border font-semibold text-slate-800">{prj.numero_projeto}</td>
                    <td className="p-3 border text-slate-700">{prj.clientes?.nome || '—'}</td>
                    <td className="p-3 border text-slate-700">{prj.motoristas?.nome || '—'}</td>
                    <td className="p-3 border text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-bold uppercase ${
                          prj.status === 'entregue'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {prj.status}
                      </span>
                    </td>
                    <td className="p-3 border text-center">
                      {prj.comprovante_url ? (
                        <a
                          href={prj.comprovante_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline text-xs font-medium"
                        >
                          Ver Foto
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">Pendente</span>
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