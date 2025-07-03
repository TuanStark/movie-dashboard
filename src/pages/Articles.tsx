import React, { useState } from 'react';
import { useArticles } from '../contexts/ArticleContext';
import { Search, Plus, Filter, MoreVertical, Edit, Trash, Clock, Calendar, Newspaper, BookOpen, User } from 'lucide-react';
import ArticleForm from '../components/articles/ArticleForm';
import ArticleDetail from '../components/articles/ArticleDetail';
import DeleteConfirmation from '../components/DeleteConfirmation';

const Articles: React.FC = () => {
  const { articles, addArticle, updateArticle, deleteArticle, getArticle } = useArticles();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<number | null>(null);
  const [viewingArticleId, setViewingArticleId] = useState<number | null>(null);
  const [deletingArticleId, setDeletingArticleId] = useState<number | null>(null);

  // Lọc articles theo tìm kiếm và danh mục
  const filteredArticles = articles.filter(article => {
    const matchesSearch = 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddArticle = (articleData: Omit<typeof articles[0], 'id'>) => {
    addArticle(articleData);
    setShowAddForm(false);
  };

  const handleUpdateArticle = (id: number, articleData: Omit<typeof articles[0], 'id'>) => {
    updateArticle(id, articleData);
    setEditingArticleId(null);
  };

  const handleDeleteArticle = () => {
    if (deletingArticleId !== null) {
      deleteArticle(deletingArticleId);
      setDeletingArticleId(null);
    }
  };

  // Lấy danh sách các danh mục duy nhất
  const categories = ['all', ...Array.from(new Set(articles.map(a => a.category)))];

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-pink-100/70 dark:bg-pink-900/30">
            <Newspaper size={24} className="text-pink-600" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">Quản lý bài viết</h1>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary flex items-center gap-2 hover-lift"
        >
          <Plus size={18} />
          <span>Thêm bài viết</span>
        </button>
      </div>

      <div className="glass-card rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full border-none rounded-xl bg-gray-50/80 dark:bg-gray-700/80 focus:ring-2 focus:ring-primary-500/70 transition-all"
            />
          </div>

          {/* Filter */}
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full border-none rounded-xl bg-gray-50/80 dark:bg-gray-700/80 appearance-none focus:ring-2 focus:ring-primary-500/70 transition-all"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.filter(c => c !== 'all').map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <div 
                key={article.id} 
                className="card overflow-hidden hover-lift"
                onClick={() => setViewingArticleId(article.id)}
              >
                {article.imagePath && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={article.imagePath}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-primary-100/80 to-primary-200/80 dark:from-primary-900/30 dark:to-primary-800/30 text-primary-800 dark:text-primary-300">
                      {article.category}
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingArticleId(article.id);
                        }}
                        className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="Sửa"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingArticleId(article.id);
                        }}
                        className="p-1.5 rounded-md hover:bg-error-50 dark:hover:bg-error-900/20 text-error-500 transition-colors"
                        title="Xóa"
                      >
                        <Trash size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewingArticleId(article.id);
                        }}
                        className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="Xem chi tiết"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                  <h3 
                    className="font-semibold text-lg mb-2 line-clamp-2 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {article.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full overflow-hidden">
                        <img 
                          src={article.authorAvatar} 
                          alt={article.author} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-300">{article.author}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700/50 pt-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      <span>{article.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen size={14} />
                      <span>{article.readTime} phút</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 glass-card rounded-xl">
              <Newspaper size={40} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">Không tìm thấy bài viết nào</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Article Form */}
      {showAddForm && (
        <ArticleForm
          onSubmit={handleAddArticle}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Edit Article Form */}
      {editingArticleId !== null && (
        <ArticleForm
          article={getArticle(editingArticleId)}
          onSubmit={(articleData) => handleUpdateArticle(editingArticleId, articleData)}
          onCancel={() => setEditingArticleId(null)}
        />
      )}

      {/* View Article Detail */}
      {viewingArticleId !== null && (
        <ArticleDetail
          article={getArticle(viewingArticleId)!}
          onClose={() => setViewingArticleId(null)}
          onEdit={() => {
            setEditingArticleId(viewingArticleId);
            setViewingArticleId(null);
          }}
          onDelete={() => {
            setDeletingArticleId(viewingArticleId);
            setViewingArticleId(null);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deletingArticleId !== null && (
        <DeleteConfirmation
          title="Xóa bài viết"
          message="Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác."
          onConfirm={handleDeleteArticle}
          onCancel={() => setDeletingArticleId(null)}
        />
      )}
    </div>
  );
};

export default Articles; 