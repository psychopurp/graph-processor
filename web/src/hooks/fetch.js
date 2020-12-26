import api from "../api";
import { useState, useEffect } from "react";
// import { } from ""

export const useFetchApi = (initUrl, initData, handler) => {
  const [data, setData] = useState(initData);
  const [url, setUrl] = useState(initUrl);
  const [isLoading, setIsloading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setIsError(false);
      setIsloading(true);
      try {
        const data = await api.get(url);
        console.log(data);
        setData(data.data);
        handler();
      } catch (error) {
        setIsError(true);
      }
      setIsloading(false);
    };

    fetch();
  }, [handler,url]);

  return [{ data, isLoading, isError }, setUrl];
};
