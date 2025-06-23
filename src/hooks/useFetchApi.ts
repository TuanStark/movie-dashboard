import { useState, useEffect, useCallback } from 'react';
import api from '../axios';

const useFecthApi = (path: string, query: any, config: any) => {
  const [data, setData] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryString = new URLSearchParams(query).toString();
      const url = `${path}${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(url, config);
      
      // Xử lý cấu trúc API mới
      // {data: {data: [], meta: {}}, statusCode: 200, message: string}
      if (response.data && response.data.statusCode === 200 && response.data.data) {
        if (response.data.data.data && Array.isArray(response.data.data.data)) {
          setData(response.data.data.data);
          if (response.data.data.meta) {
            setMeta(response.data.data.meta);
          }
        } else if (Array.isArray(response.data.data)) {
          setData(response.data.data);
        }
      } else if (response.data && Array.isArray(response.data.data)) {
        setData(response.data.data);
        if (response.data.meta) {
          setMeta(response.data.meta);
        }
      } else if (Array.isArray(response.data)) {
        setData(response.data);
      } else {
        console.warn("Unexpected data structure:", response.data);
        setData([]);
      }
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || err.message || 'An error occurred');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [path, JSON.stringify(query), JSON.stringify(config)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Thêm hàm refetch để có thể gọi lại API từ bên ngoài
  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  return [data, meta, refetch, loading, error];
};

export default useFecthApi;