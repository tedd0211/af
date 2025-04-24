'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function Header({ showBackButton }: { showBackButton?: boolean }) {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Fallback se o logout falhar
      router.push('/login');
    }
  };

  return (
    <header style={{ 
      backgroundColor: "#0f0f1a", 
      padding: "16px",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid rgba(139, 92, 246, 0.1)"
    }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {showBackButton && (
          <a 
            href="javascript:history.back()" 
            style={{ 
              color: "#d4d4d8",
              marginRight: "12px",
              fontSize: "14px",
              display: "flex",
              alignItems: "center"
            }}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: "4px" }}
            >
              <path 
                d="M15 19l-7-7 7-7" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            Voltar
          </a>
        )}
        <a 
          href="/" 
          style={{ 
            color: "#a855f7", 
            fontSize: "18px", 
            fontWeight: "bold",
            textDecoration: "none" 
          }}
        >
          Biblioteca de conteúdos
        </a>
      </div>
      
      <button 
        onClick={handleLogout}
        style={{ 
          color: "#d4d4d8", 
          textDecoration: "none",
          fontSize: "14px",
          padding: "6px 12px",
          borderRadius: "4px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          transition: "color 0.2s ease"
        }}
        onMouseOver={(e) => e.currentTarget.style.color = "#f43f5e"}
        onMouseOut={(e) => e.currentTarget.style.color = "#d4d4d8"}
      >
        Sair
      </button>
    </header>
  );
} 