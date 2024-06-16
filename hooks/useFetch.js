// hooks/useFetch.js
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "@env";

const useFetch = () => {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (endpoint, method, params = null, body = null) => {
    setIsLoading(true);
    try {
      console.log("fetchData");

      const configuration = {
        method: method,
        url: endpoint,
        baseURL: BASE_URL,
        params: params,
        data: body,
      };

      const response = await axios.request(configuration);
      console.log("Response:", response.data);
      setStatus(response.status);
      setData(response.data);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
        setStatus(error.response.status);
        console.log("Error:", error.response.data.message);
      } else {
        console.log("Error:", error.message);
        setError(error.message);
        setStatus(500);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, fetchData, status };
};

export default useFetch;
