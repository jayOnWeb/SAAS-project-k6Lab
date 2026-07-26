import React from 'react';
import './GlitchText.css';

export default function GlitchText({
  children = 'Glitch',
  speed = 1,
  enableShadows = true,
  enableOnHover = false,
  className = '',
}) {
  const text = React.Children.toArray(children).join('');

  return (
    <span
      className={`glitch-wrapper ${enableOnHover ? 'glitch-hover-only' : ''} ${className}`}
      data-text={text}
      style={{
        '--glitch-speed': `${speed}s`,
      }}
    >
      <span className={`glitch-text ${enableShadows ? 'glitch-shadows' : ''}`} data-text={text}>
        {text}
      </span>
    </span>
  );
}
