import React, { useEffect, useRef } from 'react';
import { useWeather } from '../context/WeatherContext';

export function BackgroundCanvas() {
  const canvasRef = useRef(null);
  const { themeInfo } = useWeather();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let particles = [];
    let shootingStars = [];
    let lightningAlpha = 0;
    let animId = null;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const initParticles = () => {
      particles = [];
      shootingStars = [];
      const mode = themeInfo.animation || 'sun';
      const isDay = themeInfo.isDay;

      if (mode.includes('rain')) {
        const isHeavy = mode.includes('heavy') || mode === 'thunderstorm';
        const total = isHeavy ? Math.min(260, Math.floor(width / 4)) : Math.min(130, Math.floor(width / 8));
        for (let i = 0; i < total; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            len: Math.random() * 20 + 15,
            speed: Math.random() * 12 + 16,
            alpha: Math.random() * 0.4 + 0.2
          });
        }
      } else if (mode.includes('snow')) {
        const isHeavy = mode.includes('heavy');
        const total = isHeavy ? Math.min(180, Math.floor(width / 6)) : Math.min(100, Math.floor(width / 10));
        for (let i = 0; i < total; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 3.5 + 1,
            speed: Math.random() * 1.5 + 0.8,
            swaySpeed: Math.random() * 0.02 + 0.01,
            swayOffset: Math.random() * Math.PI * 2,
            alpha: Math.random() * 0.6 + 0.3
          });
        }
      } else if (!isDay) {
        const total = Math.min(220, Math.floor(width / 5));
        for (let i = 0; i < total; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.8 + 0.4,
            alpha: Math.random() * 0.8 + 0.2,
            twinkleSpeed: Math.random() * 0.04 + 0.01,
            twinkleOffset: Math.random() * Math.PI * 2
          });
        }
      } else if (mode === 'mist' || mode === 'clouds') {
        const total = 18;
        for (let i = 0; i < total; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height * 0.7,
            radius: Math.random() * 120 + 80,
            speed: Math.random() * 0.3 + 0.1,
            alpha: Math.random() * 0.06 + 0.02
          });
        }
      } else {
        const total = Math.min(45, Math.floor(width / 25));
        for (let i = 0; i < total; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 4 + 1.5,
            speedY: -(Math.random() * 0.6 + 0.2),
            speedX: Math.random() * 0.4 - 0.2,
            alpha: Math.random() * 0.4 + 0.2,
            pulse: Math.random() * Math.PI * 2
          });
        }
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);
    initParticles();

    const loop = () => {
      ctx.clearRect(0, 0, width, height);
      const mode = themeInfo.animation || 'sun';
      const isDay = themeInfo.isDay;

      if (mode.includes('rain') || mode === 'thunderstorm') {
        ctx.strokeStyle = 'rgba(186, 230, 253, 0.5)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (let p of particles) {
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 2, p.y + p.len);
          p.y += p.speed;
          p.x -= 1;
          if (p.y > height) {
            p.y = -p.len;
            p.x = Math.random() * (width + 50);
          }
        }
        ctx.stroke();

        if (mode === 'thunderstorm') {
          if (lightningAlpha <= 0 && Math.random() < 0.006) {
            lightningAlpha = Math.random() * 0.4 + 0.2;
          }
          if (lightningAlpha > 0) {
            ctx.fillStyle = `rgba(238, 242, 255, ${lightningAlpha})`;
            ctx.fillRect(0, 0, width, height);
            lightningAlpha -= 0.04;
          }
        }
      } else if (mode.includes('snow')) {
        for (let p of particles) {
          p.swayOffset += p.swaySpeed;
          p.x += Math.sin(p.swayOffset) * 0.8;
          p.y += p.speed;
          if (p.y > height) {
            p.y = -p.radius * 2;
            p.x = Math.random() * width;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
          ctx.fill();
        }
      } else if (!isDay) {
        for (let p of particles) {
          p.twinkleOffset += p.twinkleSpeed;
          const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.twinkleOffset));
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(241, 245, 249, ${Math.max(0.1, currentAlpha)})`;
          ctx.fill();
        }
      } else if (mode === 'mist' || mode === 'clouds') {
        for (let p of particles) {
          p.x += p.speed;
          if (p.x - p.radius > width) {
            p.x = -p.radius;
            p.y = Math.random() * height * 0.7;
          }
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
          grad.addColorStop(0, `rgba(255, 255, 255, ${p.alpha})`);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        for (let p of particles) {
          p.pulse += 0.02;
          p.y += p.speedY;
          p.x += p.speedX;
          if (p.y < -10) p.y = height + 10;
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          const currentAlpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(253, 224, 71, ${currentAlpha})`;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [themeInfo]);

  return <canvas id="weather-canvas" ref={canvasRef} />;
}
