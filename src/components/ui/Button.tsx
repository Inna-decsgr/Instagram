import React from 'react';

type Props = {
  text: string;
  onClick: () => void;
  red?: boolean;
  disabled?: boolean;
}

export default function Button({text, onClick, red, disabled = false}: Props) {
  return (
    <button
      className={`border-none rounded-md p-2 px-8  font-bold leading-4 ${red? 'bg-gray-200' : 'text-white bg-sky-500'} ${disabled && 'opacity-80'}`} 
      onClick={() => onClick()}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

