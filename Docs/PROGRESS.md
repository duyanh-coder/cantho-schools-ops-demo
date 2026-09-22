# Tiến độ dự án — Hệ thống Quản lý Cơ sở Giáo dục TP. Cần Thơ

Demo quản lý vận hành các cơ sở giáo dục (tập trung THCS Ninh Kiều) với
một giao diện web (Ant Design + React) và khả năng thao tác CRUD trên
localStorage.

## Giai đoạn

| Giai đoạn | Nội dung | Commit | Tag |
| --------- | -------- | ------ | --- |
| GĐ 0 | Tập trung THCS Ninh Kiều — chuẩn hóa tên/tọa độ 6 cơ sở, ẩn điểm danh | `7348283` | `gd0-thcs-ninhkieu` |
| GĐ 1 | Khung CRUD chung (`CrudManager`) + 4 module: Nhân sự, Khối–tổ, Học sinh, Bán trú (lưu localStorage) | `29d5082` | `gd1-crud-modules` |
| GĐ 2 | Unit tests cho `useCrud` (Vitest + jsdom + Testing Library) — CRUD + persistence, 7/7 pass | `7a9ece7` | `gd2-crud-tests` |
| GĐ 3 | Trợ lý AI — đề xuất nhanh (quick prompts) trên giao diện chatbot sẵn có | `cef9bc6` | `gd3-chatbot-quick` |
| GĐ 4 | Xuất Excel (CSV, UTF-8 BOM) từ danh sách đang lọc + panel phân bố theo biến nhóm trong `CrudManager` (áp dụng cho 4 module) | `0ec7e7b` | `gd4-crud-csv-export` |
| GĐ 5 | Tổng kết: PROGRESS.md, CHANGELOG, gate xanh (lint 0 lỗi / build / 7 test pass) | `44bc932` | `gd5-hoanthien` |
| GĐ 6 | Import Excel (CSV): parser thuần (`src/utils/csv.ts`) + 8 unit tests, nút "Nhập Excel" với `Upload` antd, map label→field name, hỗ trợ select/multiselect | `ba1f52b` | `gd6-csv-import` |
| GĐ 7 | Cổng thông tin điều hành: `/operations` (việc cần làm, thông báo, gợi ý chức năng theo vai — không chặn quyền), trang Công việc cần làm, danh mục dùng chung + trang Danh mục, hướng dẫn 3 bước & phân bố dữ liệu trong `CrudManager`, module dùng chung catalog | `619d0e2` | `gd7-portal-hoanthien` |
| GĐ 8 | Gọn menu, tập trung "Trường & Cơ sở": hub 1 header + tabs (Trường/Cơ sở CRUD, Nhân sự, Khối & tổ, Học sinh); bán trú thành thuộc tính `hasBoarding` của khối/tổ (bỏ trang Bán trú); Danh mục cuối menu (submenu từ `CATALOG_DEFS`, deep-link `?key=`); thêm catalog Cấp trường/Môn học/Chức vụ/Trình độ/Danh hiệu; `/operations` redirect → schools; Personnel/Sector nhận `compact` | `d886650` | `gd8-truong-coso-hub` |
| GĐ 9 | Ẩn dòng mô tả dưới tiêu đề ở mọi `page-head`; tab Nhân sự rút bảng còn 6 cột (Mã CB-GV, Họ tên, Chức vụ, Môn giảng dạy, Tổ chuyên môn, Trạng thái) + nút chi tiết (mắt) mở popup `Descriptions` hiện đủ thông tin còn lại; `CrudManager` thêm prop `detail`; export CSV xuất đủ các trường editable (bỏ trường hệ thống ẩn) | `76e1469` | `gd9-header-gon-nhansu` |
| GĐ 10 | Popup chi tiết thêm `detailWidth` (Nhân sự 1000px); tab Khối & Tổ rút gọn theo width, ẩn cột Mô tả khỏi bảng (chỉ hiện trong popup chi tiết), cột Thành viên hiển thị 3 người + Tooltip đủ danh sách, bật nút chi tiết | `97f8eb5` | `gd10-khoito-gon-detail` |
| GĐ 11 | Tab Học sinh rút gọn theo width: bảng Danh sách học sinh còn Mã HS, Họ tên, Giới tính, Cơ sở, Lớp, Trạng thái (ẩn Ngày sinh, SĐT phụ huynh, Địa chỉ vào popup); ẩn Lý do khỏi bảng Biến động sỉ số; bật nút chi tiết cho cả 3 sub-tab | `e871a1d` | `gd11-hocsinh-gon-detail` |
| GĐ 12 | Hub "Trường & Cơ sở" nâng 2 sub-tab thành 2 tab lớn (Danh sách trường, Danh sách cơ sở) → 5 tab lớn: trường, cơ sở, nhân sự, khối & tổ, học sinh; thêm param `tab=campuses`, bỏ wrapper sub-tabs | `5ae210b` | `gd12-hub-5tab` |
| GĐ 13 | Thay phần "Cách thực hiện công việc" (3 bước dạng text) bằng lưu đồ đầy đủ dạng ảnh: SVG nguồn (`src/assets/images/workflow/cach-thuc-hien.svg`) → rasterize PNG (1600×1360, nền trong suốt) bằng Chrome headless; gồm Bắt đầu → Xem & tìm → Diamond "Có? Sửa / Không? Thêm" → Xuất/Nhập Excel → Kết thúc (lưu tự động) | `e2b85bc` | `gd13-workflow-flowchart-png` |
| GĐ 14 | Thay lưu đồ dọc kiểu lập trình viên bằng ảnh ngang (960×340 → PNG 1920×680) thân thiện người dùng: 3 thẻ tròn góc có icon + số bước (1 Tìm, 2 Thêm/Sửa, 3 Excel) nối mũi tên trái→phải, đáy là ghi chú "Mọi thay đổi đã được lưu lại ngay"; bỏ diamond/nhánh rẽ | `8a679d2` | `gd14-workflow-horizontal-friendly` |
| GĐ 15 | Ẩn tạm mục "Cách thực hiện công việc" qua prop `showWorkflow` (mặc định false, giữ code + ảnh nguồn để bật lại); làm gọn block dự phòng; thêm thanh lọc Select riêng trong `CrudManager` (prop `filters`: field + tùy chọn `multiple`, lấy options từ field, phối hợp AND với ô tìm kiếm, chuẩn hóa so khớp boolean→"1/0", nút Xóa bộ lọc) — áp dụng: Trường (Cấp học, Trạng thái), Cơ sở (Trực thuộc, Trụ sở chính, Trạng thái), Nhân sự (Giới tính, Tổ, Môn giảng dạy, Cơ sở, GV giỏi, Trạng thái), Khối & Tổ (Loại hình, Khối lớp, Bán trú, Trạng thái), Học sinh (Giới tính, Cơ sở, Lớp, Trạng thái), Học bạ (Học kỳ, Môn, Hạnh kiểm), Biến động sỉ số (Lớp, Cơ sở, Loại biến động, Trạng thái) | `89dd887` | `gd15-filter-bar-hide-workflow` |
| GĐ 16 | Select "Trường đang xem" ở đầu hub lọc mọi tab; tab đầu thành **Tổng quan trường** (`SchoolOverview`: KPI + thông tin trường + bảng Cơ sở/Nhân sự/Học sinh/Cơ sở vật chất, đọc mock) — bỏ CRUD trường; `CrudManager` thêm `itemFilter` + `createDefaults` (lọc theo `schoolId`, mặc định gắn trường đang chọn khi thêm mới); mock mở rộng 4 trường (1 đầy đủ + 2 gọn: THCS Cái Răng, THCS Bình Thủy, THPT Cái Khế) kèm cơ sở, nhân sự, khối/tổ, lớp, học sinh, học bạ, biến động; thêm mô-đun **Cơ sở vật chất** (`SchoolFacility`, 26 mục kiểm kê); khối 10/11/12 vào catalog Cấp học; Personnel/Sector/Students nhận `schoolId` để scope dữ liệu. Lưu ý: giữ nguyên localStorage key cũ — tab Tổng quan/Select đọc mock trực tiếp, còn tab CRUD hiện trường mới sau khi bấm "Khôi phục mẫu" | `—` | `gd16-school-select-overview-facilities` |

## Quy ước kỹ thuật

- **Format code**: mỗi đối số/mệnh đề trên một dòng riêng; không dùng
  comment trong code (chỉ ở file Markdown/tài liệu này).
- **Kiểm chứng**: `npm run lint` (0 lỗi), `npm run build` (pass),
  `npm test` (Vitest, xanh).
- **Lưu trữ**: các mô-đun CRUD bền dữ liệu qua localStorage với tiền tố
  `htql:crud:`.
- **Commit + tag**: mỗi giai đoạn kết thúc bằng commit và tag `gdX-…`.
