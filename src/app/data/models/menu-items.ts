// src/app/shared/models/menu-item.model.ts
import { UserRole } from "src/app/shared/constants/userrole.constants";

export interface MenuItem {
  label: string;
  route?: string;
  icon: string;
  roles: UserRole[];
  position?: 'bottom';
}
