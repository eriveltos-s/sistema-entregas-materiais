'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro('');

    // Validação de exemplo simples (ajuste conforme sua regra de autenticação)
    if (email === 'admin@sistema.com' && senha === '123456') {
      localStorage.setItem('user_role', 'admin');
      window.location.href = '/'; // Redireciona para o Painel
    } else {
      setErro('E-mail ou senha incorretos.');
    }
  }

  return (
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
        </div>

        {/* MENSAGEM DE ERRO */}
        {erro && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded text-xs font-medium text-center">
            {erro}
          </div>
        )}

        {/* FORMULÁRIO */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              required
              placeholder="seuemail@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm text-black outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm text-black outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
            />
          </div>

          <button
            type="submit"
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
        </div>

      </div>
    </div>
  );
}
