import axios from "axios";

const BASE_URL = "https://api.jikan.moe/v4";

export const getTopAnime = async () => {
  const res = await axios.get(`${BASE_URL}/top/anime`);
  return res.data.data;
};