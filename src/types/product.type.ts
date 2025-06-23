export interface ProductImageData {
  src: string;
  alt: string;
  quote: string;
  name: string;
}
export interface Product {
  _id: string;
  name: string;
  unit: string;
  code: string;
  price: number;
  stock: number;
  sales: number;
  __v: number;
  type: string;
}
export interface ProductCartItem extends Product {
  quantity: number;
}