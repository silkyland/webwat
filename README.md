# Webwat express.js

## Clone or Download as zip
1. Clone or unzip to path/you/need e.g. cd d:/bundit
2. cd webwat
3. npm install
4. code . (Open VScode)

## Import webwat.sql to your database
0. ติดตั้ง Docker ให้เสร็จเรียบร้อย
1. เปิด Project ด้วย VSCode
2. เปิด Terminal ใน VScode แล้วพิมพ์ docker-compose up -d
3. เปิด http://localhost:8080 กรอก user: root, pass: 1234
4. สร้างฐานข้อมูลชื่อว่า webwat และ นำ webwat.sql เข้ามาใส่ฐานข้อมูล
5. เปิด Browser เช่น Google Chrome => http://localhost:3001 ถ้าแสดงหน้าเว็บแปลว่าถูกต้อง
6. เพิ่มผู้ใช้ตัวอย่างโดยเรียกผ่าน url http://localhost:3001/auth/add-sample-data
7. เปิดหน้า login  => localhost:3000/auth/login username => admin, password => 1234

Happy hacking !!

## License
WTFPL
