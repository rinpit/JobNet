const jsonServer = require('json-server');
const auth = require('json-server-auth');

// 1. Khởi tạo Express app từ json-server
const app = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// 2. Bắt buộc: Gắn csdl (db) vào app để json-server-auth truy cập được
app.db = router.db;

// 3. Đĩnh nghĩa Quy tắc phân quyền (Rules)
const rules = auth.rewriter({
    users: 600,       // Chỉ chủ sở hữu mới xem/sửa tài khoản của mình
    jobs: 664,        // Ai cũng xem được tin tuyển dụng, nhưng phải login mới đăng bài được
    applications: 600 // Đơn ứng tuyển: Chỉ người tạo/người nhận xem được
});

// 4. Đăng ký Middlewares theo ĐÚNG THỨ TỰ
app.use(middlewares); // Logger, Static, CORS, Body-parser mặc định
app.use(rules);       // Áp dụng quy tắc Rewrite URL trước khi Auth kiểm tra
app.use(auth);        // Kiểm tra JWT Token & cấp quyền
app.use(router);      // Xử lý RESTful API CRUD trên db.json

// 5. Khởi động Server
// Thay vì hardcode const PORT = 5000;
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`JSON Server Auth đang chạy tại: http://localhost:${PORT}`);
});