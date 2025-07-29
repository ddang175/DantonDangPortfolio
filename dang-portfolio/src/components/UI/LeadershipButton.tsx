import React, { useState } from "react";

type LeadershipButtonProps = {
  onButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  [key: string]: any;
};

export default function LeadershipButton({
  onButtonClick,
  className = "",
  ...props
}: LeadershipButtonProps) {
  return (
    <button
      type="button"
      onClick={onButtonClick}
      className={className}
      {...props}
    >
      Leadership
    </button>
  );
}
