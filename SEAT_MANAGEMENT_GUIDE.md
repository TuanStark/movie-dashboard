# 🪑 Hướng dẫn Quản lý Ghế theo Rạp Phim

## 📋 Tổng quan

Hệ thống quản lý ghế đã được nâng cấp với các tính năng mới để quản lý ghế theo từng rạp phim một cách hiệu quả và trực quan.

## 🚀 Tính năng mới

### 1. **Theater Selection Mode** - Chế độ chọn rạp
- Chọn rạp cụ thể để quản lý ghế
- Hiển thị thông tin rạp đã chọn trong header
- Lọc ghế theo rạp được chọn

### 2. **Dual View Mode** - Chế độ hiển thị kép
- **📋 List View**: Hiển thị danh sách ghế dạng bảng (mặc định)
- **🗺️ Grid View**: Hiển thị sơ đồ ghế trực quan

### 3. **Seat Map Visualization** - Sơ đồ ghế trực quan
- Hiển thị ghế theo layout thực tế của rạp
- Màu sắc phân biệt loại ghế (Standard, Premium, VIP)
- Tương tác trực tiếp với ghế (click, double-click, multi-select)

### 4. **Bulk Operations** - Thao tác hàng loạt
- **Tạo ghế hàng loạt**: Tạo nhiều ghế cùng lúc theo hàng
- **Xóa nhiều ghế**: Chọn và xóa nhiều ghế cùng lúc
- **Multi-select**: Chọn nhiều ghế bằng Ctrl/Cmd + Click

### 5. **Theater Statistics** - Thống kê theo rạp
- Tổng số ghế, số hàng, giá trung bình
- Phân bố theo loại ghế với biểu đồ
- Chi tiết theo từng hàng ghế

## 🎯 Cách sử dụng

### Bước 1: Chọn rạp
1. Click button **"Chọn rạp"** trên header
2. Chọn rạp từ danh sách hiển thị
3. Hệ thống sẽ load ghế của rạp đã chọn

### Bước 2: Chọn chế độ hiển thị
- **📋 List**: Xem danh sách ghế dạng bảng
- **🗺️ Grid**: Xem sơ đồ ghế trực quan

### Bước 3: Quản lý ghế

#### 🔧 Thêm ghế đơn lẻ
1. Click **"Thêm ghế"**
2. Điền thông tin ghế
3. Chọn rạp, hàng, số ghế, loại, giá
4. Click **"Thêm ghế"**

#### 🏭 Tạo ghế hàng loạt
1. Click **"Tạo hàng loạt"**
2. Chọn rạp (nếu chưa chọn)
3. Nhập hàng bắt đầu và kết thúc (VD: A đến J)
4. Nhập số ghế mỗi hàng
5. Chọn loại ghế và giá
6. Xem preview và click **"Tạo X ghế"**

#### ✏️ Chỉnh sửa ghế
- **List View**: Click icon ✏️ hoặc "Chỉnh sửa"
- **Grid View**: Double-click vào ghế

#### 👁️ Xem chi tiết ghế
- **List View**: Click "Xem"
- **Grid View**: Single-click vào ghế

#### 🗑️ Xóa ghế
- **Xóa đơn lẻ**: Click icon 🗑️
- **Xóa hàng loạt**: 
  1. Chọn nhiều ghế (Ctrl/Cmd + Click)
  2. Click **"Xóa X ghế"**

## 🎨 Giao diện Seat Map

### Màu sắc ghế
- **🔘 Xám**: Standard
- **🟣 Tím**: Premium  
- **🟡 Vàng**: VIP
- **🔵 Xanh**: Ghế đã chọn

### Tương tác
- **Single Click**: Xem chi tiết
- **Double Click**: Chỉnh sửa
- **Ctrl/Cmd + Click**: Chọn nhiều ghế
- **Hover**: Hiển thị thông tin nhanh

### Legend
- Hiển thị ý nghĩa màu sắc
- Hướng dẫn sử dụng
- Vị trí màn hình

## 📊 Thống kê rạp

Khi chọn rạp, hệ thống hiển thị:

### Overview Cards
- **Tổng ghế**: Số lượng ghế trong rạp
- **Số hàng**: Số hàng ghế
- **Giá TB**: Giá trung bình mỗi ghế
- **Tổng giá trị**: Tổng giá trị tất cả ghế

### Phân bố loại ghế
- Biểu đồ % theo loại ghế
- Số lượng từng loại
- Progress bar trực quan

### Thông tin hàng ghế
- Hàng đầu/cuối
- Số ghế max/min/trung bình mỗi hàng
- Chi tiết từng hàng

## 🔧 API Endpoints

### Ghế theo rạp
```
GET /seats/theater/{theaterId}
```

### Tạo ghế hàng loạt
```
POST /seats/bulk
Body: {
  theaterId: number,
  rows: string[],
  seatsPerRow: number,
  type: string,
  price: number
}
```

### Xóa ghế hàng loạt
```
DELETE /seats/bulk
Body: {
  seatIds: number[]
}
```

## 💡 Tips & Tricks

1. **Workflow hiệu quả**:
   - Chọn rạp → Tạo hàng loạt → Điều chỉnh từng ghế

2. **Sử dụng Grid View**:
   - Dễ dàng visualize layout rạp
   - Nhanh chóng identify ghế cần sửa

3. **Multi-select**:
   - Giữ Ctrl/Cmd để chọn nhiều ghế
   - Hữu ích cho việc xóa/cập nhật hàng loạt

4. **Bulk Create**:
   - Tạo structure cơ bản trước
   - Sau đó fine-tune từng ghế đặc biệt

## 🎯 Best Practices

1. **Quy ước đặt tên**:
   - Hàng: A, B, C... (theo thứ tự alphabet)
   - Số ghế: 1, 2, 3... (từ trái sang phải)

2. **Phân loại ghế**:
   - **Standard**: Ghế thường, giá cơ bản
   - **Premium**: Ghế tốt hơn, vị trí đẹp
   - **VIP**: Ghế cao cấp, dịch vụ đặc biệt

3. **Pricing Strategy**:
   - Standard: 50,000 - 80,000 VND
   - Premium: 80,000 - 120,000 VND
   - VIP: 120,000 - 200,000 VND

## 🚨 Lưu ý quan trọng

- ⚠️ **Backup data** trước khi thực hiện bulk operations
- ⚠️ **Kiểm tra kỹ** trước khi xóa hàng loạt
- ⚠️ **Test thoroughly** với data mẫu trước
- ⚠️ **Coordinate** với team khi thay đổi structure rạp

## 🆘 Troubleshooting

### Vấn đề thường gặp:

1. **Không load được ghế**:
   - Kiểm tra kết nối API
   - Verify theater ID

2. **Seat Map không hiển thị đúng**:
   - Refresh page
   - Kiểm tra data format

3. **Bulk create failed**:
   - Kiểm tra duplicate seats
   - Verify input data

---

🎉 **Chúc bạn quản lý ghế hiệu quả!** 🎉
