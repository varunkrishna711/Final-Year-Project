const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Radius of the Earth in kilometers
  const R = 6371;

  // Convert latitude and longitude from degrees to radians
  const radLat1 = (Math.PI / 180) * lat1;
  const radLon1 = (Math.PI / 180) * lon1;
  const radLat2 = (Math.PI / 180) * lat2;
  const radLon2 = (Math.PI / 180) * lon2;

  // Differences between coordinates
  const dLat = radLat2 - radLat1;
  const dLon = radLon2 - radLon1;

  // Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radLat1) *
      Math.cos(radLat2) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distance in kilometers
  const distance = R * c;

  return distance;
};

module.exports = calculateDistance;
