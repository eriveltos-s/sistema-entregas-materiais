'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [perfil, setPerfil] = useState<'admin' | 'motorista' | 'cliente'>('admin');
  const [senhaAdmin, setSenhaAdmin] = useState('');
  const [erro, setErro] = useState('');

  const SENHA_ADMIN_CORRETA = '123456';

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro('');

    if (perfil === 'admin') {
      if (senhaAdmin !== SENHA_ADMIN_CORRETA) {
        setErro('Senha do Administrador incorreta.');
        return;
      }
      localStorage.setItem('user_role', 'admin');
      router.push('/admin');
    } else if (perfil === 'motorista') {
      localStorage.setItem('user_role', 'motorista');
      router.push('/motorista');
    } else {
      localStorage.setItem('user_role', 'cliente');
      router.push('/cliente');
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h1 className="text-2xl font-bold text-center text-slate-800 mb-2">
          Acesso ao Sistema
        </h1>
        <p className="text-xs text-center text-slate-500 mb-6">
          Selecione seu perfil de acesso para continuar.
        </p>

        {erro && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm font-medium rounded">
            {erro}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Perfil de Acesso
            </label>
            <select
              value={perfil}
              onChange={(e) => {
                setPerfil(e.target.value as any);
                setErro('');
              }}
              className="w-full p-2.5 border rounded-lg text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="admin">Administrador (Gestão Total)</option>
              <option value="motorista">Motorista (Apontamento de Entregas)</option>
              <option value="cliente">Cliente (Consulta de Rastreio)</option>
            </select>
          </div>

          {perfil === 'admin' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Senha do Administrador
              </label>
              <input
                type="password"
                required
                placeholder="Digite a senha (padrão: 123456)"
                value={senhaAdmin}
                onChange={(e) => setSenhaAdmin(e.target.value)}
                className="w-full p-2.5 border rounded-lg text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition"
          >
            Entrar no Sistema
          </button>
        </form>
      </div>
    </div>
  );
}