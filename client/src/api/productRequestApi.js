import { $host } from "./api";

export const createProductRequest = async (
  vendor,
  itemRequired,
  quantityRequired,
  toBeDeliveredOn,
  vendorLocation
) => {
  const { data } = await $host.post("api/product-request", {
    vendor,
    itemRequired,
    quantityRequired,
    toBeDeliveredOn,
    vendorLocation,
  });
  return data;
};
