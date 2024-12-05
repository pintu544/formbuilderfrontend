import { useEffect, useMemo } from "react";

import useAuth from "./useAuth.js";
import { axiosPrivate } from "../utils/axios.js";

const useAxiosPrivate = () => {
  const { auth, setAuth } = useAuth();

  const axiosInstance = useMemo(() => {
    const instance = axiosPrivate;
    instance.interceptors.request.use((config) => {
      if (!config.headers["Authorization"]) {
        config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
      }
      return config;
    });

    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error?.response?.status === 401) {
          setAuth({});
          localStorage.removeItem("auth");
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [auth]);

  useEffect(() => {
    return () => {
      // Eject the interceptors on cleanup
      axiosInstance.interceptors.request.eject();
      axiosInstance.interceptors.response.eject();
    };
  }, [axiosInstance]);

  return axiosInstance;
};

export default useAxiosPrivate;
