import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw } from 'lucide-react';

interface TeslaAnimatedLogoProps {
  onAnimationComplete?: () => void;
  size?: 'normal' | 'large';
  autoStart?: boolean;
}

export const TeslaAnimatedLogo: React.FC<TeslaAnimatedLogoProps> = ({
  onAnimationComplete,
  size = 'large',
  autoStart = true,
}) => {
  // Passos da animação solicitada:
  // 1: O 'T' aparece
  // 2: Os dois pontinhos/barras brancas esmaecem e deslizam da esquerda pra direita
  // 3: O 'e', 's', 'l', 'a' vem da direita
  // 4: Sobe 'Engenharia e Automação'
  // 5: O logo gira uma vez (360° 3D)
  // 6: Fica igual ao logo do site (versão oficial final)
  const [step, setStep] = useState<number>(0);
  const [isRotating, setIsRotating] = useState(false);
  const [isSettled, setIsSettled] = useState(false);

  const startAnimation = () => {
    setStep(1); // Passo 1: 'T' aparece
    setIsRotating(false);
    setIsSettled(false);

    // Passo 2: após 600ms, as duas barras esquerdas deslizam da esquerda pra direita
    const t1 = setTimeout(() => {
      setStep(2);
    }, 650);

    // Passo 3: após 1300ms, 'e s l a' vem da direita
    const t2 = setTimeout(() => {
      setStep(3);
    }, 1300);

    // Passo 4: após 2000ms, sobe 'Engenharia e Automação'
    const t3 = setTimeout(() => {
      setStep(4);
    }, 2000);

    // Passo 5: após 2700ms, o logo gira uma vez (360° em 3D)
    const t4 = setTimeout(() => {
      setStep(5);
      setIsRotating(true);
    }, 2750);

    // Passo 6: após 3800ms, rotação conclui e assenta idêntico ao logo do site
    const t5 = setTimeout(() => {
      setIsRotating(false);
      setIsSettled(true);
      setStep(6);
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, 3900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  };

  useEffect(() => {
    if (autoStart) {
      const cleanup = startAnimation();
      return cleanup;
    }
  }, [autoStart]);

  const scaleClass = size === 'large' ? 'scale-110 sm:scale-125' : 'scale-90 sm:scale-100';

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-2">
      {/* Container com perspectiva 3D para o giro do logo */}
      <div
        className={`relative transition-transform duration-700 ${scaleClass}`}
        style={{ perspective: 1000 }}
      >
        <motion.div
          className="relative flex flex-col items-center justify-center p-3"
          animate={{
            rotateY: isRotating ? 360 : 0,
            scale: isRotating ? [1, 1.08, 1] : 1,
          }}
          transition={{
            duration: 1.1,
            ease: [0.25, 1, 0.5, 1],
          }}
        >
          {/* Se assentado na forma final oficial, exibe o logo oficial transparente */}
          {isSettled ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative flex flex-col items-center"
            >
              <img
                src="/assets/aistudio/logo_tesla_transparent.png"
                alt="Tesla Engenharia e Automação"
                className="h-16 sm:h-20 w-auto object-contain filter drop-shadow-[0_0_16px_rgba(37,99,235,0.45)]"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          ) : (
            /* Montagem Coreográfica Elemento por Elemento */
            <div className="relative flex flex-col items-center">
              {/* Linha Principal do Nome: TESLA */}
              <div className="flex items-center tracking-tight h-14">
                {/* 1. As duas barras/pontos brancos/claros à esquerda */}
                <div className="flex flex-col gap-1.5 mr-1.5 w-5 justify-center">
                  <motion.div
                    initial={{ opacity: 0, x: -35 }}
                    animate={{
                      opacity: step >= 2 ? 0.95 : 0,
                      x: step >= 2 ? 0 : -35,
                    }}
                    transition={{
                      duration: 0.55,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="h-2 w-4 rounded-sm bg-gradient-to-r from-indigo-200 to-blue-300 shadow-[0_0_8px_rgba(199,210,254,0.6)]"
                  />
                  <motion.div
                    initial={{ opacity: 0, x: -45 }}
                    animate={{
                      opacity: step >= 2 ? 0.8 : 0,
                      x: step >= 2 ? 0 : -45,
                    }}
                    transition={{
                      duration: 0.65,
                      delay: 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="h-2 w-4 rounded-sm bg-gradient-to-r from-blue-100 to-indigo-200 shadow-[0_0_8px_rgba(224,231,255,0.5)]"
                  />
                </div>

                {/* 2. O 'T' que aparece primeiro */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.7, y: -5 }}
                  animate={{
                    opacity: step >= 1 ? 1 : 0,
                    scale: step >= 1 ? 1 : 0.7,
                    y: step >= 1 ? 0 : -5,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="font-extrabold text-4xl sm:text-5xl text-[#1e40af] drop-shadow-[0_0_12px_rgba(30,64,175,0.6)] leading-none select-none tracking-tighter"
                  style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
                >
                  T
                </motion.div>

                {/* 3. Letras 'e s l a' que vêm da direita */}
                <div className="flex items-center overflow-hidden ml-0.5">
                  {['e', 's', 'l', 'a'].map((letra, index) => (
                    <motion.span
                      key={letra}
                      initial={{ opacity: 0, x: 50 + index * 10 }}
                      animate={{
                        opacity: step >= 3 ? 1 : 0,
                        x: step >= 3 ? 0 : 50 + index * 10,
                      }}
                      transition={{
                        duration: 0.5,
                        delay: step >= 3 ? index * 0.08 : 0,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="font-extrabold text-3xl sm:text-4xl text-[#1e40af] drop-shadow-[0_0_10px_rgba(30,64,175,0.4)] leading-none tracking-tight"
                      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
                    >
                      {letra}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* 4. Subtítulo: 'Engenharia e Automação' que sobe */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{
                  opacity: step >= 4 ? 1 : 0,
                  y: step >= 4 ? 0 : 18,
                }}
                transition={{
                  duration: 0.55,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="mt-1 text-[11px] sm:text-xs font-semibold text-[#6b82a6] tracking-wider uppercase font-mono"
              >
                Engenharia e Automação
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Botão sutil para rever animação a qualquer momento */}
      <button
        onClick={startAnimation}
        type="button"
        className="mt-3 flex items-center gap-1.5 text-[10px] font-mono text-slate-500 hover:text-blue-400 transition-colors cursor-pointer px-2.5 py-1 rounded-full hover:bg-slate-800/60"
        title="Reexecutar a animação de apresentação da marca Tesla"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Rever Apresentação</span>
      </button>
    </div>
  );
};
