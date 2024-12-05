import axios from "axios";

import { API } from "./API.js";

export const axiosOpen = axios.create({
  baseURL: API,
});

export const axiosPrivate = axios.create({
  baseURL: API,
});
