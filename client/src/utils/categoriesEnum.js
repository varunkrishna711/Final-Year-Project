const categoriesEnum = {
  Vegetable: 1,
  Fruits: 2,
  Spices: 3,
  Cereals: 4,
  Others: 5,
};

function getCategoryByValue(value) {
  for (const category in categoriesEnum) {
    if (categoriesEnum[category] === value) {
      return category;
    }
  }
  return null;
}

export { categoriesEnum, getCategoryByValue };
