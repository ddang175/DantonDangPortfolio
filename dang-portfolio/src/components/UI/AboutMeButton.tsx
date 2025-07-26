import React, { useState } from 'react';

type AboutMeButtonProps = {
  onButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  [key: string]: any;
};

export default function AboutMeButton({ onButtonClick, className = "", ...props }: AboutMeButtonProps) {
  return (
    <button type="button" onClick={onButtonClick} className={className} {...props}>
      About Me
    </button>
  );
}