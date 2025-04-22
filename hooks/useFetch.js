import { useCallback, useState } from "react";
import axios from "axios";
import { BASE_URL, _URL, APPLEPHONE_URL, ANDROID_URL, Montana_URL } from "@env";
import { useAuth } from "../context/AuthContext";

const useFetch = () => {
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [status, setStatus] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleError = (error) => {
    if (error.response) {
      const { message } = error.response.data;
      const { status } = error.response;
      setError(message);
      setStatus(status);
      return { error: message, status, data: null };
    } else {
      setError(error.message);
      setStatus(500);
      return { error: error.message, status: 500, data: null };
    }
  };

  const fetchData = useCallback(
    async (endpoint, method = "GET", params = null, body = null) => {
      setIsLoading(true);
      setError(null);
      setStatus(0);

      try {
        const config = {
          method,
          url: `${BASE_URL}${endpoint}`,
          params,
          data: body,
          headers: {
            Authorization: user?.token ? `Bearer ${user.token}` : undefined,
          },
        };

        console.log(config);

        const response = await axios.request(config);
        const { data, status } = response;

        setData(data);
        setStatus(status);
        setIsLoading(false);

        return { data, status, error: null };
      } catch (err) {
        setIsLoading(false);
        return handleError(err);
      }
    },
    []
  );

  return { data, status, isLoading, error, fetchData };
};

export default useFetch;
