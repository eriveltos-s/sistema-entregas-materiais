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

  // Verificação de permissão
  useEffect(() => {
    const role = localStorage.getItem('user_role');
    if (role !== 'motorista' && role !== 'admin') {
      alert('Acesso negado! Esta área é exclusiva para Motoristas autorizados.');
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

  async function handleApontarEntrega(e: React.FormEvent) {
    e.preventDefault();
    if (!projetoSelecionado || !foto) {
      setMensagem('Selecione um projeto e tire/anexe a foto do comprovante.');
      return;
    }

    setCarregando(true);
    setMensagem('');

    try {
      const fileExt = foto.name.split('.').pop();
      const fileName = `${projetoSelecionado}-${Date.now()}.${fileExt}`;
      const filePath = `canhotos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('comprovantes')
        .upload(filePath, foto);

      if (uploadError) {
        throw new Error(`Erro ao enviar foto: ${uploadError.message}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from('comprovantes')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('projetos')
        .update({
          status: 'entregue',
          comprovante_url: publicUrlData.publicUrl,
          entregue_em: new Date().toISOString(),
        })
        .eq('id', projetoSelecionado);

      if (updateError) {
        throw new Error(`Erro ao atualizar banco: ${updateError.message}`);
      }

      setMensagem('Entrega e comprovante registrados com sucesso!');
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
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-xl shadow-md border">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center pb-4 mb-4 border-b">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Área do Motorista</h1>
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
            Apontamento Mobile
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded transition border border-red-200"
        >
          🚪 Sair
        </button>
      </div>

      {mensagem && (
        <div
          className={`mb-4 p-3 rounded text-sm font-medium ${
            mensagem.includes('sucesso')
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {mensagem}
        </div>
      )}

      <form onSubmit={handleApontarEntrega} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Selecione o Projeto
          </label>
          <select
            required
            value={projetoSelecionado}
            onChange={(e) => setProjetoSelecionado(e.target.value)}
            className="w-full p-2 border rounded text-black focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="">Selecione...</option>
            {projetos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.numero_projeto} ({p.status})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tirar Foto do Canhoto / Comprovante
          </label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            required
            onChange={(e) => setFoto(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded text-black text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
        </div>

        <button
          type="submit"
          disabled={carregando}
          className="w-full bg-green-600 text-white py-2 px-4 rounded font-medium hover:bg-green-700 transition disabled:bg-gray-400"
        >
          {carregando ? 'Enviando foto...' : 'Confirmar Entrega'}
        </button>
      </form>
    </div>
  );
}