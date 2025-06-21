import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  initialImage?: string;
  onImageChange: (imageData: string) => void;
  className?: string;
  label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  initialImage,
  onImageChange,
  className = '',
  label = 'Tải ảnh lên'
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.match('image.*')) {
      alert('Vui lòng chọn một tệp hình ảnh');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setPreviewUrl(imageData);
      onImageChange(imageData);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2">{label}</label>
      
      {previewUrl ? (
        <div className="relative rounded-lg overflow-hidden group">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleClick}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              title="Thay đổi ảnh"
            >
              <Upload size={20} />
            </button>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              title="Xóa ảnh"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center h-48 cursor-pointer transition-colors ${
            isDragging 
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <ImageIcon size={36} className="text-gray-400 dark:text-gray-500 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-1">
            Kéo thả ảnh vào đây hoặc <span className="text-primary-600 dark:text-primary-400">chọn từ máy</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            PNG, JPG, GIF (tối đa 5MB)
          </p>
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload; 