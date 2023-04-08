import React from 'react'

export interface ButtonProps {
    title: string;
    onClick?: any;
    full?: boolean;
    className?: string;
    icon?: any;
  }

const Button = ({
    title,
    onClick,
    full,
    className,
  }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`btn`}
    >
        {title}
    </button>
    )
}

export default Button