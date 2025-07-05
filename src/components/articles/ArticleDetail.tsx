import React from 'react';
import { X, Calendar, Clock, User } from 'lucide-react';
import type { Articles } from '../../types/global-types';

interface ArticleDetailProps {
  article: Articles;
  onClose: () => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onClose}) => {
  console.log('ArticleDetail rendered', article);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" style={{marginTop : "0px"}}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Chi tiết bài viết</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          {/* Article Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-4">{article.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <div className="flex items-center gap-1">
                <User size={16} />
                <span>{article.author?.firstName}{article.author?.lastName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{article.readTime} phút đọc</span>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-300">
                {article.category.name}
              </span>
            </div>
            
            {article.imagePath && (
              <div className="mb-6">
                <img 
                  src={article.imagePath} 
                  alt={article.title}
                  className="w-full h-auto rounded-lg object-cover max-h-[400px]"
                />
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">Tóm tắt</h3>
              <p className="text-gray-600 dark:text-gray-300 italic">{article.excerpt}</p>
            </div>
            
            <div className="prose dark:prose-invert max-w-none">
              {article.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
          
          {/* Author Info */}
          <div className="mt-8 flex items-center p-4 bg-gray-50 dark:bg-gray-750 rounded-lg">
            {article.author.avatar ? (
              <img 
                src={article.author.avatar} 
                // alt={article.author}
                className="w-12 h-12 rounded-full mr-4 object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-4">
                <User size={20} />
              </div>
            )}
            <div>
              <h4 className="font-semibold">{article.author?.firstName}{article.author?.lastName}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tác giả</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="btn btn-primary btn-sm flex items-center gap-1"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail; 