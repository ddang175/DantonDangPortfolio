import React, { useState } from "react";

type ProjectsButtonProps = {
  onButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  [key: string]: any;
};

export default function ProjectsButton({
  onButtonClick,
  className = "",
  ...props
}: ProjectsButtonProps) {
  return (
    <button
      type="button"
      onClick={onButtonClick}
      className={className}
      {...props}
    >
      Projects
    </button>
  );
}
