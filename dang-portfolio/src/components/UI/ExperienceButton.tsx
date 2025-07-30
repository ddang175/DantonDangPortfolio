import React, { useState } from "react";

type ExperienceButtonProps = {
  onButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  [key: string]: any;
};

export default function ExperienceButton({
  onButtonClick,
  className = "",
  ...props
}: ExperienceButtonProps) {
  return (
    <button
      type="button"
      onClick={onButtonClick}
      className={className}
      {...props}
    >
      Experience
    </button>
  );
}
