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
| GĐ 12 | Hub "Trường & Cơ sở" nâng 2 sub-tab thành 2 tab lớn (Danh sách trường, Danh sách cơ sở) → 5 tab lớn: trường, cơ sở, nhân sự, khối & tổ, học sinh; thêm param `tab=campuses`, bỏ wrapper sub-tabs |  |  |

## Quy ước kỹ thuật

- **Format code**: mỗi đối số/mệnh đề trên một dòng riêng; không dùng
  comment trong code (chỉ ở file Markdown/tài liệu này).
- **Kiểm chứng**: `npm run lint` (0 lỗi), `npm run build` (pass),
  `npm test` (Vitest, xanh).
- **Lưu trữ**: các mô-đun CRUD bền dữ liệu qua localStorage với tiền tố
  `htql:crud:`.
- **Commit + tag**: mỗi giai đoạn kết thúc bằng commit và tag `gdX-…`.
