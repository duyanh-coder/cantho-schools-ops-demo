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
| GĐ 4 | (đang triển khai) | — | — |

## Quy ước kỹ thuật

- **Format code**: mỗi đối số/mệnh đề trên một dòng riêng; không dùng
  comment trong code (chỉ ở file Markdown/tài liệu này).
- **Kiểm chứng**: `npm run lint` (0 lỗi), `npm run build` (pass),
  `npm test` (Vitest, xanh).
- **Lưu trữ**: các mô-đun CRUD bền dữ liệu qua localStorage với tiền tố
  `htql:crud:`.
- **Commit + tag**: mỗi giai đoạn kết thúc bằng commit và tag `gdX-…`.
