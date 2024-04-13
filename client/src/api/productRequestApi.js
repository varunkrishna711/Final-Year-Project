import { $host } from "./api";

export const createProductRequest = async (
  vendorId,
  itemRequired,
  quantityRequired,
  toBeDeliveredOn,
  vendorLocation
) => {
  const { data } = await $host.post("api/product-request", {
    vendorId,
    itemRequired,
    quantityRequired,
    toBeDeliveredOn,
    vendorLocation,
  });
  return data;
};
