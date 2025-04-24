import React from 'react';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  variant?: 'spinner' | 'film';
}

const Loading: React.FC<LoadingProps> = ({ size = 'medium', text, variant = 'film' }) => {
  const sizeClass = {
    small: 'scale-75',
    medium: 'scale-100',
    large: 'scale-125',
  }[size];

  // Escolhe entre spinner padrão e animação temática de filme
  if (variant === 'spinner') {
    const spinnerSize = {
      small: 'w-6 h-6 border-2',
      medium: 'w-12 h-12 border-3',
      large: 'w-16 h-16 border-4',
    }[size];
    
    return (
      <div className="flex flex-col items-center justify-center">
        <div className={`${spinnerSize} rounded-full border-gray-700 border-t-purple-500 animate-spin`}></div>
        {text && <p className="mt-3 text-sm text-gray-400">{text}</p>}
      </div>
    );
  }

  // Animação temática de filme
  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`${sizeClass} transition-transform`}>
        {/* Claquete de Cinema */}
        <div className="relative">
          {/* Base da claquete */}
          <div className="w-24 h-20 bg-gray-800 rounded-md shadow-lg overflow-hidden relative border border-gray-700">
            {/* Topo da claquete (parte que move) */}
            <div className="absolute top-0 left-0 w-full h-8 bg-gray-900 animate-clapper">
              <div className="flex items-center justify-around h-full px-1">
                <div className="w-2 h-6 bg-purple-500"></div>
                <div className="w-2 h-6 bg-purple-500"></div>
                <div className="w-2 h-6 bg-purple-500"></div>
                <div className="w-2 h-6 bg-purple-500"></div>
              </div>
            </div>
            
            {/* "Filme" rolando dentro da claquete */}
            <div className="absolute top-10 left-0 w-full h-8 flex items-center justify-start overflow-hidden px-2">
              <div className="flex items-center animate-film-roll">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                  <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                  <div className="w-3 h-3 rounded-full bg-purple-300"></div>
                  <div className="w-3 h-3 rounded-full bg-purple-700"></div>
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                  <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                  <div className="w-3 h-3 rounded-full bg-purple-300"></div>
                  <div className="w-3 h-3 rounded-full bg-purple-700"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {text && <p className="mt-3 text-sm text-gray-400">{text}</p>}
    </div>
  );
};

export default Loading; 