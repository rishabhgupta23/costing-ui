import { User } from "../data/models/user";

export const MOCK_USER_LIST: User[] = [
  {
    userId: 1,
    displayName: 'Yash Agarwal',
    emailId: 'yash@example.com',
    roleId: 1,
    roleName: 'Super Admin',
  },
  {
    userId: 2,
    displayName: 'aaaa',
    emailId: 'aaaa@example.com',
    roleId: 2,
    roleName: 'Admin',
  },
  {
    userId: 3,
    displayName: 'qqq',
    emailId: 'qqq@example.com',
    roleId: 4,
    roleName: 'Guest',
  }
];

export const MOCK_USER_PAGINATION_RESPONSE = {
  data: MOCK_USER_LIST,
  pageInfo: {
    totalRecords: MOCK_USER_LIST.length,
    pageNo: 0,
    pageSize: 10,
  }
};