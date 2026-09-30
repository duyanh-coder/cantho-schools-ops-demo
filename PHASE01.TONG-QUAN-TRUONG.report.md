# PHASE 01 – TỔNG QUAN TRƯỜNG (School Overview hiệu chỉnh)

## 1. Phạm vi & mục tiêu
Hiệu chỉnh tab **"Trường & Phân hiệu → Tổng quan trường"** tại `/operations/schools`
(`${tab=schools`) cho **Trường THCS Ninh Kiều** (`can-tho-school-001`), năm học
**2026-2027**. Bố cục mới: header + 4 **KPI card lớn** (Nhân sự / Học sinh / Cơ sở /
Lớp học) + 2 danh sách (**Cơ sở**, **Nhân sự**). Không còn khu vực **Cơ sở vật chất**
và **Danh sách học sinh** (dữ liệu không xóa – chỉ loại khỏi màn hình).

## 2. Cấu trúc màn hình (chi tiết)
- **Header**: eyebrow "TỔNG QUAN TRƯỜNG", tiêu đề = tên trường ("Trường THCS Ninh
  Kiều"), dòng phụ: Cấp học · Địa bàn · **Năm học 2026 - 2027** (lấy `activeYear`
  từ `useAcademicYears`, trạng thái `ACTIVE`). Block "Hiệu trưởng" giữ nguyên.
- **4 KPI card lớn** (thứ tự: Cơ sở → Lớp học → Nhân sự → Học sinh; kế thừa
`StatCard`, chỉ đổi kiểu **scoped** trong `overview.scss`, không sửa component
   dùng chung ngoài kiểu dáng nội dung note; thông tin trong card **viết đầy đủ,
   không viết tắt**, kích thước chữ dòng phụ lớn, rõ ràng; phần breakdown được
   hiển thị dạng **sơ đồ nhánh** – mỗi nhánh là một nút (nhãn + giá trị) nối với
   trục chung bằng dây/đường, không tách nhóm bằng tiêu đề con):
  1. **Cơ sở**: `06` · không hiển thị chi tiết breakdown.
  2. **Lớp học**: `48` · nhánh dạng **dọc** (mỗi khối một dòng, trục đứng bên trái):
     Khối 6 · 12 lớp; Khối 7 · 12 lớp; Khối 8 · 12 lớp; Khối 9 · 12 lớp.
  3. **Nhân sự**: `240` · nhánh: Giáo viên 210 → Cán bộ quản lý 08 → Nhân viên 22
     (không có tiêu đề "Theo vai trò"); **Nam/Nữ nằm ngang trên cùng dòng title**
     (Nam 92 · Nữ 148).
  4. **Học sinh**: `4.280` · nhánh: Khối 6 1080 → Khối 7 1060 → Khối 8 1070 →
     Khối 9 1070 (không có tiêu đề "Theo khối"); **Nam/Nữ nằm ngang trên cùng dòng
     title** (Nam 2.210 · Nữ 2.070).
- **Danh sách cơ sở** (bảng, 7 trường hợp dữ liệu = 06 dòng): Tên cơ sở · Loại cơ sở
  (Trụ sở chính/Phân hiệu) · Địa chỉ · Số điện thoại · **Chi tiết** (icon 👁,
  tooltip "Xem chi tiết cơ sở", deep-link `/operations/campuses/:id`) · **Bản đồ**
  (icon 📍, tooltip "Xem vị trí trên bản đồ", deep-link `/operations/gis?campus=:id`).
  Bỏ cột "Mã cơ sở", "Trụ sở chính (Tag)", "Trạng thái".
