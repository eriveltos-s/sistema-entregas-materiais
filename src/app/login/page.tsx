'use client';

import { useState } from 'react';
<<<<<<< HEAD

export default function LoginPage() {
  const [email, setEmail] = useState('');
=======
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [identificador, setIdentificador] = useState('');
>>>>>>> 446e0c1 (Atualizacao JL IT - Layout e novas funcionalidades)
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

<<<<<<< HEAD
  function handleLogin(e: React.FormEvent) {
=======
  async function handleLogin(e: React.FormEvent) {
>>>>>>> 446e0c1 (Atualizacao JL IT - Layout e novas funcionalidades)
    e.preventDefault();
    setErro('');
    setCarregando(true);

<<<<<<< HEAD
    // Validação de exemplo simples (ajuste conforme sua regra de autenticação)
    if (email === 'admin@sistema.com' && senha === '123456') {
      localStorage.setItem('user_role', 'admin');
      window.location.href = '/'; // Redireciona para o Painel
    } else {
      setErro('E-mail ou senha incorretos.');
=======
    const valorLimpo = identificador.trim();
    const valorMinusculo = valorLimpo.toLowerCase();

    // 1. Acesso do Administrador
    if ((valorMinusculo === 'admin' || valorMinusculo === 'admin@sistema.com') && senha === '123456') {
      localStorage.removeItem('motorista_id');
      localStorage.removeItem('cliente_id');
      localStorage.setItem('user_role', 'admin');
      window.location.href = '/';
      return;
    } 

    // 2. Acesso do Motorista Padrão
    if (valorMinusculo === 'motorista' && senha === '123456') {
      localStorage.removeItem('motorista_id');
      localStorage.setItem('user_role', 'motorista');
      window.location.href = '/motorista';
      return;
>>>>>>> 446e0c1 (Atualizacao JL IT - Layout e novas funcionalidades)
    }

    // 3. Consulta de Cliente na Tabela 'clientes'
    const { data: cliente } = await supabase
      .from('clientes')
      .select('id, nome, email, senha')
      .or(`email.ilike.${valorLimpo},nome.ilike.${valorLimpo}`)
      .eq('senha', senha)
      .maybeSingle();

    if (cliente) {
      setCarregando(false);
      localStorage.removeItem('motorista_id');
      localStorage.setItem('user_role', 'cliente');
      localStorage.setItem('cliente_id', cliente.id);
      localStorage.setItem('cliente_nome', cliente.nome);
      window.location.href = '/cliente';
      return;
    }

    // 4. Consulta de Motorista na Tabela 'motoristas'
    if (senha === '123456') {
      const { data: motoristas } = await supabase
        .from('motoristas')
        .select('id, nome');

      if (motoristas) {
        const motoristaEncontrado = motoristas.find(
          (m) => m.nome.trim().toLowerCase() === valorMinusculo
        );

        if (motoristaEncontrado) {
          setCarregando(false);
          localStorage.setItem('user_role', 'motorista');
          localStorage.setItem('motorista_id', motoristaEncontrado.id);
          localStorage.setItem('motorista_nome', motoristaEncontrado.nome);
          window.location.href = '/motorista';
          return;
        }
      }
    }

    setCarregando(false);
    setErro('Credencial ou senha inválida.');
  }

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-slate-200 p-6 sm:p-8 space-y-6">
        
        {/* CABEÇALHO DA TELA DE LOGIN COM LOGO */}
        <div className="text-center space-y-2">
          <img 
            src="watermarked_img_9035154237853069771.jpg" 
            alt="Sistema Pro Logo" 
            className="h-12 w-auto mx-auto object-contain rounded"
          />
          <h1 className="text-2xl font-bold text-gray-800">Acesse o Sistema</h1>
          <p className="text-xs text-gray-500">Digite suas credenciais para entrar no painel</p>
=======
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
      <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-800 p-6 sm:p-8 space-y-6">
        
        {/* CABEÇALHO */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black text-white tracking-wider">
            JL IT
          </h1>
          <p className="text-xs font-semibold text-emerald-400">
            Portal de Gestão de Entregas & Projetos
          </p>
>>>>>>> 446e0c1 (Atualizacao JL IT - Layout e novas funcionalidades)
        </div>

        {/* MENSAGEM DE ERRO */}
        {erro && (
<<<<<<< HEAD
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded text-xs font-medium text-center">
            {erro}
=======
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs font-semibold text-center backdrop-blur-md">
            ⚠️ {erro}
>>>>>>> 446e0c1 (Atualizacao JL IT - Layout e novas funcionalidades)
          </div>
        )}

        {/* FORMULÁRIO */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
<<<<<<< HEAD
            <label className="block text-xs font-medium text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              required
              placeholder="seuemail@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm text-black outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
=======
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Usuário / E-mail / Nome
            </label>
            <input
              type="text"
              required
              placeholder="Digite suas credenciais"
              value={identificador}
              onChange={(e) => setIdentificador(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition shadow-inner"
>>>>>>> 446e0c1 (Atualizacao JL IT - Layout e novas funcionalidades)
            />
          </div>

          <div>
<<<<<<< HEAD
            <label className="block text-xs font-medium text-gray-700 mb-1">Senha</label>
=======
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Senha
            </label>
>>>>>>> 446e0c1 (Atualizacao JL IT - Layout e novas funcionalidades)
            <input
              type="password"
              required
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
<<<<<<< HEAD
              className="w-full p-2.5 border rounded-lg text-sm text-black outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
=======
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition shadow-inner"
>>>>>>> 446e0c1 (Atualizacao JL IT - Layout e novas funcionalidades)
            />
          </div>

          <button
            type="submit"
<<<<<<< HEAD
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition shadow-sm"
          >
            Entrar no Painel
          </button>
        </form>

        {/* RODAPÉ DO LOGIN */}
        <div className="text-center pt-2 border-t border-gray-100">
          <span className="text-[11px] text-gray-400">
            Sistema Pro &copy; 2026 — Todos os direitos reservados.
          </span>
=======
            disabled={carregando}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg active:scale-[0.99] disabled:opacity-50 mt-2"
          >
            {carregando ? 'Acessando Sistema...' : 'Entrar no Sistema'}
          </button>
        </form>

        {/* LOGO NA PARTE DE BAIXO + RODAPÉ */}
        <div className="text-center pt-4 border-t border-slate-800/80 space-y-3">
          <img 
            src="LOGO.jpg" 
            alt="Logo JL IT" 
            className="h-12 w-auto mx-auto object-contain rounded-xl border border-slate-700/80 shadow-md p-1 bg-slate-900"
          />
          <p className="text-[11px] text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} JL IT — Todos os direitos reservados.
          </p>
>>>>>>> 446e0c1 (Atualizacao JL IT - Layout e novas funcionalidades)
        </div>

      </div>
    </div>
  );
}
