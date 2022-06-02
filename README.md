# food-store
 1. Project xây dựng website cho cửa hàng bán đồ ăn  
 2. Triển khai các thao tác CRUD dữ liệu, viết api, lưu dữ liệu vào Database 
 3. Các công nghệ sử dụng: NodeJS( ExpressJS), mongoDB (mongoose), dotenv, helmet, ... 
 4. Cấu trúc dự án: router - controller - model 
  - router kiểm tra các URL và chuyển nhiệm vụ xử lý cho Controller 
  - controller nhận request và trả về response 
  - model xử lý các business logic và mô hình database 
 5. thiết kế database 
  - DB gồm 4 documents: food, users, bookings, reviews
  - food - bookings: **many to many**, thông tin về **food** sẽ được **embeded** trong **booking** vì mỗi khi truy vấn đến bookings thì đều cần đến thông tin về food và giá của booking được xác định tại thời điểm đặt hàng, không phụ thuộc vào sự thay đổi giá food sau này
  - users - bookings: **one to many**, thông tin về **user** sẽ được **reference** trong **booking** vì thông tin về user có thể thay đổi
  - bookings - reviews: **one to many**, thông tin về **booking** sẽ được **reference** trong **review** vì mỗi khi truy vấn thông tin về review sẽ cần thêm thông tin về user, food ( được lưu trong booking) và những thông tin này có thể thay đổi nên refernce sẽ thuận tiện trong việc cập nhật thông tin
