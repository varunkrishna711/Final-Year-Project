import { $host } from "./api";

export const fetchNearybyProducers = async (lat, lgt) => {
  const { data } = await $host.get("api/user/get-producers-nearby", {
    params: {
      lat,
      lgt,
    },
  });
  return data;
};
