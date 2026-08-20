'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ProjectDetail {
  numero_projeto: string;
  status: string;
  comprovante_url: string | null;
  entregue_em: string | null;
  clientes: {
    nome: string;
  } | null;
}

export default function ClientePage() {
  const [numeroBusca, setNumeroBusca] = useState('');
  const [projeto, setProjeto] = useState<ProjectDetail | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  // Verificação de permissão
  useEffect(() => {
    const role = localStorage.getItem('user_role');
    if (role !== 'cliente' && role !== 'admin') {
      alert('Acesso negado! Seu perfil não tem permissão para acessar a tela do cliente.');
      window.location.href = '/login';
      return;
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem('user_role');
    window.location.href = '/login';
  }

  async function handleBuscar(e: React.FormEvent) {
    e.preventDefault();
    if (!numeroBusca.trim()) return;

    setErro('');
    setProjeto(null);
    setCarregando(true);

    try {
      const { data, error } = await supabase
        .from('projetos')
        .select(`
          numero_projeto,
          status,
          comprovante_url,
          entregue_em,
          clientes (
            nome
          )
        `)
        .eq('numero_projeto', numeroBusca.trim())
        .maybeSingle();

      if (error) {
        throw new Error(`Erro na busca: ${error.message}`);
      }

      if (!data) {
        setErro('Projeto não encontrado. Verifique o código digitado.');
      } else {
        const projetoFormatado: ProjectDetail = {
          ...data,
          clientes: Array.isArray(data.clientes) ? data.clientes[0] : data.clientes,
        };
        setProjeto(projetoFormatado);
      }
    } catch (err: any) {
      setErro(err.message || 'Erro ao realizar a busca.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-xl shadow-md border">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center pb-4 mb-4 border-b">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Consulta de Entrega</h1>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
            Portal do Cliente
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded transition border border-red-200"
        >
          🚪 Sair
        </button>
      </div>

      <form onSubmit={handleBuscar} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número do Projeto
          </label>
          <input
            type="text"
            required
            placeholder="Ex: PRJ-2026-101"
            value={numeroBusca}
            onChange={(e) => setNumeroBusca(e.target.value)}
            className="w-full p-2 border rounded text-black outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={carregando}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded font-medium hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {carregando ? 'Buscando...' : 'Consultar Status'}
        </button>
      </form>

      {erro && <p className="text-red-500 text-sm font-medium">{erro}</p>}

      {projeto && (
        <div className="border-t pt-4 space-y-3 text-gray-700">
          <div>
            <span className="text-xs text-gray-400 uppercase font-bold block">Código do Projeto</span>
            <p className="text-lg font-semibold text-gray-900">{projeto.numero_projeto}</p>
          </div>

          {projeto.clientes?.nome && (
            <div>
              <span className="text-xs text-gray-400 uppercase font-bold block">Cliente</span>
              <p className="text-sm font-medium text-gray-800">{projeto.clientes.nome}</p>
            </div>
          )}

          <div>
            <span className="text-xs text-gray-400 uppercase font-bold block">Status da Entrega</span>
            <span
              className={`inline-block mt-1 px-2.5 py-1 rounded text-xs font-bold uppercase ${
                projeto.status === 'entregue'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {projeto.status}
            </span>
          </div>

          {projeto.entregue_em && (
            <div>
              <span className="text-xs text-gray-400 uppercase font-bold block">Data / Hora de Entrega</span>
              <p className="text-sm text-gray-800">
                {new Date(projeto.entregue_em).toLocaleString('pt-BR')}
              </p>
            </div>
          )}

          {projeto.comprovante_url && (
            <div className="pt-2">
              <span className="text-xs text-gray-400 uppercase font-bold block mb-2">Comprovante de Entrega</span>
              <a
                href={projeto.comprovante_url}
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-slate-100 hover:bg-slate-200 text-blue-700 font-medium text-xs py-2 px-3 rounded border transition"
              >
                🔍 Visualizar Foto do Canhoto
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}