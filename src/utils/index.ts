import { User } from "../context/userContext";

export function formatCurrency(quantity: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(quantity);
}

export const useValidationUserRoutes = (user: User) => {
  const route = "/detallesProducto/";
  if (!user?.role) {
    return route;
  } else {
    return "/cliente/detallesProducto/";
  }
};
