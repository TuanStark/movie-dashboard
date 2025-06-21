import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { articles as initialArticles } from '../data/mock-data';
import type { Article } from '../data/mock-data';

interface ArticleContextType {
  articles: Article[];
  addArticle: (article: Omit<Article, 'id'>) => void;
  updateArticle: (id: number, updatedArticle: Omit<Article, 'id'>) => void;
  deleteArticle: (id: number) => void;
  getArticle: (id: number) => Article | undefined;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

export const useArticles = () => {
  const context = useContext(ArticleContext);
  if (!context) {
    throw new Error('useArticles must be used within an ArticleProvider');
  }
  return context;
};

interface ArticleProviderProps {
  children: ReactNode;
}

export const ArticleProvider: React.FC<ArticleProviderProps> = ({ children }) => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    // Load articles from localStorage or use initial data
    const savedArticles = localStorage.getItem('articles');
    if (savedArticles) {
      setArticles(JSON.parse(savedArticles));
    } else {
      setArticles(initialArticles);
    }
  }, []);

  // Save to localStorage whenever articles change
  useEffect(() => {
    if (articles.length > 0) {
      localStorage.setItem('articles', JSON.stringify(articles));
    }
  }, [articles]);

  const addArticle = (article: Omit<Article, 'id'>) => {
    // Generate a new ID (highest ID + 1)
    const newId = articles.length > 0 
      ? Math.max(...articles.map(a => a.id)) + 1 
      : 1;
    
    const newArticle = {
      ...article,
      id: newId
    };
    
    setArticles([...articles, newArticle]);
  };

  const updateArticle = (id: number, updatedArticle: Omit<Article, 'id'>) => {
    setArticles(articles.map(article => 
      article.id === id ? { ...updatedArticle, id } : article
    ));
  };

  const deleteArticle = (id: number) => {
    setArticles(articles.filter(article => article.id !== id));
  };

  const getArticle = (id: number) => {
    return articles.find(article => article.id === id);
  };

  return (
    <ArticleContext.Provider value={{ 
      articles, 
      addArticle, 
      updateArticle, 
      deleteArticle,
      getArticle
    }}>
      {children}
    </ArticleContext.Provider>
  );
}; 