# PHASE 03 – CHI TIẾT CƠ SỞ (hub quản lý của Trường & Phân hiệu)

## 1. Phạm vi & mục tiêu
Biến trang **Chi tiết cơ sở** (`/operations/campuses/:campusId`,
`src/pages/Campuses/CampusDetail.tsx`) thành **hub quản lý cơ sở** đúng spec mục
11: header giàu meta + **6 KPI từ quan hệ dữ liệu thật** (CB-GV-NV / khối-lớp /
phòng) + **5 tabs chức năng**. Phạm vi chốt với người dùng qua hỏi đáp:
- **Ẩn tab GIS và Lịch sử** → đúng 5 tab: `[Tổng quan] [Nhân sự] [Khối / Lớp]
  [Phòng & CSVC] [Thời khóa biểu]` (không có tab Học sinh; HS vào qua
  Khối/Lớp → Lớp → danh sách HS).
- **Breadcrumb tĩnh 1 dạng**: `Trường & Phân hiệu → Danh sách cơ sở → [Tên]`.
- Tab **Phòng & CSVC** thay bảng facilities bằng danh sách phòng
  (`useRooms(campusId).byCampus`, SchoolRoom).
- **KPI từ data relationship**: CBQL = roleTitle chứa "hiệu trưởng"; Giáo viên =
  có `subjectIds` và không phải CBQL; Staff = còn lại; Lớp = theo `campusId`;
  Học sinh = `status==="studying"` + `campusId`; **"Phòng học" = toàn bộ phòng**
  của cơ sở (classroom + function_room).
- CRUD "Danh sách cơ sở": **bỏ mục "Xem lịch sử"** khỏi menu ⠇ (tab history không
  còn); giữ "Đổi trạng thái hoạt động".

## 2. Files đã thay đổi
- `src/pages/Campuses/CampusDetail.tsx` – viết lại thành hub: breadcrumb tĩnh
  (antd `Breadcrumb`), header (`page-head`) thêm **điện thoại** + loại cơ sở qua
  tag `typeLabelMap` (HEADQUARTERS→"Trụ sở chính", BRANCH→"Phân hiệu"), hành động
  **[Quay lại danh sách]** → `/operations/schools?tab=campuses` và **[Xem trên
  GIS]** → `/operations/gis?campus=:id`.
  - **TAB_KEYS** mới: `overview | staff | classes | facilities | timetable`;
    tab lạ (`?tab=gis|students|history`) fallback về overview.
  - Tab **Tổng quan**: 6 KPI `StatsCard` (click KPI → chuyển tab tương ứng:
    nhân sự/Lớp/Phòng) + `Descriptions` giữ nguyên; dòng **Tọa độ GIS** kèm nút
    nhỏ **[Chỉnh vị trí]** mở modal sửa tọa độ (giữ chức năng sửa tọa độ PHASE 02,
    log `historyApi.create({ type: "gis_changed" })`).
  - Tab **Nhân sự**: bảng `personnelApi.items` lọc `campusIds.includes(campus.id)`
    — cột Họ tên (link hồ sơ), Vai trò (`roleTitle`), Chuyên môn (tags từ
    `subjectIds`→tên môn), Tổ bộ môn (`teamId`→tên `canThoMockData.sectors`),
    Chi tiết → `/operations/personnel/:id?tab=overview`.
  - Tab **Khối / Lớp**: `Collapse` mỗi panel **"Khối 6 · 2 lớp · 24 học sinh"**
    (đếm lớp + HS đang học theo lớp) → bảng lớp (Mã, Tên link
    `/operations/classes/:id`, Loại lớp, GVCN, Sĩ số, Xem).
  - Tab **Phòng & CSVC**: bảng `roomsApi.byCampus` — Mã phòng(code), Tên phòng
    (từ loại+code), Loại phòng (category→label), Sức chứa(capacity),
    Trạng thái sử dụng(condition→Tốt/Bình thường/Cần sửa chữa).
  - Tab **Thời khóa biểu** (overview framework): `Segmented` Theo lớp/GV/Phòng
    + bảng **Số tiết** gộp từ `timetablesApi.effective` (theo
    `classId`/`teacherId`/`roomId`) + nút [Mở Thời khóa biểu] →
    `/operations/timetable`.
  - Bỏ code cũ: tab GIS (leaflet imports, `GlobalOutlined` còn dùng cho nút Chỉnh
    vị trí), tab students/history, map marker, `COMPUTE_MARKER_SIZE`.
- `src/pages/Campuses/index.tsx` – menu ⠇ bỏ item **"Xem lịch sử"**
  (`?tab=history`); bỏ `HistoryOutlined` import; giữ "Đổi trạng thái hoạt động".
- `src/pages/Campuses/style.scss` – thêm style `.campus-detail__breadcrumb`,
  `__toolbar` (justify space-between), `__grade-count`; **xóa** style GIS/map/
  marker không dùng.
- `src/utils/campusSummary.ts` – **mới**: `summarizeCampus(campusId, allPersonnel?)`
  → `{ totalPersonnel, teachers, managers, staff, classCount, studentCount,
  roomCount }` (KPI đúng tập quan hệ thật).

## 3. Files mới
- `src/utils/campusSummary.ts` – util KPI dùng chung (nêu trên).
- `src/campusSummary.integrity.test.ts` – **4 test** integrity:
  1. Phân hiệu An Lạc có danh sách lớp khớp `canThoClasses` theo campusId.
  2. `teachers + managers + staff === totalPersonnel` cho mọi campus (phân hoạch
     không trùng/vượt) và khớp `canThoPersonnel` theo campusIds.
  3. roomCount của từng campus khớp `canThoRooms` theo campusId (đếm toàn bộ
     phòng classroom + function_room).
  4. studentCount khớp `canThoStudents` (studying + campusId).

