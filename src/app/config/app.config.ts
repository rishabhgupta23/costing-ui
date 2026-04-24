import { MenuItem } from "../data/models/menu-items";
import { UserRole } from "../shared/constants/userrole.constants";

export class AppConfig {
  static readonly MENU_ITEMS: MenuItem[]= [
    {
      label: 'Parts',
      route: '/app/parts',
      icon: 'parts_icon',
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MAINTAINER, UserRole.GUEST]
    },
    {
      label: 'Vendors',
      route: '/app/vendors',
      icon: 'vendor_icon',
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MAINTAINER, UserRole.GUEST]
    },
    {
      label: 'Tools',
      route: '/app/tools',
      icon: 'tools_icon',
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MAINTAINER, UserRole.GUEST]
    },
    {
      label: 'Config',
      route: '/app/config',
      icon: 'config_icon',
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN]
    },
    {
      label: 'Settings',
      route: '/app/users',
      position: 'bottom',
      icon: 'setting_icon',
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN]
    },
    {
      label: 'Logout',
      icon: 'logout_icon',
      position: 'bottom',
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MAINTAINER, UserRole.GUEST]
    }
  ];
}
