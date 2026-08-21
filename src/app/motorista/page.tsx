'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Project {
  id: string;
  numero_projeto: string;
  status: string;
}

export default function MotoristaPage() {
  const [projetos, setProjetos] = useState<Project[]>([]);
  const [projetoSelecionado, setProjetoSelecionado] = useState('');
  const [foto, setFoto] = useState<File | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('user_role');
    if (role !== 'motorista' && role !== 'admin') {
      window.location.href = '/login';
      return;
    }
    carregarProjetos();
  }, []);

  function handleLogout() {
    localStorage.removeItem('user_role');
    window.location.href = '/login';
  }

  async function carregarProjetos() {
    const { data } = await supabase
      .from('projetos')
      .select('id, numero_projeto, status')
      .neq('status', 'entregue');
    
    if (data) setProjetos(data);
  }

  // Obter localização do dispositivo
  function obterCoordenadas(): Promise<{ lat: number | null; lng: number | null }> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ lat: null, lng: null });
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve({ lat: null, lng: null }),
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  }

  async function handleApontarEntrega(e: React.FormEvent) {
    e.preventDefault();
    if (!projetoSelecionado || !foto) {
      setMensagem('Selecione um projeto e anexe a foto do comprovante.');
      return;
    }

    setCarregando(true);
    setMensagem('Capturando localização e enviando...');

    try {
      const coords = await obterCoordenadas();

      const fileExt = foto.name.split('.').pop();
      const fileName = `${projetoSelecionado}-${Date.now()}.${fileExt}`;
      const filePath = `canhotos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('comprovantes')
        .upload(filePath, foto);

      if (uploadError) throw new Error(`Erro no upload: ${uploadError.message}`);

      const { data: publicUrlData } = supabase.storage
        .from('comprovantes')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('projetos')
        .update({
          status: 'entregue',
          comprovante_url: publicUrlData.publicUrl,
          entregue_em: new Date().toISOString(),
          latitude: coords.lat,
          longitude: coords.lng,
        })
        .eq('id', projetoSelecionado);

      if (updateError) throw new Error(`Erro ao atualizar: ${updateError.message}`);

      setMensagem('Entrega registrada com sucesso!');
      setFoto(null);
      setProjetoSelecionado('');
      carregarProjetos();
    } catch (err: any) {
      setMensagem(err.message || 'Erro inesperado.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 my-4 bg-white rounded-xl shadow border">
      {/* Cabeçalho Mobile */}
      <div className="flex justify-between items-center pb-3 mb-4 border-b">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Apontamento de Entrega</h1>
          <span className="text-[10px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded">
            Perfil: Motorista
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1 rounded transition border border-red-200"
        >
          🚪 Sair
        </button>
      </div>

      {mensagem && (
        <div className={`mb-4 p-3 rounded text-xs font-medium ${
          mensagem.includes('sucesso') ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
        }`}>
          {mensagem}
        </div>
      )}

      <form onSubmit={handleApontarEntrega} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Selecione o Projeto
          </label>
          <select
            required
            value={projetoSelecionado}
            onChange={(e) => setProjetoSelecionado(e.target.value)}
            className="w-full p-2.5 border rounded-lg text-sm text-black focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="">Selecione...</option>
            {projetos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.numero_projeto}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Foto do Canhoto / Comprovante
          </label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            required
            onChange={(e) => setFoto(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded-lg text-xs text-black file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700"
          />
        </div>

        <button
          type="submit"
          disabled={carregando}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg text-sm transition disabled:bg-gray-400"
        >
          {carregando ? 'Processando...' : '📷 Registrar Entrega com GPS'}
        </button>
      </form>
    </div>
  );
}