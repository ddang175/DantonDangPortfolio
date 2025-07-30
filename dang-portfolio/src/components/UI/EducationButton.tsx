import React, { useState } from "react";

interface EducationButtonProps {
  onButtonClick: () => void;
  className?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const EducationButton: React.FC<EducationButtonProps> = ({
  children = "EDUCATION",
  onButtonClick = () => {},
  className = "",
  disabled = false,
  style = {},
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onButtonClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative px-20 py-8 rounded-full
        bg-black text-white
        font-sans text-sm tracking-widest uppercase
        transition-all duration-300 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center
        cursor-pointer
        ${className}
      `}
      style={{
        fontFamily: "Inter, Arial, sans-serif",
        fontSize: "25px",
        background: "linear-gradient(90deg, #000000 0%, #000000 100%)",
        border: "5px solid transparent",
        backgroundImage: `
          linear-gradient(#000000, #000000),
          linear-gradient(90deg,rgb(173, 72, 255),rgb(186, 112, 255),rgb(200, 152, 255),rgb(224, 197, 255))
        `,
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
        ...style,
      }}
    >
      <div
        aria-hidden
        className={`
          absolute inset-0 rounded-full pointer-events-none
          transition-all duration-300 ease-out
          ${isHovered ? "opacity-100" : "opacity-70"}
        `}
        style={{
          background:
            "linear-gradient(90deg, rgb(173, 72, 255),rgb(186, 112, 255),rgb(200, 152, 255),rgb(224, 197, 255))",
          filter: isHovered ? "blur(20px)" : "blur(15px)",
          transform: isHovered ? "scale(1.15)" : "scale(1.1)",
          zIndex: -1,
        }}
      />

      <span
        className={`relative z-10 transition-all duration-300 ${
          isHovered ? "text-white drop-shadow-lg" : "text-gray-200"
        }`}
      >
        {children}
      </span>
    </button>
  );
};

export default EducationButton;
