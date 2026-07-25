"use client";

import React, { useState } from 'react';
import './Folder.css';

const darkenColor = (hex: string, percent: number) => {
  let color = hex.startsWith('#') ? hex.slice(1) : hex;
  if (color.length === 3) {
    color = color
      .split('')
      .map(c => c + c)
      .join('');
  }
  const num = parseInt(color.slice(0, 6), 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

interface FolderProps {
  color?: string;
  size?: number;
  items?: React.ReactNode[];
  className?: string;
  title?: string;
  icon?: React.ElementType;
}

const Folder = ({ color = '#5227FF', size = 1, items = [], className = '', title, icon: Icon }: FolderProps) => {
  const maxItems = 3;
  const papers = items.slice(0, maxItems);
  while (papers.length < maxItems) {
    papers.push(null);
  }

  const [open, setOpen] = useState(false);
  const [paperOffsets, setPaperOffsets] = useState(Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })));

  const folderBackColor = darkenColor(color, 0.18);
  const paper1 = darkenColor('#1e293b', 0.05);
  const paper2 = darkenColor('#0f172a', 0.05);
  const paper3 = '#020617';

  const handleClick = (e: React.MouseEvent) => {
    // Only toggle if target isn't inside a paper link
    if ((e.target as HTMLElement).closest('.paper-content-link')) {
      return;
    }
    setOpen(prev => !prev);
    if (open) {
      setPaperOffsets(Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })));
    }
  };

  const handlePaperMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (!open) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (e.clientX - centerX) * 0.15;
    const offsetY = (e.clientY - centerY) * 0.15;
    setPaperOffsets(prev => {
      const newOffsets = [...prev];
      newOffsets[index] = { x: offsetX, y: offsetY };
      return newOffsets;
    });
  };

  const handlePaperMouseLeave = (index: number) => {
    setPaperOffsets(prev => {
      const newOffsets = [...prev];
      newOffsets[index] = { x: 0, y: 0 };
      return newOffsets;
    });
  };

  const folderStyle = {
    '--folder-color': color,
    '--folder-back-color': folderBackColor,
    '--paper-1': paper1,
    '--paper-2': paper2,
    '--paper-3': paper3
  } as React.CSSProperties;

  const folderClassName = `folder ${open ? 'open' : ''}`.trim();
  const scaleStyle = { transform: `scale(${size})`, transformOrigin: 'top center' };

  return (
    <div style={scaleStyle} className={className}>
      <div
        className={folderClassName}
        style={folderStyle}
        onClick={handleClick}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(prev => !prev);
          }
        }}
        tabIndex={0}
        role="button"
        aria-expanded={open}
        aria-label={open ? 'Close folder' : 'Open folder'}
      >
        <div className="folder__back">
          {papers.map((item, i) => (
            <div
              key={i}
              className={`paper paper-${i + 1}`}
              onMouseMove={e => handlePaperMouseMove(e, i)}
              onMouseLeave={() => handlePaperMouseLeave(i)}
              style={
                open
                  ? {
                      transform: `translate(${i === 0 ? '-125%' : i === 1 ? '25%' : '-50%'}, ${
                        i === 2 ? '-115%' : '-85%'
                      }) rotateZ(${i === 0 ? '-12deg' : i === 1 ? '12deg' : '0deg'}) translate(${
                        paperOffsets[i]?.x || 0
                      }px, ${paperOffsets[i]?.y || 0}px)`
                    }
                  : {}
              }
            >
              {item}
            </div>
          ))}

          <div className="folder__front">
            <div className="flex items-center space-x-3">
              {Icon && (
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0 border border-white/20 text-white shadow-inner">
                  <Icon className="w-4 h-4" />
                </div>
              )}
              {title && (
                <span className="font-manrope font-extrabold text-base text-white tracking-tight drop-shadow-md">
                  {title}
                </span>
              )}
            </div>
            <div className="text-[11px] font-mono font-bold text-white/70 tracking-wider uppercase">
              {open ? 'Click to Close' : 'Click to Open'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Folder;
