'use client';

/**
 * @fileoverview HTML5 Canvas Fluid Random Particle Flow Background
 * @description O(N) strict bounds flow field particle engine with fading motion trails.
 *
 * Performance: GPU accelerated via Canvas. React renders exactly once.
 */

import React, { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    speed: number;
    size: number;
    angle: number;

    constructor(w: number, h: number) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = 0;
        this.vy = 0;
        this.speed = Math.random() * 1.5 + 0.5; // 加快流速，保证流动视觉明显
        this.size = Math.random() * 1.5 + 0.5;
        this.angle = Math.random() * Math.PI * 2;
    }

    // Time: O(1)
    update(w: number, h: number, time: number) {
        // Pseudo-random noise field using trigonometry to simulate fluid vortices
        const nx = this.x * 0.003;
        const ny = this.y * 0.003;

        // Fluid swirling angle (产生复杂流体的关键公式)
        const angle =
            Math.sin(nx + time) * 2 +
            Math.cos(ny - time) * 2 +
            Math.sin(nx * ny) * Math.PI;

        // 基于流体角度产生牵引力，平滑转向
        const targetVx = Math.cos(angle) * this.speed;
        const targetVy = Math.sin(angle) * this.speed;

        this.vx += (targetVx - this.vx) * 0.05;
        this.vy += (targetVy - this.vy) * 0.05;

        this.x += this.vx;
        this.y += this.vy;

        // Wrap around seamlessly
        if (this.x < -10) this.x = w + 10;
        if (this.x > w + 10) this.x = -10;
        if (this.y < -10) this.y = h + 10;
        if (this.y > h + 10) this.y = -10;
    }

    // Time: O(1)
    draw(ctx: CanvasRenderingContext2D, color: string) {
        ctx.beginPath();
        // 绘制从上一帧位置到当前位置的线段，视觉上形成平滑残影 (Trails)
        ctx.moveTo(this.x - this.vx, this.y - this.vy);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = this.size;
        ctx.lineCap = 'round';
        ctx.stroke();
    }
}

export function DynamicBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let particles: Particle[] = [];
        let animationFrameId: number;
        let w = window.innerWidth;
        let h = window.innerHeight;

        // 为追求极致震撼，大幅增加粒子密度上限至 800+
        const calculateParticleCount = () => {
            const area = (w * h) / 1500;
            return Math.min(Math.floor(area), 800);
        };

        let pCount = calculateParticleCount();
        let mouse = { x: -1000, y: -1000 };

        const handleResize = () => {
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = w;
            canvas.height = h;

            const newCount = calculateParticleCount();
            if (newCount > pCount) {
                for (let i = 0; i < newCount - pCount; i++) {
                    particles.push(new Particle(w, h));
                }
            }
            pCount = newCount;
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        };

        handleResize();
        for (let i = 0; i < pCount; i++) {
            particles.push(new Particle(w, h));
        }

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        const isDark = resolvedTheme === 'dark';

        // 延长尾迹残影的留存时间，营造出极强的流体丝带感 (降低透明度)
        const fadeColor = isDark ? 'rgba(18, 18, 18, 0.05)' : 'rgba(248, 250, 252, 0.08)';

        // 粒子基础颜色 (仅 Light Mode 默认使用)
        const baseColorRaw = '15, 23, 42';

        let time = Math.random() * 100;

        const animate = () => {
            // 利用半透明背景覆盖上一帧，实现经典的 Flow Field 流体拖尾效果
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = fadeColor;
            ctx.fillRect(0, 0, w, h);

            // 震撼的发光叠加图层模式 (Light Mode 也可以用，但暗色下效果最惊艳)
            if (isDark) {
                ctx.globalCompositeOperation = 'lighter';
            }

            // 让时间流速适中，既不杂乱也充满生机
            time += 0.0015;

            for (let i = 0; i < particles.length; i++) {
                let p = particles[i];

                // 鼠标产生极强的排斥乱流（暴波效果）
                const dxMouse = p.x - mouse.x;
                const dyMouse = p.y - mouse.y;
                const distMouseSq = dxMouse * dxMouse + dyMouse * dyMouse;

                if (distMouseSq < 100000) {
                    const force = (100000 - distMouseSq) / 100000;
                    p.vx += dxMouse * force * 0.015;
                    p.vy += dyMouse * force * 0.015;
                }

                p.update(w, h, time);

                // 震撼的动态色彩渲染 (基于粒子当前的切线角度+时间，生成迷幻的 HSL 极光渐变色)
                let color;
                if (isDark) {
                    const opacity = (0.4 + (i % 5) * 0.1).toFixed(2);
                    const hue = Math.abs((p.angle * (180 / Math.PI) + time * 60) % 360);
                    // 暗色模式下：高饱和、高亮度发光星云
                    color = `hsla(${hue}, 100%, 65%, ${opacity})`;
                } else {
                    const opacity = (0.2 + (i % 5) * 0.1).toFixed(2);
                    // 浅色模式下：墨水质感的深色流体
                    color = `rgba(${baseColorRaw}, ${opacity})`;
                }

                p.draw(ctx, color);
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        // 初始化一帧纯色背景以防白屏或者颜色突变错乱
        ctx.fillStyle = isDark ? '#121212' : '#f8fafc';
        ctx.fillRect(0, 0, w, h);

        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, [resolvedTheme]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none z-[-1]"
            aria-hidden="true"
        />
    );
}
