export const getCurrentUser = () => {
  if (localStorage.getItem("shop"))
    return JSON.parse(localStorage.getItem("shop"));

  if (localStorage.getItem("customer"))
    return JSON.parse(localStorage.getItem("customer"));

  if (localStorage.getItem("deliveryPartner"))
    return JSON.parse(localStorage.getItem("deliveryPartner"));

  return null;
};
