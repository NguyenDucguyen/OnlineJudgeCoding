Hệ thống online judcoding(lấy ý tưởng từ hackerrank)

## Dữ liệu bài tập
* Các bài toán và test case được lưu trực tiếp trong cơ sở dữ liệu, không còn nạp từ mã nguồn.
* Tập dữ liệu mẫu cho môi trường phát triển nằm trong `server/src/main/resources/data.sql`. Spring Boot sẽ tự động chạy tập lệnh này khi khởi động (kể cả với MySQL) nhờ cấu hình `spring.sql.init.mode=always`.
