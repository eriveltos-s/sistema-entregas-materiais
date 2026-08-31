'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [identificador, setIdentificador] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
      
      {/* CONTEÚDO CENTRAL */}
      <div className="flex-1 flex items-center justify-center my-8">
        <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-800 p-6 sm:p-8 space-y-6">
          
          {/* CABEÇALHO COM LOGO BBOX */}
          <div className="text-center space-y-2 flex flex-col items-center">
            <img 
              src="BBox.png" 
              alt="Logo Black Box" 
              className="h-12 w-auto object-contain rounded-xl border border-slate-800 bg-slate-950 p-1.5 shadow-md mb-1"
            />
            <div>
              <h1 className="text-2xl font-black text-white tracking-wider">
                
              </h1>
              <p className="text-xs font-semibold text-emerald-400">
                Portal de Gestão de Entregas & Projetos
              </p>
            </div>
          </div>

          {/* MENSAGEM DE ERRO */}
          {erro && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs font-semibold text-center backdrop-blur-md">
              ⚠️ {erro}
            </div>
          )}

          {/* FORMULÁRIO */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
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
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Senha
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg active:scale-[0.99] disabled:opacity-50 mt-2"
            >
              {carregando ? 'Acessando Sistema...' : 'Entrar no Sistema'}
            </button>
          </form>

        </div>
      </div>

      {/* RODAPÉ COM LOGO EXPANDIDO EM ~15% (h-[28px]) */}
      <footer className="w-full max-w-md mx-auto pt-4 border-t border-slate-800/80 flex items-center justify-center gap-3">
        <img 
          src="LOGO.jpg" 
          alt="Logo JL IT" 
          className="h-[35px] w-auto object-contain rounded border border-slate-700/80 bg-slate-900 p-0.5 shadow-sm"
        />
        <p className="text-[11px] text-slate-500 font-medium">
          &copy; {new Date().getFullYear()} JL IT — Todos os direitos reservados.
        </p>
      </footer>

    </div>
  );
}