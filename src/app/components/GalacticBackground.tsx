import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import sunsetMountains from '@/assets/sunset-mountains.jpg';

interface Star {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  temperature: 'cool' | 'neutral' | 'warm';
  glow: number;
}

interface ShootingStar {
  progress: number;
  speed: number;
  startX: number;
  startY: number;
  length: number;
  angle: number;
  opacity: number;
}

interface GalacticBackgroundProps {
  mode?: 'sunset' | 'moon';
}

export function GalacticBackground({ mode = 'moon' }: GalacticBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isSunset = mode === 'sunset';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar tamaño del canvas
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Crear estrellas
    const stars: Star[] = [];
    const starCount = 260;
    const shootingStars: ShootingStar[] = [];
    const cloudSeeds = Array.from({ length: 7 }, (_, index) => ({
      x: (index / 6) * 1.1 - 0.05,
      y: 0.18 + ((index * 17) % 27) / 100,
      radius: 0.16 + ((index * 13) % 9) / 100,
      opacity: 0.08 + ((index * 11) % 8) / 100,
      drift: 0.0018 + (index % 3) * 0.0007,
      width: 1.6 + (index % 4) * 0.3,
    }));

    for (let i = 0; i < starCount; i++) {
      const toneSeed = Math.random();
      const clusterBias = Math.random();
      const x = clusterBias > 0.72
        ? canvas.width * (0.2 + Math.random() * 0.6)
        : Math.random() * canvas.width;
      const y = clusterBias > 0.72
        ? canvas.height * (0.08 + Math.random() * 0.48)
        : Math.random() * canvas.height * 0.92;
      stars.push({
        x,
        y,
        size: Math.random() > 0.9 ? Math.random() * 1.8 + 1.4 : Math.random() * 1.15 + 0.2,
        baseOpacity: Math.random() * 0.55 + 0.2,
        twinkleSpeed: Math.random() * 0.015 + 0.004,
        twinkleOffset: Math.random() * Math.PI * 2,
        temperature: toneSeed > 0.82 ? 'warm' : toneSeed < 0.18 ? 'cool' : 'neutral',
        glow: Math.random() > 0.84 ? Math.random() * 2.8 + 1.8 : Math.random() * 1.2 + 0.8,
      });
    }

    // Animación
    let animationFrameId: number;
    let frame = 0;

    const getStarColor = (temperature: Star['temperature'], opacity: number) => {
      if (temperature === 'warm') return `rgba(255, 234, 205, ${opacity})`;
      if (temperature === 'cool') return `rgba(207, 225, 255, ${opacity})`;
      return `rgba(248, 249, 255, ${opacity})`;
    };

    const drawAtmosphericVignette = () => {
      const vignette = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height * 0.42,
        canvas.width * 0.12,
        canvas.width / 2,
        canvas.height * 0.42,
        canvas.width * 0.78,
      );

      if (isSunset) {
        vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
        vignette.addColorStop(0.7, 'rgba(33, 17, 45, 0.08)');
        vignette.addColorStop(1, 'rgba(14, 9, 24, 0.26)');
      } else {
        vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
        vignette.addColorStop(0.74, 'rgba(4, 6, 18, 0.16)');
        vignette.addColorStop(1, 'rgba(1, 2, 8, 0.42)');
      }

      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const drawSunsetClouds = () => {
      cloudSeeds.forEach((cloud, index) => {
        const driftX = Math.sin(frame * cloud.drift + index) * canvas.width * 0.035;
        const centerX = canvas.width * cloud.x + driftX;
        const centerY = canvas.height * cloud.y;
        const radius = canvas.width * cloud.radius;
        const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.08, centerX, centerY, radius);
        gradient.addColorStop(0, `rgba(255, 220, 198, ${cloud.opacity})`);
        gradient.addColorStop(0.42, `rgba(248, 181, 154, ${cloud.opacity * 0.74})`);
        gradient.addColorStop(1, 'rgba(248, 170, 145, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(centerX - radius, centerY - radius * cloud.width * 0.18, radius * 2, radius * cloud.width * 0.36);
      });
    };

    const drawNightMist = () => {
      const band = ctx.createLinearGradient(0, canvas.height * 0.62, 0, canvas.height);
      band.addColorStop(0, 'rgba(10, 16, 34, 0)');
      band.addColorStop(0.42, 'rgba(10, 16, 34, 0.04)');
      band.addColorStop(1, 'rgba(4, 6, 16, 0.14)');
      ctx.fillStyle = band;
      ctx.fillRect(0, canvas.height * 0.58, canvas.width, canvas.height * 0.42);
    };

    const spawnShootingStar = () => {
      shootingStars.push({
        progress: 0,
        speed: 0.012 + Math.random() * 0.01,
        startX: canvas.width * (0.15 + Math.random() * 0.55),
        startY: canvas.height * (0.08 + Math.random() * 0.24),
        length: 90 + Math.random() * 120,
        angle: -0.55 + Math.random() * 0.18,
        opacity: 0.45 + Math.random() * 0.35,
      });
    };

    const drawShootingStars = () => {
      if (!isSunset && shootingStars.length < 2 && Math.random() < 0.0065) {
        spawnShootingStar();
      }

      for (let index = shootingStars.length - 1; index >= 0; index -= 1) {
        const meteor = shootingStars[index];
        meteor.progress += meteor.speed;

        const headX = meteor.startX + Math.cos(meteor.angle) * meteor.progress * canvas.width * 0.42;
        const headY = meteor.startY + Math.sin(meteor.angle) * meteor.progress * canvas.width * 0.42;
        const tailX = headX - Math.cos(meteor.angle) * meteor.length;
        const tailY = headY - Math.sin(meteor.angle) * meteor.length;
        const alpha = Math.max(0, (1 - meteor.progress) * meteor.opacity);

        const gradient = ctx.createLinearGradient(headX, headY, tailX, tailY);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        gradient.addColorStop(0.25, `rgba(210, 228, 255, ${alpha * 0.9})`);
        gradient.addColorStop(1, 'rgba(210, 228, 255, 0)');

        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.4;
        ctx.lineCap = 'round';
        ctx.moveTo(headX, headY);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.arc(headX, headY, 1.5, 0, Math.PI * 2);
        ctx.fill();

        if (meteor.progress >= 1) {
          shootingStars.splice(index, 1);
        }
      }
    };

    const animate = () => {
      frame += 1;
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);

      if (isSunset) {
        gradient.addColorStop(0, '#17214d');
        gradient.addColorStop(0.22, '#3f346a');
        gradient.addColorStop(0.48, '#8b4b72');
        gradient.addColorStop(0.68, '#df7b63');
        gradient.addColorStop(0.84, '#f8af76');
        gradient.addColorStop(1, '#2e1730');
      } else {
        gradient.addColorStop(0, '#02040f');
        gradient.addColorStop(0.18, '#07102a');
        gradient.addColorStop(0.52, '#091329');
        gradient.addColorStop(0.82, '#050813');
        gradient.addColorStop(1, '#010203');
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (isSunset) {
        drawSunsetClouds();

        const haze = ctx.createLinearGradient(0, 0, 0, canvas.height);
        haze.addColorStop(0, 'rgba(26, 31, 72, 0.14)');
        haze.addColorStop(0.42, 'rgba(255, 173, 132, 0.06)');
        haze.addColorStop(1, 'rgba(9, 11, 28, 0.2)');
        ctx.fillStyle = haze;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        const nebula = ctx.createRadialGradient(
          canvas.width * 0.6,
          canvas.height * 0.2,
          0,
          canvas.width * 0.6,
          canvas.height * 0.2,
          canvas.width * 0.34,
        );
        nebula.addColorStop(0, 'rgba(66, 96, 178, 0.045)');
        nebula.addColorStop(0.45, 'rgba(46, 68, 142, 0.018)');
        nebula.addColorStop(1, 'rgba(46, 68, 142, 0)');
        ctx.fillStyle = nebula;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawNightMist();
      }

      stars.forEach(star => {
        const twinkle = (Math.sin(frame * star.twinkleSpeed + star.twinkleOffset) + 1) / 2;
        const opacity = isSunset
          ? Math.max(0.015, Math.min(0.16, star.baseOpacity * 0.2 + twinkle * 0.05))
          : Math.max(0.18, Math.min(0.95, star.baseOpacity * 0.72 + twinkle * 0.28));
        const starColor = getStarColor(star.temperature, opacity);
        const glowOpacity = isSunset ? opacity * 0.18 : opacity * 0.26;

        // Dibujar estrella
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = starColor;
        ctx.fill();

        // Brillo adicional para algunas estrellas
        if (star.size > 1.15) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * star.glow, 0, Math.PI * 2);
          ctx.fillStyle = getStarColor(star.temperature, glowOpacity);
          ctx.fill();
        }
      });

      drawShootingStars();

      drawAtmosphericVignette();

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isSunset]);

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed inset-0 h-full w-full object-cover"
        initial={false}
        animate={{
          opacity: isSunset ? 1 : 0,
          scale: isSunset ? 1.035 : 1.055,
          filter: isSunset
            ? 'blur(0px) saturate(1.12) contrast(1.05) brightness(0.96)'
            : 'blur(6px) saturate(0.92)',
        }}
        transition={{ duration: 0.9, ease: 'easeInOut' }}
        style={{
          zIndex: 0,
          backgroundImage: `linear-gradient(180deg, rgba(8, 10, 28, 0.1) 0%, rgba(24, 18, 36, 0.04) 26%, rgba(255, 155, 102, 0.06) 68%, rgba(6, 7, 18, 0.18) 100%), url(${sunsetMountains})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 58%',
          backgroundRepeat: 'no-repeat',
          transformOrigin: 'center center',
        }}
      />

      <motion.div
        aria-hidden="true"
        className="fixed inset-0"
        initial={false}
        animate={{
          opacity: isSunset ? 1 : 0,
          background:
            'radial-gradient(circle at 50% 74%, rgba(255, 199, 135, 0.46) 0%, rgba(255, 169, 108, 0.24) 18%, rgba(255, 169, 108, 0.08) 34%, rgba(255, 169, 108, 0) 56%)',
        }}
        transition={{ duration: 0.95, ease: 'easeInOut' }}
        style={{ zIndex: 0 }}
      />

      <motion.div
        aria-hidden="true"
        className="fixed inset-0"
        initial={false}
        animate={{
          opacity: isSunset ? 1 : 0,
          background:
            'linear-gradient(180deg, rgba(13,18,46,0.18) 0%, rgba(77,56,92,0.10) 24%, rgba(245,153,112,0.08) 54%, rgba(255,214,168,0.14) 76%, rgba(8,7,17,0.26) 100%)',
        }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        style={{ zIndex: 0, mixBlendMode: 'screen' }}
      />

      <motion.div
        aria-hidden="true"
        className="fixed inset-0"
        initial={false}
        animate={{
          opacity: isSunset ? 1 : 0,
          background:
            'linear-gradient(180deg, rgba(10,12,32,0.14) 0%, rgba(42,22,38,0.08) 32%, rgba(255,163,110,0.06) 68%, rgba(10,8,20,0.16) 100%)',
        }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        style={{ zIndex: 0 }}
      />

      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 bottom-0 h-[34vh]"
        initial={false}
        animate={{
          opacity: isSunset ? 1 : 0,
          y: isSunset ? 0 : 20,
        }}
        transition={{ duration: 0.85, ease: 'easeInOut' }}
        style={{
          zIndex: 0,
          background:
            'linear-gradient(180deg, rgba(20,16,34,0) 0%, rgba(13,10,22,0.22) 28%, rgba(8,7,14,0.52) 72%, rgba(3,3,7,0.82) 100%)',
        }}
      />

      <motion.div
        aria-hidden="true"
        className="fixed inset-0"
        initial={false}
        animate={{
          opacity: isSunset ? 0 : 1,
          background:
            'radial-gradient(circle at 50% 28%, rgba(126,150,255,0.08) 0%, rgba(14,18,35,0) 38%), linear-gradient(180deg, rgba(3,5,16,0.08) 0%, rgba(2,3,9,0.22) 100%)',
        }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        style={{ zIndex: 0 }}
      />

      <motion.canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full"
        initial={false}
        animate={{
          opacity: isSunset ? 0.12 : 1,
          scale: isSunset ? 1.01 : 1,
        }}
        transition={{ duration: 0.85, ease: 'easeInOut' }}
        style={{ zIndex: 0 }}
      />
    </>
  );
}
