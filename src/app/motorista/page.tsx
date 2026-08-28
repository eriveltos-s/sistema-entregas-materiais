'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Projeto {
  id: string;
  numero_projeto: string;
  numero_nf?: number | null;
  status: string;
  comprovante_url: string | null;
  entregue_em: string | null;
  created_at?: string | null;
  clientes: { id?: string; nome: string; email?: string } | null;
}

export default function MotoristaPage() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [projetoSelecionado, setProjetoSelecionado] = useState<Projeto | null>(null);
  const [nomeMotorista, setNomeMotorista] = useState('');
  
  // Filtros
  const [filtroBusca, setFiltroBusca] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  // Upload e GPS
  const [arquivoFoto, setArquivoFoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [statusGps, setStatusGps] = useState('');

  // Modal Lightbox
  const [modalImagemUrl, setModalImagemUrl] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem('user_role');
    if (role !== 'motorista') {
      window.location.href = '/login';
      return;
    }
    const nomeArmazenado = localStorage.getItem('motorista_nome');
    if (nomeArmazenado) setNomeMotorista(nomeArmazenado);

    carregarProjetos();
  }, []);

  function handleLogout() {
    localStorage.removeItem('user_role');
    localStorage.removeItem('motorista_id');
    localStorage.removeItem('motorista_nome');
    window.location.href = '/login';
  }

  async function carregarProjetos() {
    setCarregando(true);
    const motoristaId = localStorage.getItem('motorista_id');

    let query = supabase
      .from('projetos')
      .select(`
        id, numero_projeto, numero_nf, status, comprovante_url, entregue_em, created_at,
        clientes ( id, nome, email )
      `)
      .order('created_at', { ascending: false });

    if (motoristaId) {
      query = query.eq('motorista_id', motoristaId);
    }

    const { data: pData } = await query;

    if (pData) {
      const projetosFormatados: Projeto[] = pData.map((p: any) => ({
        ...p,
        clientes: Array.isArray(p.clientes) ? p.clientes[0] : p.clientes,
      }));
      setProjetos(projetosFormatados);
    }
    setCarregando(false);
  }

  function handleSelecionarFoto(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setArquivoFoto(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  async function handleFinalizarEntrega(e: React.FormEvent) {
    e.preventDefault();
    if (!projetoSelecionado) return;
    if (!arquivoFoto) {
      alert('Por favor, tire uma foto ou selecione o comprovante.');
      return;
    }

    setEnviando(true);
    setMensagem('');
    setStatusGps('Capturando posição GPS...');

    let latitude: number | null = null;
    let longitude: number | null = null;

    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });
      latitude = pos.coords.latitude;
      longitude = pos.coords.longitude;
      setStatusGps('GPS capturado com sucesso!');
    } catch (err) {
      console.warn('GPS indisponível ou permissão negada.');
      setStatusGps('GPS indisponível ou permissão negada.');
    }

    try {
      const extensao = arquivoFoto.name.split('.').pop();
      const nomeArquivo = `${projetoSelecionado.id}_${Date.now()}.${extensao}`;

      const { error: uploadError } = await supabase.storage
        .from('comprovantes')
        .upload(nomeArquivo, arquivoFoto);

      if (uploadError) throw new Error(uploadError.message);

      const { data: publicUrlData } = supabase.storage
        .from('comprovantes')
        .getPublicUrl(nomeArquivo);

      const urlComprovante = publicUrlData.publicUrl;

      // 1. Atualizar Projeto no Banco
      const { error: updateError } = await supabase
        .from('projetos')
        .update({
          status: 'entregue',
          comprovante_url: urlComprovante,
          entregue_em: new Date().toISOString(),
          latitude: latitude,
          longitude: longitude,
        })
        .eq('id', projetoSelecionado.id);

      if (updateError) throw new Error(updateError.message);

      setMensagem('✅ Entrega registrada e confirmada com sucesso!');
      setArquivoFoto(null);
      setPreviewUrl(null);
      setProjetoSelecionado(null);
      carregarProjetos();
    } catch (err: any) {
      alert(err.message || 'Erro ao finalizar entrega.');
    } finally {
      setEnviando(false);
      setStatusGps('');
    }
  }

  // FILTRAGEM POR BUSCA E DATAS
  const projetosFiltrados = projetos.filter((prj) => {
    const textoMatch =
      prj.numero_projeto.toLowerCase().includes(filtroBusca.toLowerCase()) ||
      String(prj.numero_nf || '').includes(filtroBusca) ||
      prj.clientes?.nome?.toLowerCase().includes(filtroBusca.toLowerCase());

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 font-sans">
      <div className="max-w-md mx-auto space-y-5">
        
        {/* HEADER FIXO MOBILE */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl backdrop-blur-md shadow-xl flex items-center justify-between sticky top-3 z-30">
          <div className="flex items-center gap-3">
            <img src="LOGO.jpg" alt="Logo JL IT" className="h-8 w-auto rounded border border-slate-700/80 p-0.5 bg-slate-900" />
            <div>
              <h1 className="text-xs font-black text-white uppercase tracking-wider">
                {nomeMotorista || 'Painel Motorista'}
              </h1>
              <p className="text-[10px] text-emerald-400 font-semibold">Minhas Entregas</p>
            </div>
          </div>

          <button onClick={handleLogout} className="text-[11px] font-bold text-slate-400 hover:text-rose-400 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            🚪 Sair
          </button>
        </div>

        {mensagem && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold text-center">
            {mensagem}
          </div>
        )}

        {/* FORMULÁRIO DE CONFIRMAÇÃO DE ENTREGA */}
        {projetoSelecionado && (
          <div className="bg-slate-900 border border-emerald-500/40 p-5 rounded-2xl space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                📦 Confirmar — {projetoSelecionado.numero_projeto}
              </h2>
              <button onClick={() => { setProjetoSelecionado(null); setPreviewUrl(null); }} className="text-slate-400 hover:text-white text-xs">
                ✖
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <p><strong>Cliente:</strong> {projetoSelecionado.clientes?.nome || '—'}</p>
              {projetoSelecionado.numero_nf && <p><strong>Nº NF:</strong> {projetoSelecionado.numero_nf}</p>}
            </div>

            <form onSubmit={handleFinalizarEntrega} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-2">
                  📸 Tirar Foto do Comprovante Assinado
                </label>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleSelecionarFoto}
                  required
                  className="block w-full text-xs text-slate-400 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-emerald-500 file:text-slate-950 hover:file:bg-emerald-400 cursor-pointer"
                />
              </div>

              {previewUrl && (
                <div className="text-center pt-2">
                  <img src={previewUrl} alt="Preview" className="max-h-52 mx-auto rounded-xl border border-slate-700 shadow-lg object-cover" />
                </div>
              )}

              {statusGps && <p className="text-[11px] text-amber-400 text-center animate-pulse">{statusGps}</p>}

              <button
                type="submit"
                disabled={enviando}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black py-3 rounded-xl text-xs transition shadow-lg disabled:opacity-50"
              >
                {enviando ? 'Enviando Comprovante e GPS...' : '✅ Salvar Entrega + GPS'}
              </button>
            </form>
          </div>
        )}

        {/* FILTROS DE BUSCA E DATA */}
        <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800 space-y-2">
          <input
            type="text"
            placeholder="🔍 Buscar por projeto, NF ou cliente..."
            value={filtroBusca}
            onChange={(e) => setFiltroBusca(e.target.value)}
            className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-medium text-slate-400 mb-0.5">De:</label>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-slate-400 mb-0.5">Até:</label>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* FEED DE PROJETOS (MOBILE CARDS) */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Minhas Entregas ({projetosFiltrados.length})
            </h2>
            <button onClick={carregarProjetos} className="text-xs text-emerald-400 font-semibold underline">🔄 Atualizar</button>
          </div>

          {carregando ? (
            <p className="text-xs text-slate-500 py-6 text-center">Carregando entregas...</p>
          ) : projetosFiltrados.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
              <p className="text-xs text-slate-500">Nenhuma entrega encontrada para os filtros aplicados.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {projetosFiltrados.map((prj) => {
                const isEntregue = prj.status === 'entregue';
                return (
                  <div key={prj.id} className={`p-4 rounded-2xl border backdrop-blur-md transition-all ${
                    isEntregue ? 'bg-slate-900/40 border-emerald-500/20' : 'bg-slate-900/80 border-slate-800'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-black text-white text-base">{prj.numero_projeto}</span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                        isEntregue ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isEntregue ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                        {prj.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400"><strong>Cliente:</strong> {prj.clientes?.nome || '—'}</p>
                    {prj.numero_nf && <p className="text-xs text-slate-400 mt-0.5"><strong>Nº NF:</strong> {prj.numero_nf}</p>}

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-end">
                      {isEntregue ? (
                        <div className="flex items-center gap-2">
                          {prj.comprovante_url && (
                            <button onClick={() => setModalImagemUrl(prj.comprovante_url)}>
                              <img src={prj.comprovante_url} alt="Comprovante" className="w-9 h-9 object-cover rounded-lg border border-emerald-500/40" />
                            </button>
                          )}
                          <span className="text-xs font-bold text-emerald-400">Entregue ✅</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setProjetoSelecionado(prj); setMensagem(''); }}
                          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 py-2.5 rounded-xl text-xs font-black transition shadow-md"
                        >
                          📸 Finalizar Entrega
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* LIGHTBOX MODAL */}
        {modalImagemUrl && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative max-w-sm w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-2">
              <button onClick={() => setModalImagemUrl(null)} className="absolute top-4 right-4 bg-slate-800 text-white p-2 rounded-full text-xs font-bold">✖</button>
              <img src={modalImagemUrl} alt="Ampliado" className="w-full max-h-[70vh] object-contain rounded-xl" />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}