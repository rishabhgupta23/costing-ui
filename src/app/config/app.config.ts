export class AppConfig {
  static readonly MENU_ITEMS = [
    {
      label: 'Parts',
      route: '/app/parts',
      icon: 'parts_icon'
    },
    {
      label: 'Vendors',
      route: '/app/vendors',
      icon: 'vendor_icon'
    },
    {
      label: 'Tools',
      route: '/app/tools',
      icon: 'tools_icon'
    },
    {
      label: 'Config',
      route: '/app/config',
      icon: 'config_icon',
    },
    {
      label: 'Settings',
      route: '/app/users',
      position: 'bottom',
      icon: 'setting_icon'
    }
  ];
}
