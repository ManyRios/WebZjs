import React from 'react';
import { CircleDashedSvg, CircleSvg } from '../../assets';
import cn from 'classnames';

interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ label, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'px-4 py-2 justify-center items-center gap-1.5 flex rounded-3xl',
        {
          'bg-[#e8e8e8] text-black font-semibold': isActive,
          'bg-transparent text-[#afafaf]': !isActive,
        },
      )}
    >
      <div className="justify-start items-center gap-1 flex">
        {isActive ? <CircleSvg /> : <CircleDashedSvg />}
        <div className="text-center">{label}</div>
      </div>
    </div>
  );
};

export default Tab;
