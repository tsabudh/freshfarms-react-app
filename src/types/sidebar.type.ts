export type SubMenuItem = {
  title: string;
  path: string;
  identity: 'sub-menu' | 'menu';
  adminOnly?: boolean;
};

export type SidebarMenuItem = {
  title: string;
  icon?: string;
  identity: 'menu';
  path?: string;
  adminOnly?: boolean;
  children?: SubMenuItem[];
};