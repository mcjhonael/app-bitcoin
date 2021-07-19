// const url = "https://api.coincap.io/v2";
const url = "http://localhost:8080/v2";

// function getAssets() {
//   return fetch(`${url}/assets`)
//   .then(res=>res.json()).then(res=>res.data);
// }
// export default {
//   getAssets
// }

export const getAssets = async () => {
  const response = await fetch(`${url}/assets?limit=20`);
  const json = await response.json();
  return json.data;
};

export const getAsset = async (coin) => {
  const response = await fetch(`${url}/assets/${coin}`);
  const json = await response.json();
  return json.data;
};

export const getAssetHistory = async (coin) => {
  const now = new Date();
  //valor de ahora
  const end = now.getTime();
  // valor de ahora -1
  now.setDate(now.getDate() - 1);
  const start = now.getTime();

  const response = await fetch(
    `${url}/assets/${coin}/history?interval=h1&start=${start}&end=${end}`
  );
  const json = await response.json();
  return json.data;
};
//lista de mercado para una moneda particular
export const getMarkets = async (coin) => {
  const response = await fetch(`${url}/assets/${coin}/markets?limit=5`);
  const json = await response.json();
  return json.data;
};
export const getExchange = async (id) => {
  const response = await fetch(`${url}/exchanges/${id}`);
  const json = await response.json();
  return json.data;
};
