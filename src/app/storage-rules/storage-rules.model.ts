export interface IStorageRule {
  active?: boolean;
  id?: string;
  isDefault?: boolean;
  name?: string;
}

export interface IStorageRulesRequestConfig {
  storageRuleId?: string;
  storageRuleStatus?: boolean;
  pageSize?: number;
  page?: boolean;
}

export interface ITableHeader {
  name: string;
  sort: boolean;
  reverseList: boolean;
  orderBy: string;
}

export interface ILocationRuleDetails {
  locations: any;
  targets?: {
    _embedded: {
      devices: IDevice[];
      groups: IGroup[];
      users: IUser[];
    };
  };
}

export interface IStorageRuleDetailsResponse {
  active?: boolean;
  created?: string;
  id?: string;
  isDefault?: boolean;
  modified?: string;
  name?: string;
  _embedded?: ILocationRuleDetails;
}

export interface IToPutUpdatedData {
  active?: boolean;
  created?: string;
  id?: string;
  isDefault?: boolean;
  locations?: string[];
  modified?: string;
  name?: string;
  targets?: {
    users: string[];
    devices: string[];
    groups: string[];
  };
}

export const STORAGE_RULES_TABLE_HEADERS: ITableHeader[] = [
  {
    name: 'RULE_NAME',
    sort: false,
    reverseList: false,
    orderBy: 'Name'
  },
  {
    name: 'ENABLED',
    sort: false,
    reverseList: false,
    orderBy: 'Active'
  }
];

// TODO: carry over in own modules
export interface IDevice {
  id: string;
  isAllocated: boolean;
  name: string;
  userFullName: string;
  userId: string;
}

export interface IGroup {
  id: string;
  name: string;
  type: string;
}

export interface IUser {
  active: boolean;
  adUser: boolean;
  email: string;
  forceChangePassword: boolean;
  fullName: string;
  id: string;
  roleName: string;
  userName: string;
}
