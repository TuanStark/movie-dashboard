# Movie Dashboard

Dashboard quản trị hệ thống đặt vé xem phim, được xây dựng với các công nghệ hiện đại.

## Tổng quan

Movie Dashboard là ứng dụng quản trị cho website đặt vé xem phim, cung cấp giao diện trực quan để quản lý:
- Phim
- Người dùng
- Vé đặt
- Rạp chiếu
- Bài viết/Tin tức

## Công nghệ sử dụng

- **Vite**: Công cụ build nhanh cho ứng dụng web hiện đại
- **React**: Thư viện JavaScript để xây dựng giao diện người dùng
- **TypeScript**: Ngôn ngữ lập trình mở rộng từ JavaScript với kiểu dữ liệu tĩnh
- **Tailwind CSS**: Framework CSS tiện ích để xây dựng giao diện nhanh chóng
- **Lucide React**: Thư viện icon đơn giản và nhẹ
- **React Router**: Thư viện định tuyến cho React

## Cấu trúc dự án

```
movie-dashboard/
├── src/
│   ├── components/     # Các component tái sử dụng
│   ├── pages/          # Các trang chính của dashboard
│   ├── data/           # Dữ liệu mẫu (mock data)
│   ├── App.tsx         # Component gốc của ứng dụng
│   └── main.tsx        # Điểm khởi đầu của ứng dụng
├── public/             # Tài nguyên tĩnh
└── ...                 # Các file cấu hình
```

## Các tính năng

1. **Dashboard tổng quan**
   - Hiển thị số liệu thống kê: số lượng phim, người dùng, vé đặt, rạp, bài viết
   - Danh sách phim mới nhất

2. **Quản lý phim**
   - Danh sách tất cả phim
   - Thông tin chi tiết: tên, thể loại, đạo diễn, ngày chiếu, đánh giá

3. **Quản lý người dùng**
   - Danh sách người dùng
   - Thông tin: tên, email, vai trò, số vé đã đặt

4. **Quản lý vé đặt**
   - Danh sách vé đã đặt
   - Thông tin: mã vé, người đặt, phim, ngày đặt, tổng tiền

5. **Quản lý rạp**
   - Danh sách rạp chiếu phim
   - Thông tin: tên rạp, địa chỉ, tọa độ

6. **Quản lý bài viết**
   - Danh sách bài viết/tin tức
   - Thông tin: tiêu đề, tác giả, ngày đăng, thể loại

## Cài đặt và chạy

1. Clone dự án:
```bash
git clone <repository-url>
cd movie-dashboard
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Chạy ứng dụng ở môi trường phát triển:
```bash
npm run dev
```

4. Build ứng dụng cho môi trường production:
```bash
npm run build
```

## Môi trường phát triển

- Node.js >= 18.0.0
- npm >= 8.0.0

## Tác giả

[Tên tác giả] - [Email/Website/GitHub]

## License

MIT
