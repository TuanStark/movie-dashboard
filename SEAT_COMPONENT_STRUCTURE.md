# 🏗️ Cấu trúc Component Seats - Refactored

## 📋 Tổng quan

File `Seats.tsx` đã được refactor thành các component nhỏ hơn để dễ quản lý, maintain và test. Mỗi component có trách nhiệm riêng biệt và có thể tái sử dụng.

## 🧩 Cấu trúc Component

### 1. **SeatHeader.tsx** - Header & Actions
```typescript
interface SeatHeaderProps {
  selectedTheater: Theater | null;
  viewMode: 'list' | 'grid';
  selectedSeats: number[];
  onViewModeChange: (mode: 'list' | 'grid') => void;
  onTheaterSelect: () => void;
  onBulkDelete: () => void;
  onBulkCreate: () => void;
  onAddSeat: () => void;
}
```

**Chức năng:**
- Hiển thị title và thông tin rạp đang chọn
- Toggle view mode (List/Grid)
- Action buttons (Chọn rạp, Tạo hàng loạt, Thêm ghế)
- Bulk actions (Xóa nhiều ghế)

### 2. **SeatFilters.tsx** - Search & Filters
```typescript
interface SeatFiltersProps {
  query: {
    search: string;
    theaterId: string;
    type: string;
    sort: string;
    order: string;
  };
  theaters: Theater[];
  onQueryUpdate: (updates: Partial<typeof query>) => void;
}
```

**Chức năng:**
- Search box với icon
- Filter theo rạp, loại ghế
- Sort options (mới nhất, hàng A-Z, giá, etc.)
- Auto-update query parameters

### 3. **SeatTable.tsx** - List View Table
```typescript
interface SeatTableProps {
  seats: Seat[];
  theaters: Theater[];
  meta: Meta | null;
  loading: boolean;
  onView: (seat: Seat) => void;
  onEdit: (seat: Seat) => void;
  onDelete: (seat: Seat) => void;
  onPageChange: (page: React.SetStateAction<number>) => void;
}
```

**Chức năng:**
- Hiển thị danh sách ghế dạng table
- Loading states và empty states
- Action buttons cho từng ghế
- Pagination tích hợp
- Responsive design

### 4. **SeatModals.tsx** - Modal Management
```typescript
interface SeatModalsProps {
  // Modal states
  showForm: boolean;
  showDetail: boolean;
  showTheaterSelector: boolean;
  showBulkForm: boolean;
  showDeleteConfirm: boolean;
  
  // Data
  selectedSeat: Seat | null;
  selectedTheater: Theater | null;
  theaters: Theater[];
  isEditing: boolean;
  
  // Handlers (12 callback functions)
}
```

**Chức năng:**
- Quản lý tất cả modal states
- Centralized modal rendering
- Callback handling cho tất cả modal actions
- Clean separation of concerns

### 5. **Seats.tsx** - Main Container (Simplified)
```typescript
// Chỉ còn ~300 lines thay vì 500+ lines
const Seats: React.FC = () => {
  // State management
  // API calls & business logic
  // Event handlers
  
  return (
    <div className="p-6">
      <SeatHeader {...headerProps} />
      <SeatFilters {...filterProps} />
      {selectedTheater && <SeatStats {...statsProps} />}
      
      {viewMode === 'grid' ? (
        <SeatMap {...mapProps} />
      ) : (
        <SeatTable {...tableProps} />
      )}
      
      <SeatModals {...modalProps} />
    </div>
  );
};
```

## 🎯 Lợi ích của Refactoring

### 1. **Maintainability** - Dễ bảo trì
- Mỗi component có trách nhiệm rõ ràng
- Dễ tìm và sửa bug
- Code dễ đọc và hiểu

### 2. **Reusability** - Tái sử dụng
- SeatHeader có thể dùng cho trang khác
- SeatFilters có thể adapt cho entity khác
- SeatTable có thể customize cho data khác

### 3. **Testability** - Dễ test
- Test từng component riêng biệt
- Mock props dễ dàng
- Unit test focused và specific

### 4. **Performance** - Hiệu suất
- React.memo có thể optimize re-renders
- Smaller component trees
- Better code splitting potential

### 5. **Developer Experience** - Trải nghiệm dev
- Faster development với focused components
- Better IDE support và autocomplete
- Easier debugging với component hierarchy

## 📁 File Structure

```
src/components/seats/
├── SeatHeader.tsx          # Header & action buttons
├── SeatFilters.tsx         # Search & filter controls
├── SeatTable.tsx           # List view table
├── SeatModals.tsx          # Modal management
├── SeatMap.tsx             # Grid view (existing)
├── SeatStats.tsx           # Statistics (existing)
├── SeatForm.tsx            # Form modal (existing)
├── SeatDetail.tsx          # Detail modal (existing)
├── TheaterSelector.tsx     # Theater picker (existing)
└── BulkSeatForm.tsx        # Bulk creation (existing)

src/pages/
└── Seats.tsx               # Main container (simplified)
```

## 🔧 Props Flow

```
Seats.tsx (Container)
├── SeatHeader (Actions & UI state)
├── SeatFilters (Query management)
├── SeatStats (Data display)
├── SeatMap/SeatTable (Data display + interactions)
└── SeatModals (Modal orchestration)
    ├── SeatForm
    ├── SeatDetail
    ├── TheaterSelector
    ├── BulkSeatForm
    └── DeleteConfirmation
```

## 🎨 Component Responsibilities

| Component | Responsibility | State | Side Effects |
|-----------|---------------|-------|--------------|
| **Seats** | Container, API calls, business logic | All state | API calls |
| **SeatHeader** | UI actions, view mode | None | None |
| **SeatFilters** | Filter UI | None | None |
| **SeatTable** | Data display | None | None |
| **SeatModals** | Modal orchestration | None | None |

## 🚀 Future Improvements

### 1. **Custom Hooks**
```typescript
// Tách logic thành hooks
const useSeatManagement = () => {
  // API calls, state management
};

const useTheaterSelection = () => {
  // Theater-specific logic
};
```

### 2. **Context API**
```typescript
// Shared state cho nested components
const SeatContext = createContext();
```

### 3. **Component Composition**
```typescript
// Flexible composition patterns
<SeatManager>
  <SeatManager.Header />
  <SeatManager.Filters />
  <SeatManager.Content />
  <SeatManager.Modals />
</SeatManager>
```

### 4. **Performance Optimization**
```typescript
// Memoization
const MemoizedSeatTable = React.memo(SeatTable);
const MemoizedSeatHeader = React.memo(SeatHeader);
```

## 💡 Best Practices Applied

1. **Single Responsibility Principle** - Mỗi component có 1 nhiệm vụ
2. **Props Interface** - Typed props với TypeScript
3. **Event Handling** - Callback props pattern
4. **State Management** - Lift state up pattern
5. **Component Composition** - Flexible và reusable
6. **Error Boundaries** - Graceful error handling
7. **Loading States** - Better UX với loading indicators

## 🎯 Migration Guide

### Before (Monolithic)
```typescript
// 500+ lines trong 1 file
const Seats = () => {
  // Tất cả logic, UI, state trong 1 component
};
```

### After (Modular)
```typescript
// ~100 lines mỗi component
const Seats = () => {
  // Chỉ container logic
  return <ComponentComposition />;
};
```

---

🎉 **Component architecture giờ đây clean, maintainable và scalable!** 🎉
