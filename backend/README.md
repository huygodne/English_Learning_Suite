# Hướng dẫn chạy Backend - English Learning Suite

## Yêu cầu hệ thống

Trước khi chạy backend, bạn cần cài đặt các công cụ sau:

### 1. Java Development Kit (JDK)
- **Phiên bản yêu cầu:** JDK 21 hoặc cao hơn
- **Kiểm tra phiên bản:**
  ```bash
  java -version
  ```
- **Tải về:** [Oracle JDK 21](https://www.oracle.com/java/technologies/downloads/#java21) hoặc [OpenJDK 21](https://adoptium.net/)

### 2. Apache Maven
- **Phiên bản yêu cầu:** Maven 3.6+ 
- **Kiểm tra phiên bản:**
  ```bash
  mvn -version
  ```
- **Tải về:** [Apache Maven](https://maven.apache.org/download.cgi)
- **Lưu ý:** Dự án có sẵn Maven Wrapper (`mvnw` và `mvnw.cmd`), bạn có thể sử dụng mà không cần cài Maven

### 3. MySQL Database
- **Phiên bản yêu cầu:** MySQL 5.7+ hoặc MySQL 8.0+
- **Tải về:** [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)
- **Hoặc sử dụng:** XAMPP, WAMP, hoặc Docker

## Cấu hình Database

### Bước 1: Cài đặt và khởi động MySQL

1. Cài đặt MySQL Server
2. Khởi động MySQL service
3. Đảm bảo MySQL đang chạy trên port mặc định `3306`

### Bước 2: Tạo Database (Tự động)

Database sẽ được tạo tự động khi ứng dụng chạy lần đầu nhờ cấu hình:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/englishwebsite?createDatabaseIfNotExist=true
```

**Hoặc tạo thủ công:**
```sql
CREATE DATABASE IF NOT EXISTS englishwebsite;
```

### Bước 3: Cấu hình thông tin kết nối

Mở file `backend/src/main/resources/application.properties` và cập nhật thông tin kết nối MySQL:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/englishwebsite?createDatabaseIfNotExist=true
spring.datasource.username=root          # Thay bằng username MySQL của bạn
spring.datasource.password=123456        # Thay bằng password MySQL của bạn
```

**⚠️ Lưu ý:** Nếu bạn muốn giữ thông tin nhạy cảm riêng tư, tạo file `application-local.properties` (file này không bị commit lên git):

```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

## Cấu hình Chatbot (Google Gemini API)

### Bước 1: Tạo API Key

1. Truy cập: https://aistudio.google.com/app/apikey
2. Đăng nhập bằng tài khoản Google
3. Click **"Create API Key"** hoặc **"Get API Key"**
4. Copy API key được tạo

### Bước 2: Cập nhật API Key

**Cách 1: Sử dụng file riêng (Khuyến nghị)**

Tạo file `application-local.properties` trong `backend/src/main/resources/`:
```properties
gemini.api.key=YOUR_API_KEY_HERE
```

**Cách 2: Cập nhật trực tiếp**

Mở `backend/src/main/resources/application.properties` và cập nhật:
```properties
gemini.api.key=YOUR_API_KEY_HERE
```

**⚠️ Lưu ý bảo mật:**
- KHÔNG commit API key lên git
- File `application.properties` đã được thêm vào `.gitignore`
- Sử dụng `application.properties.example` làm template

Xem chi tiết tại: [CHATBOT_SETUP.md](./CHATBOT_SETUP.md)

## Cài đặt và chạy Backend

### Cách 1: Sử dụng Maven Wrapper (Khuyến nghị)

**Trên Windows:**
```bash
cd backend
.\mvnw.cmd spring-boot:run
```

**Trên Linux/Mac:**
```bash
cd backend
./mvnw spring-boot:run
```

### Cách 2: Sử dụng Maven đã cài đặt

```bash
cd backend
mvn spring-boot:run
```

### Cách 3: Build và chạy JAR file

```bash
cd backend
mvn clean package
java -jar target/English_Learning_Suite-0.0.1-SNAPSHOT.jar
```

## Kiểm tra Backend đã chạy thành công

Sau khi khởi động, bạn sẽ thấy log tương tự:
```
Started EnglishLearningSuiteApplication in X.XXX seconds
```

Backend sẽ chạy trên: **http://localhost:8080**

### Kiểm tra API hoạt động:

1. **Swagger UI (API Documentation):**
   - Truy cập: http://localhost:8080/swagger-ui.html
   - Hoặc: http://localhost:8080/swagger-ui/index.html

2. **Health Check:**
   - Kiểm tra log console để xem các endpoint đã được khởi tạo

3. **Test API với cURL hoặc Postman:**
   ```bash
   curl http://localhost:8080/api/health
   ```

## Cấu trúc dự án

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/ptit/englishlearningsuite/
│   │   │   ├── config/          # Cấu hình (Security, JWT, etc.)
│   │   │   ├── controller/      # REST Controllers
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   ├── entity/          # JPA Entities
│   │   │   ├── repository/      # JPA Repositories
│   │   │   ├── service/         # Business Logic
│   │   │   └── util/            # Utilities
│   │   └── resources/
│   │       ├── application.properties
│   │       └── application.properties.example
│   └── test/                    # Unit Tests
├── pom.xml                      # Maven dependencies
├── mvnw                         # Maven Wrapper (Linux/Mac)
├── mvnw.cmd                     # Maven Wrapper (Windows)
└── README.md                    # File này
```

## Các API Endpoints chính

- **Authentication:** `/api/auth/*`
- **Lessons:** `/api/lessons/*`
- **Tests:** `/api/tests/*`
- **Chatbot:** `/api/chatbot/*`
- **User Progress:** `/api/progress/*`
- **Admin:** `/api/admin/*`

Xem chi tiết tại Swagger UI: http://localhost:8080/swagger-ui.html

## Troubleshooting

### Lỗi: Port 8080 đã được sử dụng

**Giải pháp 1:** Đổi port trong `application.properties`:
```properties
server.port=8081
```

**Giải pháp 2:** Tắt ứng dụng đang sử dụng port 8080

**Trên Windows:**
```bash
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

**Trên Linux/Mac:**
```bash
lsof -ti:8080 | xargs kill -9
```

### Lỗi: Không kết nối được MySQL

1. Kiểm tra MySQL service đã khởi động chưa
2. Kiểm tra username/password trong `application.properties`
3. Kiểm tra MySQL đang chạy trên port 3306
4. Kiểm tra firewall không chặn kết nối

### Lỗi: Java version không đúng

Đảm bảo đã cài JDK 21:
```bash
java -version
```

Nếu cần, cài đặt JDK 21 và cập nhật `JAVA_HOME` environment variable.

### Lỗi: Maven dependencies không tải được

1. Kiểm tra kết nối internet
2. Xóa cache Maven:
   ```bash
   mvn clean
   rm -rf ~/.m2/repository  # Linux/Mac
   rmdir /s %USERPROFILE%\.m2\repository  # Windows
   ```
3. Build lại:
   ```bash
   mvn clean install
   ```

### Lỗi: Lombok không hoạt động

Đảm bảo IDE của bạn đã cài đặt plugin Lombok:
- **IntelliJ IDEA:** Settings → Plugins → Lombok
- **Eclipse:** Cài đặt Lombok plugin
- **VS Code:** Cài đặt extension "Language Support for Java"

### Lỗi: Chatbot API 403 Forbidden

API key đã bị rò rỉ hoặc không hợp lệ. Xem hướng dẫn tại [CHATBOT_SETUP.md](./CHATBOT_SETUP.md)

## Development Tips

### Hot Reload với Spring Boot DevTools

Spring Boot DevTools đã được cấu hình, ứng dụng sẽ tự động reload khi bạn thay đổi code (không cần restart).

### Debug Mode

Chạy với debug mode:
```bash
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
```

### Xem SQL queries

SQL queries sẽ được hiển thị trong console nhờ cấu hình:
```properties
spring.jpa.show-sql=true
```

## Tài liệu tham khảo

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security](https://spring.io/projects/spring-security)
- [JPA/Hibernate](https://hibernate.org/orm/documentation/)
- [Google Gemini API](https://ai.google.dev/docs)
- [Chatbot Setup Guide](./CHATBOT_SETUP.md)

## Liên hệ và hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra lại các bước cấu hình
2. Xem phần Troubleshooting ở trên
3. Kiểm tra log console để xem lỗi chi tiết
4. Tạo issue trên repository

