import React, { useEffect, useState } from 'react';
import { Search, Plus, Filter, MoreVertical, Edit, Trash, Calendar, Newspaper } from 'lucide-react';
import ArticleForm from '../components/articles/ArticleForm';
import ArticleDetail from '../components/articles/ArticleDetail';
import DeleteConfirmation from '../components/DeleteConfirmation';
import type { Articles, Categories } from "../types/global-types";
import ServiceApi from '../services/api';
import { formatDateTime } from '../types/format-datetime';
import { toast } from 'react-toastify'; // Thêm toast để hiển thị thông báo

// Use the Articles interface directly since it already has all the needed properties
interface Article extends Articles {
  // Articles already includes: id, title, excerpt, content, categoryId, readTime, imagePath, date, authorId, author: Users, category: Categories, createdAt?, updatedAt?
  // No need to redeclare these properties
}

const Articles: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [category, setCategory] = useState<Categories[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<number | null>(null);
  const [viewingArticleId, setViewingArticleId] = useState<number | null>(null);
  const [deletingArticleId, setDeletingArticleId] = useState<number | null>(null);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);

  // Hàm lấy danh sách bài viết
  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await ServiceApi.get('/article'); // Sửa endpoint thành /articles
      setArticles(response.data.data.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách bài viết:', error);
      toast.error('Không thể tải danh sách bài viết. Vui lòng thử lại.'); // Hiển thị thông báo lỗi
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy danh sách danh mục
  const fetchArticleCategory = async () => {
    try {
      setLoading(true);
      const response = await ServiceApi.get('/article-categories');
      setCategory(response.data.data.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh mục bài viết:', error);
      toast.error('Không thể tải danh mục bài viết. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };
  // console.log('Category state:', category);

  // Hàm lấy chi tiết bài viết
  const handleGetArticle = async (id: number): Promise<Article | null> => {
    try {
      const response = await ServiceApi.get(`/article/${id}`); // Sửa endpoint
      return response.data || null;
    } catch (error) {
      console.error('Lỗi khi lấy bài viết:', error);
      toast.error('Không thể tải bài viết. Vui lòng thử lại.');
      return null;
    }
  };

  // Đồng bộ hóa việc lấy dữ liệu khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchArticle(), fetchArticleCategory()]); // Gọi đồng thời để tối ưu
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        toast.error('Lỗi khi tải dữ liệu ban đầu.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  // console.log('Articles state:', articles);

  // Lọc bài viết theo tìm kiếm và danh mục
  const filteredArticles = Array.isArray(articles) ? articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.categoryId === Number(selectedCategory);
    return matchesSearch && matchesCategory;
  }) : [];

  // Thêm bài viết mới
  const handleAddArticle = async (formData: FormData) => {
    console.log('=== HANDLE ADD ARTICLE START ===');
    console.log('Received FormData:', formData);

    // Log FormData contents
    console.log('FormData contents in handleAddArticle:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      console.log('Sending request to backend...');
      const token = localStorage.getItem('accessToken');
      console.log('Auth token exists:', !!token);

      // Use fetch API to send FormData (ServiceApi might not handle FormData properly)
      const response = await fetch('http://localhost:8000/article', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        console.log('Article created successfully, refreshing list...');
        await fetchArticle(); // Làm mới danh sách
        setShowAddForm(false);
        toast.success('Thêm bài viết thành công!');
      } else {
        console.error('Backend returned error:', responseData);
        throw new Error(responseData.message || 'Failed to create article');
      }
    } catch (error: any) {
      console.error('=== ERROR IN HANDLE ADD ARTICLE ===');
      console.error('Error details:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      toast.error(error.message || 'Không thể thêm bài viết.');
    }
    console.log('=== HANDLE ADD ARTICLE END ===');
  };

  // Cập nhật bài viết
  const handleUpdateArticle = async (id: number, formData: FormData) => {
    try {
      console.log('Updating article with FormData:', formData);

      // Use fetch API to send FormData for update
      const response = await fetch(`http://localhost:8000/article/${id}`, {
        method: 'PATCH',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      const responseData = await response.json();
      console.log('Update article response:', responseData);

      if (response.ok) {
        await fetchArticle(); // Làm mới danh sách
        setEditingArticleId(null);
        setCurrentArticle(null);
        toast.success('Cập nhật bài viết thành công!');
      } else {
        throw new Error(responseData.message || 'Failed to update article');
      }
    } catch (error: any) {
      console.error('Lỗi khi cập nhật bài viết:', error);
      toast.error(error.message || 'Không thể cập nhật bài viết.');
    }
  };

  // Xóa bài viết
  const handleDeleteArticle = async () => {
    if (deletingArticleId !== null) {
      try {
        const response = await ServiceApi.delete(`/article/${deletingArticleId}`);
        if (response.status === 200) {
          await fetchArticle(); // Làm mới danh sách
          setDeletingArticleId(null);
          toast.success('Xóa bài viết thành công!');
        }
      } catch (error: any) {
        console.error('Lỗi khi xóa bài viết:', error);
        toast.error(error.response?.data?.message || 'Không thể xóa bài viết.');
      }
    }
  };

  // Xử lý chỉnh sửa bài viết
  const handleEditArticle = async (id: number) => {
    const article = await handleGetArticle(id);
    if (article) {
      setCurrentArticle(article);
      setEditingArticleId(id);
    }
  };

  // Xem chi tiết bài viết
  const handleViewArticle = async (id: number) => {
    const article = await handleGetArticle(id);
    if (article) {
      setCurrentArticle(article);
      setViewingArticleId(id);
    }
  };

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
          {/* Tìm kiếm */}
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

          {/* Lọc danh mục */}
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full border-none rounded-xl bg-gray-50/80 dark:bg-gray-700/80 appearance-none focus:ring-2 focus:ring-primary-500/70 transition-all"
            >
              <option value="all">Tất cả danh mục</option>
              {category.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Lưới bài viết */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12 glass-card rounded-xl">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-3"></div>
              <p className="text-gray-500 dark:text-gray-400">Đang tải bài viết...</p>
            </div>
          ) : filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <div
                key={article.id}
                className="card overflow-hidden hover-lift"
                onClick={() => handleViewArticle(article.id)}
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
                      {article.category.name}
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditArticle(article.id);
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
                          handleViewArticle(article.id);
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
                          src={article.author.avatar}
                          alt={`${article.author.firstName} ${article.author.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-300">{article.author.firstName} {article.author.lastName}</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700/50 pt-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      <span>{formatDateTime(article.date)}</span>
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

      {/* Form thêm bài viết */}
      {showAddForm && (
        <ArticleForm
          onSubmit={(formData) => {
            console.log('ArticleForm onSubmit called with:', formData);
            return handleAddArticle(formData);
          }}
          onCancel={() => {
            console.log('ArticleForm onCancel called');
            setShowAddForm(false);
          }}
          categories={category}
        />
      )}

      {/* Form chỉnh sửa bài viết */}
      {editingArticleId !== null && currentArticle && (
        <ArticleForm
          article={articles.find(article => article.id === editingArticleId)}
          onSubmit={(articleData) => handleUpdateArticle(editingArticleId, articleData)}
          onCancel={() => {
            setEditingArticleId(null);
            setCurrentArticle(null);
          }}
          categories={category} // Truyền danh mục để chọn
        />
      )}

      {/* Xem chi tiết bài viết */}
      {viewingArticleId !== null && currentArticle && (
        <ArticleDetail
          article={articles.find(article => article.id === viewingArticleId)!}
          onClose={() => {
            setViewingArticleId(null);
            setCurrentArticle(null);
          }}
        />
      )}

      {/* Xác nhận xóa */}
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