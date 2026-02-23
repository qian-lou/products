'use client';

/**
 * @fileoverview 可调整大小的布局组件
 * @description 提供可拖拽的分隔条来动态调整侧边栏宽度，支持折叠
 * Provides a draggable divider to dynamically resize the sidebar width with collapse support.
 *
 * Time O(1) per event handler, Space O(1) state variables
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

/** 侧边栏宽度约束常量 */
const MIN_WIDTH = 260;
const MAX_WIDTH = 500;
const DEFAULT_WIDTH = 340;

interface ResizableLayoutProps {
    /** 侧边栏内容 */
    sidebar: React.ReactNode;
    /** 主内容区 */
    children: React.ReactNode;
}

export function ResizableLayout({ sidebar, children }: ResizableLayoutProps) {
    const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_WIDTH);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const dividerRef = useRef<HTMLDivElement>(null);
    const prevWidthRef = useRef(DEFAULT_WIDTH);

    /** 拖拽开始 */
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    /** 拖拽过程中的宽度计算 */
    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            // 计算新的侧边栏宽度：鼠标 X 坐标即为宽度
            const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, e.clientX));
            setSidebarWidth(newWidth);
            prevWidthRef.current = newWidth;

            // 如果拖到极小值附近，自动折叠
            if (e.clientX < MIN_WIDTH / 2) {
                setIsCollapsed(true);
                setIsDragging(false);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        // 拖拽中禁止文本选中
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'col-resize';

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        };
    }, [isDragging]);

    /** 切换折叠状态 */
    const toggleCollapse = useCallback(() => {
        setIsCollapsed((prev) => {
            if (prev) {
                // 展开时恢复到之前的宽度
                setSidebarWidth(prevWidthRef.current);
            }
            return !prev;
        });
    }, []);

    // 实际展示宽度：折叠时为 0
    const displayWidth = isCollapsed ? 0 : sidebarWidth;

    return (
        <div className="hidden lg:block">
            {/* 侧边栏容器 */}
            <div
                className="fixed top-0 left-0 h-screen bg-transparent border-r border-slate-200/60 dark:border-white/5 z-10 overflow-hidden shadow-[4px_0_24px_-2px_rgba(0,0,0,0.06),1px_0_6px_-1px_rgba(0,0,0,0.03)] dark:shadow-[4px_0_24px_-2px_rgba(0,0,0,0.4),1px_0_6px_-1px_rgba(0,0,0,0.2)]"
                style={{
                    width: `${displayWidth}px`,
                    transition: isDragging ? 'none' : 'width 0.3s ease',
                }}
            >
                <div
                    className="h-full overflow-y-auto overflow-x-hidden no-scrollbar"
                    style={{ width: `${isCollapsed ? 0 : Math.max(sidebarWidth, MIN_WIDTH)}px` }}
                >
                    {sidebar}
                </div>
            </div>

            {/* 拖拽分隔条 */}
            <div
                ref={dividerRef}
                className="fixed top-0 h-screen z-20 flex items-center group"
                style={{
                    left: `${displayWidth}px`,
                    transition: isDragging ? 'none' : 'left 0.3s ease',
                }}
            >
                {/* 拖拽热区 */}
                <div
                    onMouseDown={handleMouseDown}
                    className="w-4 h-full cursor-col-resize flex items-center justify-center -ml-2"
                >
                    {/* 分隔线视觉指示 */}
                    <div
                        className={`w-[2px] h-full transition-colors duration-200 ${isDragging
                            ? 'bg-slate-400 dark:bg-slate-500'
                            : 'bg-transparent group-hover:bg-slate-300 dark:group-hover:bg-slate-600'
                            }`}
                    />
                </div>

                {/* 折叠/展开按钮 */}
                <button
                    onClick={toggleCollapse}
                    className="absolute top-1/2 -translate-y-1/2 left-0.5 w-4 h-8 rounded-r-md bg-white dark:bg-[#1a1a1a] border border-l-0 border-slate-200 dark:border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-200 shadow-sm"
                    aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? (
                        <PanelLeftOpen size={12} className="text-slate-500 dark:text-slate-400" />
                    ) : (
                        <PanelLeftClose size={12} className="text-slate-500 dark:text-slate-400" />
                    )}
                </button>
            </div>

            {/* 主内容区 */}
            <div
                className="h-screen overflow-y-auto bg-transparent transition-colors duration-300"
                style={{
                    marginLeft: `${displayWidth}px`,
                    transition: isDragging ? 'margin-left 0s' : 'margin-left 0.3s ease',
                }}
            >
                {children}
            </div>
        </div>
    );
}
