import React from 'react';

import SidebarNew from '../components/SidebarNew';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className='h-screen flex'>
      <SidebarNew />
      <div className='flex-1 p-8 bg-white'>{children}</div>
    </div>
  );
};

export default MainLayout;
