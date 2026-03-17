// src/components/chat/MessageContent.jsx
import React from 'react';

// This regex finds URLs in a string.
const urlRegex = /(https?:\/\/[^\s]+)/g;

export function MessageContent({ text }) {
  if (!text) {
    return null;
  }

  const parts = text.split(urlRegex);

  return (
    <p className="text-base sm:text-sm break-words whitespace-pre-wrap">
      {parts.map((part, index) => {
        if (part.match(urlRegex)) {
          return (
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c0672a] hover:text-[#1a2b4b] font-bold underline transition-colors"
              onClick={(e) => e.stopPropagation()} // Prevents clicks from bubbling up if the bubble itself is clickable
            >
              {part}
            </a>
          );
        }
        return part;
      })}
    </p>
  );
}
