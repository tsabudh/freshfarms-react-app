export type IssuedTimeFilter = {
  isOpened?: boolean;
  from: string | number | Date;
  to: string | number | Date;
  isSorted?: boolean;
  order?: number;
};

export type SetFilter = {
  isOpened: boolean;
  set: Set<string>;
  isSorted: boolean;
  order?: number;
};

export type RangeFilter = {
  isOpened: boolean;
  from: string | number | Date;
  to: string | number | Date;
  isSorted: boolean;
  order?: number;
};

export type FilterState = {
  issuedTime: IssuedTimeFilter;
  products: SetFilter;
  customers: SetFilter;
  totalQuantity: RangeFilter;
  itemsVariety: RangeFilter;
};

export type FilterAction = {
  type:
    | "sortBy"
    | "issuedTime"
    | "products"
    | "customers"
    | "totalQuantity"
    | "itemsVariety";
  update?: string; // keys inside each mapping (could be further narrowed with unions if you want)
  state?: boolean;
  order?: string | number;
  from?: number | string;
  to?: number | string;
  newProduct?: string;
  selected?: string;
  newCustomer?: string;
};

type SortDirection = 1 | -1; // 1 for ascending, -1 for descending
// type SortDirection = 'asc' | 'desc';

type SortByFields = {
  issuedTime?: number;
  customer?: number;
  totalQuantity?: number;
  itemsVariety?: number;
};

type TotalRangeFilter = {
  from: number;
  to: number;
};

export type FilterObject = {
  sortBy: SortByFields;
  issuedTime?: IssuedTimeFilter;
  productArray?: string[]; // assuming product IDs are strings
  customerId?: string; // single customer
  customerArray?: string[]; // multiple customers
  totalQuantity?: TotalRangeFilter;
  itemsVariety?: TotalRangeFilter;
};
