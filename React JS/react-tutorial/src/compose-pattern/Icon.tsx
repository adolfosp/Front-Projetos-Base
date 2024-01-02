import React from 'react';

const Icon: React.FC<{ name: string, color: string, size: number }> = ({ name }) => {
  return <span className={`icon-${name}`}></span>;
};

export default Icon;