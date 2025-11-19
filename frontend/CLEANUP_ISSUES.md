# Code Cleanup - Các vấn đề đã phát hiện

## 🔴 Vấn đề nghiêm trọng

### 1. Z-Index Conflicts (Xung đột lớp hiển thị)
**Vấn đề**: Nhiều component sử dụng z-index không nhất quán, gây đè lên nhau

**Các z-index hiện tại**:
- `RewardPopup`: `z-[120]` - QUÁ CAO
- `FloatingChatbot`: `z-50`
- `HamburgerDrawer`: `z-50`, `z-40`
- `LessonDetailPage status`: `z-50`
- `AdminPage modal`: `z-50`
- `LibraryPage modal`: `z-50`
- `HomeHeader`: `z-40`
- `SiteHeader`: `z-30`
- `AnimatedMascot tooltip`: `z-50`

**Giải pháp**: Chuẩn hóa z-index hierarchy:
- Background: `z-0` đến `z-10`
- Content: `z-10` đến `z-30`
- Header/Nav: `z-30` đến `z-40`
- Floating elements: `z-50` đến `z-60`
- Modals/Overlays: `z-70` đến `z-80`
- Tooltips/Popovers: `z-90` đến `z-100`

### 2. Fixed Positioning Conflicts
**Vấn đề**: 
- `FloatingChatbot`: `fixed bottom-6 right-6 z-50`
- `LessonDetailPage status`: `fixed top-24 right-6 z-50`
- Cả hai có thể đè lên nhau ở góc phải màn hình

**Giải pháp**: Điều chỉnh vị trí hoặc z-index

### 3. Duplicate Header Components
**Vấn đề**: 
- `HomeHeader` và `SiteHeader` có chức năng tương tự
- Code trùng lặp, khó maintain

**Giải pháp**: Consolidate thành một component

## 🟡 Vấn đề trung bình

### 4. Unused CSS
**Vấn đề**: 
- `App.css` có styles không dùng (logo, card, read-the-docs)
- `index.css` có quá nhiều animations có thể conflict

**Giải pháp**: Xóa code không dùng

### 5. Inconsistent Class Names
**Vấn đề**: 
- Một số component dùng `nav-link`, một số tự style
- Một số dùng `btn-primary`, một số tự style button

**Giải pháp**: Sử dụng utility classes nhất quán

## 🟢 Vấn đề nhỏ

### 6. Unused Imports
**Vấn đề**: Một số file có imports không dùng

**Giải pháp**: Clean up imports

### 7. Inline Styles
**Vấn đề**: Một số component dùng inline styles thay vì Tailwind classes

**Giải pháp**: Chuyển sang Tailwind classes

