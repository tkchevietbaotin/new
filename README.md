# 🌱 EcoScan AI - Nền Tảng Phân Loại Rác Thông Minh & Mạng Xã Hội Sống Xanh

**EcoScan AI** là ứng dụng web toàn diện tích hợp Trí tuệ nhân tạo (AI Vision) giúp nhận diện và phân loại rác thải tại nguồn, đo lường tác động môi trường, tính toán điểm **Eco Score**, quy đổi thành **Green Points** và kết nối cộng đồng hành động vì lối sống không rác thải (Zero-Waste).

---

## ✨ Tính Năng Nổi Bật

### 1. 🔍 AI Vision Studio Phân Loại Rác Thông Minh
- **Camera trực tiếp & Kéo thả ảnh**: Quét tức thì chai nhựa, vỏ lon nhôm, hộp carton, túi nilon, rác hữu cơ, rác nguy hại/pin cũ.
- **Thử nghiệm 1-Click**: Có sẵn 5 mẫu vật phẩm thực tế để kiểm tra chức năng ngay lập tức không cần tải ảnh.
- **Kết quả chuyên sâu**:
  - Chấm điểm thân thiện môi trường **Eco Score (0 - 100)**.
  - Đo lường lượng khí **CO₂ ngăn ngừa phát thải**.
  - Ước tính **thời gian phân hủy tự nhiên**.
  - **Hướng dẫn phân loại & xử lý** từng bước theo quy chuẩn.
  - **Gợi ý tái sử dụng sáng tạo (Upcycling / DIY)**.
- **Hỗ trợ kép AI**:
  - Tích hợp **Google Gemini 1.5 Flash Vision API** (nhập API key linh hoạt trong phần Cài đặt).
  - Tích hợp sẵn **Smart AI Simulator** hoạt động mượt mà cả offline hoặc khi chưa có API key.

### 2. 👥 Eco Feed - Mạng Xã Hội Cộng Đồng Xanh
- Bảng tin chia sẻ hình ảnh, mẹo sống xanh và các dự án DIY tái chế.
- Đính kèm kết quả quét AI trực tiếp vào bài viết.
- Thả tim (Like), thảo luận bình luận (Comments) và gắn thẻ chuyên mục (`#ZeroWaste`, `#TaiCheSangTao`, `#DIYUpcycling`, `#SongXanh`).
- Thưởng ngay **+30 Green Points** cho mỗi bài viết chia sẻ truyền cảm hứng.

### 3. 🏆 Bảng Xếp Hạng & Thử Thách Sinh Thái Tuần
- **Bục Vinh Danh Top 3 (Podium)**: Quán quân Vàng, Bạc, Đồng vinh danh những cá nhân đóng góp tích cực nhất.
- **Thử Thách Tuần (Weekly Quests)**: Nhiệm vụ phân loại rác nhựa, chia sẻ mẹo xanh, ủ phân hữu cơ với thanh tiến độ tự động cập nhật khi quét rác. Nhận điểm thưởng khi hoàn thành nhiệm vụ!

### 4. 👤 Hồ Sơ & Kho Huy Hiệu Sinh Thái
- Quản lý điểm **Green Points**, xếp hạng sinh thái (Eco Rank).
- Bộ sưu tập huy hiệu độc quyền: *Mầm Xanh Tân Thủ*, *Chiến Binh Giảm Nhựa*, *Bậc Thầy Tái Chế*, *Hiệp Sĩ Khí Hậu*, *Sứ Giả Sống Xanh*.
- Đăng nhập nhanh 1-Click với các tài khoản mẫu hoặc đăng ký tài khoản mới.

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend & Fullstack**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS (chủ đề Eco-Modern, Glassmorphism, Animations)
- **Icons & Effects**: Lucide React, Canvas Confetti
- **AI Engine**: Google Gemini 1.5 Flash Vision & Smart Contextual AI Simulator
- **State & Storage**: React Context + LocalStorage Persistence

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### 1. Cài đặt các gói phụ thuộc:
```bash
npm install
```

### 2. Khởi chạy môi trường phát triển (Dev Server):
```bash
npm run dev
```
Mở trình duyệt tại địa chỉ: `http://localhost:3000`

### 3. Build cho môi trường Production:
```bash
npm run build
npm start
```

---

## 🌐 Bản Quyền & Ý Tưởng
Được phát triển với tinh thần chung tay bảo vệ hành tinh xanh và thúc đẩy mô hình Kinh tế Tuần hoàn (Circular Economy).
