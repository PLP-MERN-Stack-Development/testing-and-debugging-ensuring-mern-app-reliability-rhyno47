import React from 'react';

export default function Button({ variant = 'primary', size = 'md', disabled = false, className = '', onClick, children, ...rest }) {
  const classes = [
    `btn-${variant}`,
    `btn-${size}`,
    disabled ? 'btn-disabled' : '',
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (disabled) return;
    if (onClick) onClick(e);
  };

  return (
    <button className={classes} disabled={disabled} onClick={handleClick} {...rest}>
      {children}
    </button>
  );
}
