# Hướng dẫn nhúng BSR AI Chatbot vào Website Tĩnh

## Cách 1: Nhúng trực tiếp vào HTML

### Bước 1: Copy file `chat-widget.js` vào thư mục website của bạn

### Bước 2: Thêm script vào cuối thẻ `</body>` của HTML:

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <title>Website của bạn</title>
</head>
<body>
  <!-- Nội dung website của bạn -->
  
  <!-- Nhúng chatbot ở cuối body -->
  <script src="./chat-widget.js"></script>
</body>
</html>
```

## Cách 2: Nhúng từ URL/CDN

Nếu bạn host file `chat-widget.js` trên server/CDN:

```html
<script src="https://your-domain.com/path/to/chat-widget.js"></script>
```

## Cách 3: Nhúng inline (không khuyến nghị)

Copy toàn bộ nội dung file `chat-widget.js` và paste vào thẻ `<script>`:

```html
<script>
  /* Paste toàn bộ code từ chat-widget.js vào đây */
</script>
```

## ⚠️ Lưu ý quan trọng về CORS

### ✅ Hoạt động tốt khi:
- Website được host trên domain (ví dụ: `https://example.com`)
- Website trên GitHub Pages, Netlify, Vercel, etc.
- Website trên localhost (http://localhost)

### ❌ Sẽ lỗi CORS khi:
- Mở file HTML trực tiếp từ máy tính (file://)
- Origin là 'null'

### Giải pháp nếu gặp lỗi CORS:

1. **Host website lên server/domain** (khuyến nghị)
   - GitHub Pages (miễn phí)
   - Netlify (miễn phí)
   - Vercel (miễn phí)

2. **Cấu hình n8n server** để cho phép origin của website bạn:
   ```yaml
   N8N_CORS_ALLOW_ORIGINS=https://your-website.com,https://your-website.netlify.app
   ```

## Tùy chỉnh

Bạn có thể chỉnh sửa cấu hình trong file `chat-widget.js`:

```javascript
const OPTIONS = {
  webhookUrl: 'https://your-n8n-url/webhook/your-id/chat',
  title: 'Trợ lý ảo AI (Bản thử nghiệm)',
  lang: 'vi-VN',
  primaryColor: '#16a34a' // Màu xanh lá cây BSR
};
```

## Ví dụ hoàn chỉnh

Xem file `embed-example.html` để tham khảo cách nhúng vào website.

## Host miễn phí (khuyến nghị)

### GitHub Pages
1. Tạo repository trên GitHub
2. Upload files (index.html, chat-widget.js, logoBSRNew.png)
3. Vào Settings → Pages → chọn branch main
4. Website sẽ có URL: `https://username.github.io/repo-name`

### Netlify
1. Kéo thả thư mục vào https://app.netlify.com/drop
2. Hoặc kết nối với GitHub repository
3. Website tự động có URL: `https://random-name.netlify.app`

### Vercel
1. Cài đặt Vercel CLI: `npm i -g vercel`
2. Chạy `vercel` trong thư mục project
3. Website tự động có URL

## Kiểm tra

Sau khi nhúng, mở website và kiểm tra:
- ✅ Nút chat xuất hiện ở góc dưới bên phải
- ✅ Click vào nút mở được chatbox
- ✅ Gửi tin nhắn được
- ✅ Không có lỗi CORS trong Console (F12)

