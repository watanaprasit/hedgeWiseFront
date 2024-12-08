import React from 'react';
import { SidebarContainer, SidebarLink } from './Sidebar.styles';

const Sidebar = () => {
  return (
    <SidebarContainer>
      <SidebarLink href="/dashboard">Dashboard</SidebarLink>
      <SidebarLink href="/commodity-risk">Commodity Price Risk</SidebarLink>
      <SidebarLink href="/fx-risk">FX Risk</SidebarLink>
      <SidebarLink href="/geopolitical-risk">Geopolitical Risk</SidebarLink>
    </SidebarContainer>
  );
};

export default Sidebar;