- **Nhân sự** (bảng, 08 dòng dữ liệu hiện hữu): Avatar (màu theo giới tính) · Họ và
  tên (deep-link hồ sơ) · Chức vụ/Vai trò · Bộ môn/Chuyên môn (map `subjectIds` →
  `subjects`) · Cơ sở (map `campusIds`) · **Chi tiết** (icon 👁, tooltip "Xem hồ sơ
  cán bộ/giáo viên", deep-link `/operations/personnel/:id`). Bỏ cột "Trình độ",
  "Trạng thái".

## 3. Files đã thay đổi
- `src/pages/Schools/SchoolOverview.tsx` – viết lại phần render: header, KPI,
  2 bảng, deep-link; bỏ studentColumns/facilityColumns + 2 section tương ứng.
- `src/pages/Schools/overview.scss` – style KPI lớn (số lớn, breakdown dạng
  **sơ đồ nhánh**: trục ngang hoặc trục đứng (bản dọc) + các nhánh nối bằng dây +
  nút nhãn/giá trị), icon 56px, bo 18px, giữ responsive 4→2 cột.
- `src/components/dashboard/StatCard/index.tsx` – thêm prop tùy chọn `titleExtra`
  (hiển thị ngang cùng dòng title, backward-compatible; Timetable vẫn dùng string).

## 4. Files mới
- `src/mock/canTho/schoolStats.ts` – **single source** aggregate cho KPI:
  `SchoolOverviewStats` (personnel/students/campuses/classes) + `getSchoolOverviewStats`.
  Số Nhân sự & Học sinh là số demo (240 / 4.280), **cơ sở & lớp học tự tính từ mock
  thật** (`canThoCampuses`/`canThoClasses`, khớp 1–1 nên không duplicate).
- `src/schoolOverviewStats.integrity.test.ts` – 5 test xác minh tổng khớp
  (GV+CBQL+NV = tổng; Nam+Nữ = tổng; K6..K9 = tổng; cơ sở/lớp khớp mock thật).

## 5. Mock data (school-001)
- Nhân sự: tổng **240** = GV 210 + CBQL 08 + NV 22; Nam 92 + Nữ 148.
- Học sinh: tổng **4.280** = K6 1080 + K7 1060 + K8 1070 + K9 1070; Nam 2.210 + Nữ 2.070.
- Cơ sở: **06** = 01 trụ sở chính (`campus-main`, tên "Trường THCS Ninh Kiều",
  `historicalName: "THCS Đoàn Thị Điểm"` giữ làm thông tin cũ) + 05 phân hiệu.
- Lớp học: **48** = K6 12 · K7 12 · K8 12 · K9 12 (khớp `canThoClasses`).
- Tổng breakdown = tổng chính trong mọi card (đã có test giữ vững).

## 6. Deep-link (đã kiểm tra route tồn tại)
- Chi tiết cơ sở → `/operations/campuses/:campusId` (CampusDetail).
- Bản đồ → `/operations/gis?campus=:campusId` (GIS đọc `searchParams.get("campus")`,
  tự chọn campus + zoom bounds).
- Hồ sơ nhân sự → `/operations/personnel/:personnelId` (PersonnelDetail).

## 7. Validation
- `npx tsc -b` ✅
- `npx eslint` (files đổi) ✅ (0 error; cảnh báo scss "File ignored" là sẵn có)
- `npx vitest run` ✅ **50/50** (6 files), có 5 test mới PHASE 01.
- `npm run build` ✅ (chỉ còn warning chunk-size sẵn có).
- Runtime: dev server `vite --port 5199` trả HTTP 200 cho `/operations/schools`.

## 8. Không đụng tới (đúng ràng buộc)
Khối/Lớp học, Học sinh, Thời khóa biểu, Chuyên môn, Phòng & CSVC, Điểm danh, GIS
(chỉ thêm link nguồn từ danh sách, không sửa page), Hồ sơ/Báo cáo, Hệ thống, chi
tiết Nhân sự; không CRUD mới, không phân quyền, không thiết kế lại toàn app.

## 9. Ghi chú
- ~~Số Nhân sự/Học sinh là **mock aggregate demo** theo ví dụ đề bài; 2 bảng chi tiết
  vẫn đọc dữ liệu thật hiện hữu (08 nhân sự / 06 cơ sở) nên số KPI có thể khác số
  dòng hiển thị~~ → **đã xử lý**, xem mục 11.
- Tên hiển thị: trụ sở chính = "Trường THCS Ninh Kiều"; phân hiệu = "Phân hiệu ...";
  "THCS Đoàn Thị Điểm" chỉ tồn tại ở `historicalName`.
- `Docs/PROGRESS.md` không cập nhật (file này chỉ ghi các GĐ đã commit/tag).

## 10. Đề xuất PHASE 02 (chỉ liệt kê, chưa thực hiện)
1. ~~Dựng `SchoolOverview KPI` đọc từ store/selector có sẵn thay vì đọc mock trực tiếp.~~
   → **đã làm**, xem mục 11.
2. Thêm người dùng xem được danh sách Nhân sự phân trang / tìm kiếm ngay trong tab.
3. Có thể bổ sung mini-chart (sĩ số theo khối, phân bổ GV theo môn) từ dữ liệu thật.

## 11. Đồng bộ số liệu nhân sự giữa Tổng quan và tab Nhân sự

### Vấn đề
Sau khi thêm bảng xem trước 10 nhân sự + nút **Xem thêm**, số liệu hai bên lệch nhau:
- Tổng quan: giáo viên **210** (loại trừ cán bộ quản lý).
- Tab Nhân sự: giáo viên **215** (đếm cả cán bộ đang được giao môn).
Có 5 người thuộc chức danh quản lý nhưng vẫn có `subjectIds`, nên bị đếm ở cả hai nhóm.

Nguyên nhân gốc: hai bên dùng hai nguồn và hai quy tắc khác nhau
(`getSchoolOverviewStats()` tĩnh ở Tổng quan vs `usePersonnel()` + `MANAGER_KEYWORDS`
ở tab Nhân sự).

### Cách sửa
- Thêm `src/mock/common/personnelRole.ts` làm **nguồn duy nhất** cho quy tắc phân nhóm:
  - `MANAGER_ROLE_TITLES`, `isManagerRole`
  - `personnelGroupOf` / `isTeachingRole` → mỗi người chỉ thuộc **một** nhóm,
    cán bộ quản lý được xếp trước dù còn có môn giảng dạy.
  - `summarizePersonnel` (total/managers/teachers/staff/male/female/active/inactive),
    `groupPersonnel`, `personnelOfSchool`.
- `SchoolOverview.tsx`: đọc nhân sự từ `usePersonnel()` (thay cho `canThoMockData.personnel`),
  tính `personnelSummary`/`personnelByRole` bằng helper chung, bỏ phụ thuộc KPI tĩnh.
- `PersonnelList.tsx`: KPI và tab "Cơ cấu" dùng cùng helper; xóa `MANAGER_KEYWORDS` cục bộ.
- `schoolStats.ts`: `personnelStatsOfSchool` dùng `summarizePersonnel`, và
  `canThoSchoolOverviewStats` sinh cho **cả 4 trường** thay vì riêng trường 001.
- Tiêu đề bảng hiện tổng (`Cán bộ, giáo viên, nhân viên (240)`) và số trên nút dùng
  `formatVnNumber`.

### Kết quả (trường `can-tho-school-001`)
| Chỉ số | Trước | Sau |
| --- | --- | --- |
| Tổng CB-GV | 240 | 240 |
| Cán bộ quản lý | 8 | 8 |
| Giáo viên | 210 / **215** | **210** (khớp cả hai nơi) |
| Nhân viên | 22 | 22 |

Tiền đề = hậu tố đảm bảo tổng khớp: `240 = 10 (preview) + 230 (Xem thêm)`.

### Validation
- `npm run typecheck` ✅
- `npx vitest run` ✅ **158/158** (14 files), thêm `src/personnelRole.integrity.test.ts`
  (5 test: nhóm loại trừ nhau, cán bộ có môn vẫn là cán bộ, thống kê mọi trường khớp,
  cộng preview + phần còn lại = tổng).
- `npm run lint` ✅ 0 error, 1 cảnh báo sẵn có ở `CrudManager/index.tsx:544`.
- `npm run build` ✅