## 4. Data (mock)
Không thêm/đổi dữ liệu. KPI nguồn gộp từ **quan hệ có sẵn**:
- Nhân sự: `canThoPersonnel` (mỗi người có `campusIds[]`, `roleTitle`,
  `subjectIds`, `teamId?`) → 6 cơ sở school-001 mỗi cơ sở **6 người** (1 CBQL +
  5 giáo viên); campus khác trường (007–010) đếm theo campusIds thật (2–3 người).
- Lớp: `canThoClasses` theo `campusId` (6 cơ sở mỗi cơ sở 8 lớp khối 6–9.
  Lưu ý: campus thuộc trường khác có ít lớp hơn).
- HS: `canThoStudents` (`status==="studying"` + campusId; 96 HS/cơ sở school-001).
- Phòng: `canThoRooms` đếm toàn bộ (23 phòng campus-main, 14 An Lạc, …).
- Lưu ý (đã thống nhất với user): số liệu thật mock hiện nhỏ hơn KPI 40
  CB-GV-NV phân bổ ở popup Quy mô (buildCampusScale PHASE 02) — accepted.

## 5. Routes
Không đổi route; deep-link còn hợp lệ:
- `/operations/campuses/:id` → overview (default) — GIS "Cập nhật tọa độ" và
  Timetable "mở campus" dẫn tới đây, dòng Tọa độ GIS có nút Chỉnh vị trí.
- `?tab=staff` (Campuses/index:637, SchoolOverview:438) — hợp lệ.
- `?tab=overview` (ClassDetail:657, StudentDetail:984) — hợp lệ.
- `?tab=classes` , `?tab=facilities`, `?tab=timetable` — tab mới.
- `?tab=history`/`gis`/`students` → fallback overview (không còn item menu history).

## 6. Components reused
`StatsCard` (click → tab), `Descriptions`, `Breadcrumb`, `Collapse`, `Segmented`,
`Table`, `Tabs`, `Modal` + `Form/InputNumber` (sửa tọa độ), `useRooms`,
`useTimetables`, `usePersonnel`, `useCampusHistory`.

## 7. Validation
- `npx tsc -b` ✅
- `npm run lint` ✅ (0 error; 1 warning sẵn có `CrudManager/index.tsx:544`)
- `npx vitest run` ✅ **59/59** (8 files; +4 test PHASE 03, nền 55 của PHASE 01–02)
- `npm run build` ✅
- Smoke `vite preview`: HTTP 200 cho `/operations/campuses/campus-main`,
  `/operations/campuses/campus-an-lac`, `?tab=staff`, `?tab=classes`.

## 8. Test cases đã rà
- Chi tiết cơ sở → breadcrumb 3 cấp + header (tên/địa chỉ/điện thoại/tag loại,
  trạng thái) + 2 nút [Quay lại danh sách]/[Xem trên GIS].
- 6 KPI: Tổng NS=6 · GV=5 · CBQL=1 · Lớp=8 · HS=96 · Phòng=23 (campus-main);
  campus khác trường đếm thật. Click KPI nhân sự/lớp/phòng chuyển đúng tab.
- Tab Nhân sự → 6 dòng, Họ tên & [Xem hồ sơ] → `/operations/personnel/:id`.
- Tab Khối/Lớp → 4 panel Collapse "Khối 6 · 2 lớp · 12 học sinh"(v.v.); lớp →
  `/operations/classes/:id`.
- Tab Phòng & CSVC → 23 dòng (campus-main) + empty state cho campus 007–010.
- Tab TKB → Segmented Theo lớp/GV/Phòng, gộp tiết từ `timetablesApi.effective`,
  [Mở Thời khóa biểu] → `/operations/timetable`.
- Tọa độ GIS → [Chỉnh vị trí] mở modal, lưu cập nhật `campusesApi.update` + log
  `gis_changed`; không còn tab GIS/map.
- Deep-link `?tab=staff`/`?tab=overview`/`?tab=classes` và fallback tab lạ.
- CRUD `schools?tab=campuses` → menu ⠇ không còn "Xem lịch sử", còn
  "Đổi trạng thái hoạt động".

## 9. Rollback
Backup tại `C:\Users\cuscsoft\AppData\Local\Temp\opencode\phase03-backup`
(`CampusDetail.tsx`, `index.tsx`, `style.scss`); xóa 2 file mới
(`src/utils/campusSummary.ts`, `src/campusSummary.integrity.test.ts`) để về trước
PHASE 03.

## 10. Không đụng tới (đúng ràng buộc)
Không CRUD/nhân sự/HS/TKB/điểm danh mới, không phân quyền, không đổi route,
không thêm menu, không duplicate data, không thiết kế lại. GIS page giữ nguyên
(banner "Cập nhật tọa độ" dẫn về overview + nút Chỉnh vị trí).

## 11. Ghi chú / remaining issues
- Warning chunk-size build + warning lint CrudManager (sẵn có, không thuộc PHASE 03).
- Demo GIS tile mạng (sẵn có).
- TKB tab dừng ở **overview framework** (Segmented + số tiết gộp), chưa dựng lưới
  TKB hoàn chỉnh trong tab (đúng phạm vi chốt).
- Dừng tại PHASE 03; chưa chuyên sâu các module còn lại.