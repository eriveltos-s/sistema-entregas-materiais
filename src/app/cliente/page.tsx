'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Projeto {
  id: string;
  numero_projeto: string;
  po_cliente?: string | null;
  numero_nf?: number | null;
  status: string;
  comprovante_url: string | null;
  created_at?: string | null;
  entregue_em: string | null;
  latitude: number | null;
  longitude: number | null;
  clientes: { nome: string } | null;
  motoristas: { nome: string } | null;
}

export default function ClientePage() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [filtroBusca, setFiltroBusca] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  
  const [carregando, setCarregando] = useState(true);
  const [nomeClienteLogado, setNomeClienteLogado] = useState('');

  // Troca de Senha
  const [novaSenha, setNovaSenha] = useState('');
  const [msgSenha, setMsgSenha] = useState('');
  const [exibirFormSenha, setExibirFormSenha] = useState(false);

  // Lightbox Modal
  const [modalImagemUrl, setModalImagemUrl] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem('user_role');
    if (role !== 'cliente') {
      window.location.href = '/login';
      return;
    }
    const nome = localStorage.getItem('cliente_nome');
    if (nome) setNomeClienteLogado(nome);

    carregarProjetos();
  }, []);

  function handleLogout() {
    localStorage.removeItem('user_role');
    localStorage.removeItem('cliente_id');
    localStorage.removeItem('cliente_nome');
    window.location.href = '/login';
  }

  async function carregarProjetos() {
    setCarregando(true);
    const clienteId = localStorage.getItem('cliente_id');

    if (!clienteId) {
      setProjetos([]);
      setCarregando(false);
      return;
    }

    const { data: pData } = await supabase
      .from('projetos')
      .select(`
        id, numero_projeto, po_cliente, numero_nf, status, comprovante_url, created_at, entregue_em, latitude, longitude,
        clientes ( nome ),
        motoristas ( nome )
      `)
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false });

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

  async function handleAlterarSenha(e: React.FormEvent) {
    e.preventDefault();
    setMsgSenha('');

    const clienteId = localStorage.getItem('cliente_id');
    if (!clienteId) return;

    if (novaSenha.length < 4) {
      setMsgSenha('A nova senha deve ter no mínimo 4 caracteres.');
      return;
    }

    const { error } = await supabase
      .from('clientes')
      .update({ senha: novaSenha })
      .eq('id', clienteId);

    if (error) {
      setMsgSenha(`Erro: ${error.message}`);
    } else {
      setMsgSenha('Senha alterada com sucesso!');
      setNovaSenha('');
      setTimeout(() => setExibirFormSenha(false), 2500);
    }
  }

  const projetosFiltrados = projetos.filter((prj) => {
    const textoMatch =
      prj.numero_projeto.toLowerCase().includes(filtroBusca.toLowerCase()) ||
      prj.po_cliente?.toLowerCase().includes(filtroBusca.toLowerCase()) ||
      String(prj.numero_nf || '').includes(filtroBusca) ||
      prj.motoristas?.nome?.toLowerCase().includes(filtroBusca.toLowerCase());

    let dataMatch = true;
    const dataProjeto = prj.created_at ? new Date(prj.created_at) : null;

    if (dataInicio && dataProjeto) {
      dataMatch = dataMatch && dataProjeto >= new Date(`${dataInicio}T00:00:00`);
    }
    if (dataFim && dataProjeto) {
      dataMatch = dataMatch && dataProjeto <= new Date(`${dataFim}T23:59:59`);
    }

    return textoMatch && dataMatch;
  });

  const totalProjetos = projetos.length;
  const entregues = projetos.filter((p) => p.status === 'entregue').length;
  const pendentes = projetos.filter((p) => p.status !== 'entregue').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* CABEÇALHO */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-4">
            <img src="LOGO.jpg" alt="Logo JL IT" className="h-10 w-auto rounded border border-slate-700 p-1 bg-slate-900" />
            <div className="border-l border-slate-800 pl-4">
              <h1 className="text-xl font-black text-white">
                JL IT — Portal do Cliente {nomeClienteLogado && `(${nomeClienteLogado})`}
              </h1>
              <span className="text-xs font-semibold text-emerald-400">Rastreamento de Entregas</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setExibirFormSenha(!exibirFormSenha)} className="text-xs font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 px-3.5 py-2 rounded-xl border border-slate-700">
              🔒 Alterar Senha
            </button>
            <button onClick={handleLogout} className="text-xs font-bold bg-slate-800 text-slate-300 hover:text-rose-400 px-3.5 py-2 rounded-xl border border-slate-700">
              🚪 Sair
            </button>
          </div>
        </div>

        {/* METRICAS CLIENTE */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            <p className="text-xs font-medium text-slate-400 uppercase">Meus Projetos</p>
            <p className="text-2xl font-black text-white mt-1">{totalProjetos}</p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            <p className="text-xs font-medium text-amber-400 uppercase">Em Trânsito</p>
            <p className="text-2xl font-black text-amber-400 mt-1">{pendentes}</p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            <p className="text-xs font-medium text-emerald-400 uppercase">Entregues</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">{entregues}</p>
          </div>
        </div>

        {exibirFormSenha && (
          <form onSubmit={handleAlterarSenha} className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3 max-w-md">
            <h3 className="text-xs font-bold text-white uppercase">Alterar Minha Senha</h3>
            {msgSenha && <p className="text-xs p-2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">{msgSenha}</p>}
            <input
              type="password"
              required
              placeholder="Digite a nova senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
            />
            <button type="submit" className="w-full bg-emerald-500 text-slate-950 font-black py-2 rounded-xl text-xs">
              Salvar Senha
            </button>
          </form>
        )}

        {/* FILTROS DE PERÍODO E BUSCA */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Buscar por Texto</label>
            <input
              type="text"
              placeholder="🔍 Buscar por projeto, PO Cliente, Nº NF ou motorista..."
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

        {carregando ? (
          <p className="text-xs text-slate-500 py-6 text-center">Carregando seus projetos...</p>
        ) : projetosFiltrados.length === 0 ? (
          <p className="text-xs text-slate-500 py-8 text-center border rounded-2xl border-dashed border-slate-800">Nenhum projeto encontrado para o seu cadastro.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="p-3.5">Projeto</th>
                  <th className="p-3.5">PO Cliente</th>
                  <th className="p-3.5">Nº NF</th>
                  <th className="p-3.5">Motorista</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-center">Comprovante</th>
                  <th className="p-3.5 text-center">Localização</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {projetosFiltrados.map((prj) => {
                  const isEntregue = prj.status === 'entregue';
                  return (
                    <tr key={prj.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3.5 font-bold text-white">{prj.numero_projeto}</td>
                      <td className="p-3.5 text-slate-300">{prj.po_cliente || '—'}</td>
                      <td className="p-3.5 text-slate-300">{prj.numero_nf || '—'}</td>
                      <td className="p-3.5 text-slate-300">{prj.motoristas?.nome || '—'}</td>
                      <td className="p-3.5 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                          isEntregue ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isEntregue ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                          {prj.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-center align-middle">
                        {prj.comprovante_url ? (
                          <button onClick={() => setModalImagemUrl(prj.comprovante_url)} className="inline-block hover:scale-110 transition">
                            <img src={prj.comprovante_url} alt="Comprovante" className="w-9 h-9 object-cover rounded-lg border border-slate-700 mx-auto" />
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* LIGHTBOX MODAL */}
        {modalImagemUrl && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-2">
              <button onClick={() => setModalImagemUrl(null)} className="absolute top-4 right-4 bg-slate-800 text-white p-2 rounded-full text-xs font-bold">✖</button>
              <img src={modalImagemUrl} alt="Ampliado" className="w-full max-h-[75vh] object-contain rounded-xl" />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}