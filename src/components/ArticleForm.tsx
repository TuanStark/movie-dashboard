import React, { useState, useEffect } from 'react';
import type { Article } from '../data/mock-data';
import { X } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface ArticleFormProps {
  article?: Article;
  onSubmit: (article: Omit<Article, 'id'>) => void;
  onCancel: () => void;
}

// Default empty article object
const emptyArticle: Omit<Article, 'id'> = {
  title: '',
  excerpt: '',
  content: '',
  imagePath: '',
  category: 'news',
  author: '',
  authorAvatar: '',
  date: new Date().toISOString().split('T')[0],
  readTime: 5
};

const ArticleForm: React.FC<ArticleFormProps> = ({ article, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Article, 'id'>>(emptyArticle);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with article data if provided (edit mode)
  useEffect(() => {
    if (article) {
      setFormData(article);
    }
  }, [article]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'readTime') {
      setFormData({
        ...formData,
        [name]: parseInt(value, 10) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleImageChange = (imageData: string) => {
    setFormData({
      ...formData,
      imagePath: imageData
    });
  };

  const handleAuthorAvatarChange = (imageData: string) => {
    setFormData({
      ...formData,
      authorAvatar: imageData
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Tiêu đề không được để trống';
    if (!formData.excerpt.trim()) newErrors.excerpt = 'Tóm tắt không được để trống';
    if (!formData.content.trim()) newErrors.content = 'Nội dung không được để trống';
    if (!formData.author.trim()) newErrors.author = 'Tác giả không được để trống';
    if (!formData.category.trim()) newErrors.category = 'Danh mục không được để trống';
    if (!formData.date.trim()) newErrors.date = 'Ngày không được để trống';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {article ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
          </h2>
          <button 
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium">
                Tiêu đề
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 ${
                  errors.title ? 'border-2 border-error-500' : ''
                }`}
              />
              {errors.title && (
                <p className="text-error-500 text-xs">{errors.title}</p>
              )}
            </div>

            {/* Excerpt */}
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="excerpt" className="block text-sm font-medium">
                Tóm tắt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={2}
                value={formData.excerpt}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 ${
                  errors.excerpt ? 'border-2 border-error-500' : ''
                }`}
              />
              {errors.excerpt && (
                <p className="text-error-500 text-xs">{errors.excerpt}</p>
              )}
            </div>

            {/* Content */}
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="content" className="block text-sm font-medium">
                Nội dung
              </label>
              <textarea
                id="content"
                name="content"
                rows={6}
                value={formData.content}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 ${
                  errors.content ? 'border-2 border-error-500' : ''
                }`}
              />
              {errors.content && (
                <p className="text-error-500 text-xs">{errors.content}</p>
              )}
            </div>

            {/* Image Path */}
            <div className="space-y-2 md:col-span-2">
              <ImageUpload
                initialImage={formData.imagePath}
                onImageChange={handleImageChange}
                label="Hình ảnh bài viết"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium">
                Danh mục
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 ${
                  errors.category ? 'border-2 border-error-500' : ''
                }`}
              >
                <option value="news">Tin tức</option>
                <option value="review">Đánh giá</option>
                <option value="interview">Phỏng vấn</option>
                <option value="event">Sự kiện</option>
              </select>
              {errors.category && (
                <p className="text-error-500 text-xs">{errors.category}</p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label htmlFor="date" className="block text-sm font-medium">
                Ngày đăng
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 ${
                  errors.date ? 'border-2 border-error-500' : ''
                }`}
              />
              {errors.date && (
                <p className="text-error-500 text-xs">{errors.date}</p>
              )}
            </div>

            {/* Author */}
            <div className="space-y-2">
              <label htmlFor="author" className="block text-sm font-medium">
                Tác giả
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 ${
                  errors.author ? 'border-2 border-error-500' : ''
                }`}
              />
              {errors.author && (
                <p className="text-error-500 text-xs">{errors.author}</p>
              )}
            </div>

            {/* Author Avatar */}
            <div className="space-y-2">
              <ImageUpload
                initialImage={formData.authorAvatar}
                onImageChange={handleAuthorAvatarChange}
                label="Avatar tác giả"
              />
            </div>

            {/* Read Time */}
            <div className="space-y-2">
              <label htmlFor="readTime" className="block text-sm font-medium">
                Thời gian đọc (phút)
              </label>
              <input
                type="number"
                id="readTime"
                name="readTime"
                min="1"
                value={formData.readTime}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {article ? 'Cập nhật' : 'Thêm bài viết'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleForm; 