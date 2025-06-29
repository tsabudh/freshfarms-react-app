import type { FilterObject } from "types/filter.types.ts";
import API_ROUTE from "../assets/globals/baseRoute";

export const fetchTransactions = async (
  jwtToken: string,
  filterObject: FilterObject,
  page?:number,
  limit?:number,
) => {
  const filterString = JSON.stringify(filterObject);
  const filterParam = btoa(filterString);

  const url = new URL('/api/v1/transactions', API_ROUTE);

if(page) url.searchParams.set('page', page.toString());
if(limit) url.searchParams.set('limit', limit.toString())
url.searchParams.set('filter', filterParam);

const finalUrl = url.toString();
  const response = await fetch(
    finalUrl,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`, // If needed
      },
      credentials: "include", // Important: includes cookies (like refresh token/session)
    }
  );

  const data = await response.json();

  if (data.status === "success") {
    return data;
  } else {
    throw data;
  }
};
