'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import Loading from '../../components/Loading';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [animateInput, setAnimateInput] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Efeito para animar os elementos ao carregar a página
  useEffect(() => {
    setAnimateInput(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) {
        throw error;
      }

      router.push('/');
      router.refresh();
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      setErro('Email ou senha incorretos. Por favor, tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-gray-900 via-purple-950 to-gray-900 text-white overflow-hidden">
      {/* Formas decorativas com animação */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-20%] w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-[-30%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-3xl animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute top-[30%] right-[-20%] w-[400px] h-[400px] rounded-full bg-pink-600/10 blur-3xl animate-pulse-slow animation-delay-1000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <div className={`w-full max-w-md transition-all duration-1000 ease-out ${animateInput ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Logo e cabeçalho */}
          <div className="text-center mb-10">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-purple-400 shadow-xl flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Biblioteca de conteúdos</h1>
            <p className="text-purple-200 text-sm max-w-xs mx-auto">
              Acesse sua conta para explorar filmes e séries
            </p>
          </div>

          {/* Formulário com efeito de vidro */}
          <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className={`transition-all duration-700 delay-300 ${animateInput ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <label htmlFor="email" className="block text-sm font-medium text-purple-200 mb-2 pl-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full p-3.5 bg-white/5 border border-purple-400/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-purple-300/50"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              <div className={`transition-all duration-700 delay-500 ${animateInput ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <label htmlFor="senha" className="block text-sm font-medium text-purple-200 mb-2 pl-1">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="senha"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="pl-10 w-full p-3.5 bg-white/5 border border-purple-400/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-purple-300/50"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {erro && (
                <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg p-3 flex items-center animate-shake">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {erro}
                </div>
              )}

              <div className={`pt-2 transition-all duration-700 delay-700 ${animateInput ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <button
                  type="submit"
                  disabled={carregando}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white py-3.5 rounded-xl font-medium hover:from-purple-500 hover:to-purple-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
                >
                  {carregando ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      <span>Entrando...</span>
                    </div>
                  ) : (
                    'Entrar'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
} 