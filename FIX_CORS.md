# Hướng dẫn sửa lỗi CORS cho GitHub Pages

## Vấn đề

Khi deploy lên GitHub Pages (`https://hoangtu0812.github.io`), bạn gặp lỗi:
```
Access to fetch at 'https://bsrassistant-bsrgn.msappproxy.net/...' 
from origin 'https://hoangtu0812.github.io' has been blocked by CORS policy
```

## Nguyên nhân

Server n8n chưa được cấu hình để cho phép requests từ origin `https://hoangtu0812.github.io`.

## Giải pháp: Cấu hình n8n Server

### Kiểm tra cấu hình hiện tại

Bạn đã có:
```yaml
N8N_DEFAULT_CORS=true
N8N_CORS_ALLOW_ORIGINS="*"
```

Cấu hình này **ĐÃ ĐÚNG** và nên cho phép mọi origin. Tuy nhiên, nếu vẫn lỗi, thử các bước sau:

### Bước 1: Restart container n8n

**QUAN TRỌNG:** Sau khi thay đổi environment variables, phải restart container:

```bash
# Dừng container
docker-compose down

# Khởi động lại
docker-compose up -d

# Hoặc restart trực tiếp
docker-compose restart n8n
```

### Bước 2: Kiểm tra container đã nhận cấu hình chưa

```bash
# Kiểm tra environment variables
docker exec -it <n8n-container-name> env | grep CORS

# Hoặc
docker-compose exec n8n env | grep CORS
```

Kết quả phải hiển thị:
```
N8N_DEFAULT_CORS=true
N8N_CORS_ALLOW_ORIGINS=*
```

### Bước 3: Kiểm tra logs

```bash
docker-compose logs n8n | grep -i cors
```

### Bước 4: Nếu vẫn không hoạt động - Thử cấu hình cụ thể

Nếu `*` không hoạt động, thử chỉ định rõ origin:

```yaml
services:
  n8n:
    environment:
      N8N_DEFAULT_CORS: "true"
      N8N_CORS_ALLOW_ORIGINS: "https://hoangtu0812.github.io,https://hoangtu0812.github.io/aichat.github.io"
```

Sau đó restart lại container.

### Cách 2: Cấu hình qua Environment Variables

Nếu không dùng docker-compose, thêm vào file `.env` hoặc environment variables:

```bash
N8N_CORS_ALLOW_ORIGINS=https://hoangtu0812.github.io,https://hoangtu0812.github.io/aichat.github.io
N8N_DEFAULT_CORS=true
```

### Cách 3: Kiểm tra cấu hình hiện tại

Kiểm tra xem n8n có đang chạy với CORS đúng không:

1. SSH vào server n8n
2. Kiểm tra environment variables:
   ```bash
   docker exec -it <n8n-container-name> env | grep CORS
   ```
3. Hoặc xem logs:
   ```bash
   docker logs <n8n-container-name> | grep -i cors
   ```

## Kiểm tra sau khi cấu hình

1. Restart n8n container
2. Mở website GitHub Pages
3. Mở Developer Console (F12)
4. Thử gửi tin nhắn trong chatbot
5. Kiểm tra Network tab xem request có header `Access-Control-Allow-Origin` không

## Nếu vẫn không hoạt động

### Kiểm tra Preflight Request

CORS có 2 bước:
1. **Preflight (OPTIONS request)** - Kiểm tra quyền
2. **Actual request (POST)** - Gửi dữ liệu

Nếu preflight fail, kiểm tra:
- Server có xử lý OPTIONS request không?
- Response có header `Access-Control-Allow-Methods: POST` không?
- Response có header `Access-Control-Allow-Headers: Content-Type` không?

### Thêm vào n8n workflow (nếu cần)

Nếu server vẫn không trả về CORS headers đúng, có thể cần thêm HTTP Response node trong workflow để set headers:

```
Access-Control-Allow-Origin: https://hoangtu0812.github.io
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## Lưu ý bảo mật

- `N8N_CORS_ALLOW_ORIGINS=*` cho phép mọi origin (không an toàn cho production)
- Nên chỉ định rõ các origin được phép
- Kiểm tra lại sau khi deploy để đảm bảo CORS hoạt động

## Test nhanh

### Test 1: Kiểm tra Preflight Request (OPTIONS)

```bash
curl -X OPTIONS https://bsrassistant-bsrqn.msappproxy.net/webhook/ca181ac5-1b33-4e41-bc32-9b2e07347f3f/chat \
  -H "Origin: https://hoangtu0812.github.io" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

**Kết quả mong đợi:**
- Status: `200 OK` hoặc `204 No Content`
- Headers phải có:
  ```
  Access-Control-Allow-Origin: https://hoangtu0812.github.io
  Access-Control-Allow-Methods: POST, OPTIONS
  Access-Control-Allow-Headers: Content-Type
  ```

### Test 2: Kiểm tra trong Browser Console

1. Mở website GitHub Pages
2. Mở Developer Tools (F12) → Network tab
3. Thử gửi tin nhắn trong chatbot
4. Xem request `OPTIONS` (preflight) và `POST`
5. Kiểm tra Response Headers có `Access-Control-Allow-Origin` không

### Test 3: Test trực tiếp trong Console

Mở Console (F12) và chạy:

```javascript
fetch('https://bsrassistant-bsrqn.msappproxy.net/webhook/ca181ac5-1b33-4e41-bc32-9b2e07347f3f/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ sessionId: 'test', chatInput: 'test', action: 'sendMessage' })
})
.then(r => console.log('Success:', r))
.catch(e => console.error('Error:', e));
```

## Vấn đề thường gặp

### 1. Container chưa restart
**Triệu chứng:** Cấu hình đúng nhưng vẫn lỗi  
**Giải pháp:** Restart container: `docker-compose restart n8n`

### 2. Nginx/Reverse Proxy chặn CORS
**Triệu chứng:** n8n có CORS nhưng vẫn bị chặn  
**Giải pháp:** Kiểm tra nginx config, thêm CORS headers ở nginx level

### 3. Webhook URL sai
**Triệu chứng:** Lỗi 404 hoặc CORS  
**Giải pháp:** Kiểm tra URL webhook đúng chưa, có `/chat` ở cuối không

### 4. Preflight request bị chặn
**Triệu chứng:** OPTIONS request trả về 404 hoặc không có CORS headers  
**Giải pháp:** Đảm bảo n8n xử lý được OPTIONS request

