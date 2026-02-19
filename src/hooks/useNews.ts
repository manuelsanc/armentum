import { useState, useEffect } from "react";
import { getNews, getNewsById } from "../services/events";
import type { News } from "../types";

interface UseNewsReturn {
  news: News[];
  loading: boolean;
  error: string | null;
}

interface UseNewsItemReturn {
  newsItem: News | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook para obtener lista de noticias
 * @param limit - Número máximo de noticias
 * @param offset - Paginación
 */
export function useNewsList(limit?: number, offset?: number): UseNewsReturn {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      setError(null);
      try {
        const data = await getNews(limit, offset);
        setNews(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar noticias");
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, [limit, offset]);

  return { news, loading, error };
}

/**
 * Hook para obtener una noticia específica
 * @param id - ID de la noticia
 */
export function useNewsItem(id: string): UseNewsItemReturn {
  const [newsItem, setNewsItem] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    async function fetchNewsItem() {
      setLoading(true);
      setError(null);
      try {
        const data = await getNewsById(id);
        setNewsItem(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar noticia");
      } finally {
        setLoading(false);
      }
    }

    fetchNewsItem();
  }, [id]);

  return { newsItem, loading, error };
}
