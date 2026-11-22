'use client';

import React from 'react';

interface FormattedChatMessageProps {
  content: string;
  isUser?: boolean;
}

export default function FormattedChatMessage({ content, isUser }: FormattedChatMessageProps) {
  if (isUser) {
    return <span className="whitespace-pre-wrap leading-relaxed">{content}</span>;
  }

  // Parse lines
  const lines = content.split('\n');

  const formatInlineText = (text: string) => {
    // Replace **bold** with <strong>
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const inner = part.slice(2, -2);
        return (
          <strong key={index} className="font-extrabold text-slate-900">
            {inner}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        const inner = part.slice(1, -1);
        return (
          <em key={index} className="italic text-slate-800">
            {inner}
          </em>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        const inner = part.slice(1, -1);
        return (
          <code
            key={index}
            className="px-1.5 py-0.5 rounded-md bg-slate-100 text-emerald-800 font-mono text-[11px] font-bold border border-slate-200"
          >
            {inner}
          </code>
        );
      }
      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
  };

  return (
    <div className="space-y-2 text-slate-800 text-xs sm:text-sm leading-relaxed">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();

        // Empty line
        if (!trimmed) {
          return <div key={lineIdx} className="h-1.5" />;
        }

        // Section Headers starting with emoji numbers like 1️⃣, 2️⃣, 3️⃣, 4️⃣, 5️⃣ or 1., 2.
        const isCoreHeader = /^(?:[1-5]️⃣|\b[1-5]\.)\s*\*\*(.*?)\*\*(.*)/.exec(trimmed);
        if (isCoreHeader) {
          const numberSymbol = trimmed.slice(0, 3).trim();
          const title = isCoreHeader[1];
          const rest = isCoreHeader[2];
          return (
            <div
              key={lineIdx}
              className="mt-3.5 mb-1.5 pt-2 border-t border-slate-100 first:border-0 first:pt-0"
            >
              <div className="flex items-center gap-1.5 font-black text-slate-900 text-xs sm:text-sm text-emerald-950">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-black">
                  {numberSymbol.replace('️⃣', '')}
                </span>
                <span className="font-bold text-slate-900">{title}</span>
                {rest && <span className="text-slate-600 font-normal">{formatInlineText(rest)}</span>}
              </div>
            </div>
          );
        }

        // Bullet list points starting with • or - or *
        if (trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const textWithoutBullet = trimmed.replace(/^[•\-\*]\s*/, '');
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-1 my-0.5">
              <span className="text-emerald-600 font-bold mt-0.5 select-none">•</span>
              <div className="flex-1 text-slate-700 leading-relaxed font-normal">
                {formatInlineText(textWithoutBullet)}
              </div>
            </div>
          );
        }

        // Title bold lines like 🤖 **Tiêu đề**
        if (trimmed.startsWith('🤖') || trimmed.startsWith('🔋') || trimmed.startsWith('🧴') || trimmed.startsWith('📦') || trimmed.startsWith('🌱')) {
          return (
            <div
              key={lineIdx}
              className="font-bold text-slate-900 text-xs sm:text-sm pb-1 border-b border-emerald-100/80 mb-2 flex items-center gap-1.5"
            >
              {formatInlineText(trimmed)}
            </div>
          );
        }

        // Standard paragraph line
        return (
          <p key={lineIdx} className="text-slate-700 leading-relaxed">
            {formatInlineText(line)}
          </p>
        );
      })}
    </div>
  );
}
