import { API_URL, API_KEY } from "./config";

// Creating Endpoints
// createEndpoint = (type, loadMore, currentPage, searchTerm) => {
//   return `${API_URL}${type}?api_key=${API_KEY}&language=en-US&page=${
//     loadMore && currentPage + 1
//   }&query=${searchTerm}`;
// };

// Creating Endpoints using curry function
export const createEndpoint =
  (type) => (loadMore) => (currentPage) => (searchTerm) =>
    `${API_URL}${type}?api_key=${API_KEY}&language=en-US&page=${
      loadMore && currentPage + 1
    }&query=${searchTerm}`;

// Convert time to hours and minutes
export const calcTime = (time) => {
  const hours = Math.floor(time / 60);
  const mins = time % 60;
  return `${hours}h ${mins}m`;
};

// Convert a number to $ format
export const convertMoney = (money) => {
  let formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  });
  return formatter.format(money);
};
