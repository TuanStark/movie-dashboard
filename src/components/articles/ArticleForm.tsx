import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ImageUpload from '../ImageUpload';
import type { Articles, Categories, Users } from "../../types/global-types";
import { useAuth } from '../../contexts/AuthContext';

// Form-specific interface that allows imagePath to be either string or File
interface ArticleFormData extends Omit<Articles, 'id'> {
  file?: string | File;
}

interface ArticleFormProps {
  article?: Articles;
  onSubmit: (article: FormData) => Promise<void>;
  onCancel: () => void;
  categories: Categories[];
}

// Default empty article object
const emptyArticle: ArticleFormData = {
  title: '',
  excerpt: '',
  content: '',
  imagePath: '',
  authorId: '',
  categoryId: 1,
  date: new Date().toISOString().split('T')[0],
  readTime: 5,
  author: {} as Users,
  category: {} as Categories,
};

const ArticleForm: React.FC<ArticleFormProps> = ({ article, onSubmit, onCancel, categories }) => {
  const user = useAuth();
  const userId = user.user?.id;
  const [formData, setFormData] = useState<ArticleFormData>(() => ({
    ...emptyArticle,
    authorId: userId || ''
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update authorId when userId changes
  useEffect(() => {
    if (userId && !formData.authorId) {
      setFormData(prev => ({
        ...prev,
        authorId: userId
      }));
    }
  }, [userId, formData.authorId]);

  // Initialize form with article data if provided (edit mode)
  useEffect(() => {
    if (article) {
      // Convert date to yyyy-MM-dd format for HTML date input
      setFormData({
        ...article,
      });
    }
  }, [article]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'readTime') {
      setFormData({
        ...formData,
        [name]: parseInt(value, 10) || 0
      });
    } else if (name === 'categoryId') {
      setFormData({
        ...formData,
        [name]: parseInt(value, 10) || 1
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleImageChange = (imageData: string | File) => {
    if (imageData instanceof File === false) {
      setFormData({
        ...formData,
        file: '',
        imagePath: imageData,
      });
    } else {
      setFormData({
        ...formData,
        file: imageData,
        imagePath: URL.createObjectURL(imageData),
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      console.log('Title validation failed:', formData.title);
      newErrors.title = 'Tiêu đề không được để trống';
    }
    if (!formData.excerpt.trim()) {
      console.log('Excerpt validation failed:', formData.excerpt);
      newErrors.excerpt = 'Tóm tắt không được để trống';
    }
    if (!formData.content.trim()) {
      console.log('Content validation failed:', formData.content);
      newErrors.content = 'Nội dung không được để trống';
    }
    if (!formData.categoryId) {
      console.log('CategoryId validation failed:', formData.categoryId);
      newErrors.categoryId = 'Danh mục không được để trống';
    }
    if (!formData.date.trim()) {
      console.log('Date validation failed:', formData.date);
      newErrors.date = 'Ngày không được để trống';
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      console.log('Validation failed, stopping submission');
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Create FormData to match backend expectations
      const formDataObj = new FormData();
      formDataObj.append('title', formData.title);
      formDataObj.append('excerpt', formData.excerpt);
      formDataObj.append('content', formData.content);
      formDataObj.append('authorId', userId || formData.authorId);
      formDataObj.append('categoryId', formData.categoryId.toString());
      formDataObj.append('readTime', formData.readTime.toString());
      formDataObj.append('date', formData.date);
      formDataObj.append('imagePath', "iamgePath.png");


      // Add file if exists (only send File object, not blob URL)
      if (formData.file && formData.file instanceof File) {
        formDataObj.append('file', formData.file);
      } else {
        console.log('No file to upload, file:', formData.file);
      }
      await onSubmit(formDataObj);

    } catch (error: any) {
      console.error('Error submitting form:', error);
      const errorMessage = error.message || 'Có lỗi khi gửi biểu mẫu';
      setErrors(prev => ({ ...prev, form: errorMessage }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" style={{ marginTop: "0px" }}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {article ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Title */}
            <div className="space-y-2 md:col-span-3">
              <label htmlFor="title" className="block text-sm font-medium">
                Tiêu đề
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 ${errors.title ? 'border-2 border-error-500' : ''
                  }`}
              />
              {errors.title && (
                <p className="text-error-500 text-xs">{errors.title}</p>
              )}
            </div>

            {/* Excerpt */}
            <div className="space-y-2 md:col-span-3">
              <label htmlFor="excerpt" className="block text-sm font-medium">
                Tóm tắt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={2}
                value={formData.excerpt}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 ${errors.excerpt ? 'border-2 border-error-500' : ''
                  }`}
              />
              {errors.excerpt && (
                <p className="text-error-500 text-xs">{errors.excerpt}</p>
              )}
            </div>

            {/* Content */}
            <div className="space-y-2 md:col-span-3">
              <label htmlFor="content" className="block text-sm font-medium">
                Nội dung
              </label>
              <textarea
                id="content"
                name="content"
                rows={6}
                value={formData.content}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 ${errors.content ? 'border-2 border-error-500' : ''
                  }`}
              />
              {errors.content && (
                <p className="text-error-500 text-xs">{errors.content}</p>
              )}
            </div>

            {/* Image Path */}
            <div className="space-y-2 md:col-span-3">
              <ImageUpload
                initialImage={formData.imagePath}
                onImageSelect={handleImageChange}
                folder="movieTix"
                maxSize={1000000} // 1MB
                accept="image/jpeg,image/png,image/gif"
                disabled={isSubmitting}
                label="Hình ảnh bài viết"
              />
            </div>
            {/* Category */}
            <div className="space-y-2">
              <label htmlFor="categoryId" className="block text-sm font-medium">
                Danh mục
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 ${errors.categoryId ? 'border-2 border-error-500' : ''
                  }`}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-error-500 text-xs">{errors.categoryId}</p>
              )}
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
                value={formData.readTime}
                onChange={handleChange}
                min="1"
                className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 ${errors.readTime ? 'border-2 border-error-500' : ''
                  }`}
              />
              {errors.readTime && (
                <p className="text-error-500 text-xs">{errors.readTime}</p>
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
                className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 ${errors.date ? 'border-2 border-error-500' : ''
                  }`}
              />
              {errors.date && (
                <p className="text-error-500 text-xs">{errors.date}</p>
              )}
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
              onClick={() => console.log('Submit button clicked!')}
            >
              {article ? 'Cập nhật' : 'Thêm bài viết'}
              {isSubmitting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleForm; 