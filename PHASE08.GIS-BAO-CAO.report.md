# PHASE 08 – GIS / BÁO CÁO BGH (TKB, GIS, ẩn Cảnh báo, Báo cáo)

## Scope delivered
Bốn hạng mục trong một phase, không thêm dependency và không mở rộng sang các
module ngoài phạm vi:

1. **Thời khóa biểu (TKB)** – sửa lỗi layout buổi chiều thiếu tiết và giữ đúng
   số lớp/cơ sở theo dữ liệu.
2. **GIS** – lọc GeoJSON về đúng địa bàn Cần Thơ, thêm bộ lọc và panel chi tiết
   cơ sở, gỡ cảnh báo khỏi bản đồ.
3. **Cảnh báo** – ẩn khỏi toàn bộ UI điều hướng nhưng giữ nguyên route và dữ liệu.
4. **Báo cáo quản trị BGH** – tab "Tổng quan BGH" với 6 KPI, 8 biểu đồ và bảng
   tổng hợp theo cơ sở, dữ liệu derive từ nguồn mock/store hiện có.

> Correction quan trọng: `cantho_phuongxa_geo.json` có **103** đơn vị hành chính
> cấp xã. Dải mã Cần Thơ `31120`–`31321` giữ **33** đơn vị (11 phường + 22 xã),
> không phải 20 như ghi chú cũ. 70 đơn vị còn lại thuộc Sóc Trăng, Vĩnh Long, Bến
> Tre, Kiên Giang, Tiền Giang, Hậu Giang, Long An, Trà Vinh, Bạc Liêu.

## 1. Thời khóa biểu

### Vấn đề
`deriveSessionBlocks` chỉ dựng 10 tiết cho toàn bộ ngày khi hiển thị buổi sáng.
Khi chọn buổi chiều, các lớp có tiết 6–10 biến mất khỏi lưới, và các khung giờ
chiều bị coi như trống nên bộ đếm "phòng sử dụng"/"phân hiệu hoạt động" sai.

### Thay đổi
- `src/components/TimetableCalendar/helpers.ts` – `deriveSessionBlocks(events, sessionFilter?)`
  luôn dựng đủ 5 tiết sáng + 5 tiết chiều; tham số filter chỉ quyết định tiết nào
  được render, không quyết định cấu trúc ngày.
- `src/components/TimetableCalendar/useTimetableCalendar.ts` – truyền
  `filters?.session` xuống `deriveSessionBlocks`.
- `src/mock/canTho/timetablePlan.ts` – thêm `ALL_PERIODS`, `morningSlots()`,
  `allSlots()`, `buildDayFill()`; `findFreeSlot()` mặc định chỉ quét khung sáng để
  không chiếm các ô đã dồn tiết chiều.
- `src/pages/Timetable/components/RoomUsagePanel/index.tsx` – lưới 6 ngày × 10 tiết.
- `src/store/useTimetables.ts` – bump storage key `can-tho-timetables-v3`.
- `src/components/TimetableCalendar/timetableCalendar.test.ts` – invariant mới:
  64 lớp có lịch, mỗi lớp học T2–T7, tiết 6–10 có dữ liệu; giữ nguyên strain
  `can-tho-class-027` dồn tiết 6–10 vào thứ Tư.

### Kết quả
64/151 lớp có lịch (theo dữ liệu thực tế, không phải 151), mỗi lớp đủ 6 ngày và
đủ tiết sáng + chiều.

## 2. GIS

### Lọc địa bàn
- `src/mock/canTho/gis.ts` – chỉ giữ đơn vị có mã trong khoảng
  `CAN_THO_WARD_CODE_MIN = 31120` → `CAN_THO_WARD_CODE_MAX = 31321`.
  Ghi chú cũ nói "20 đơn vị" đã sửa thành 33, và số đơn vị ngoài vùng là 70.

### Chuẩn hoá hình học
`cantho_phuongxa_geo.json` có **một** đơn vị lỗi: xã Cờ Đỏ (`31261`) có tọa độ
lồng thừa một cấp so với 102 đơn vị còn lại (depth 5 thay vì depth 4 chuẩn
`MultiPolygon`). Trước đây `toMultiPolygon` cắt tầng một cách máy móc nên mỗi
"vòng" chỉ còn một điểm, Leaflet vẽ đường nét đứt đoạn.

- `src/mock/canTho/gis.ts` – `ringDepthOf()` đo độ sâu thực tế;
  `toMultiPolygon()` bóc đúng một tầng khi depth > 4; ring dưới 4 điểm bị loại
  (`MIN_RING_POINTS`) vì không tạo thành vùng kín.

### Trùng nguồn toạ độ
`campus-chu-van-an` có toạ độ khác nhau giữa `gis.ts` và `campuses.ts`
(10.0335 vs 10.0382). Đã đồng bộ `gis.ts` về giá trị của entity `Campus`.

### Giao diện
- `src/pages/GIS/index.tsx`:
  - Gỡ cảnh báo khỏi marker, popup và legend (route `/operations/alerts` vẫn giữ).
  - Filter **Trường**, **Loại cơ sở**, **Phường/Xã hồ sơ**, giữ filter ward bản đồ.
  - Panel thống kê theo ward nghiệp vụ (số cơ sở, học sinh, lớp, phòng).
  - Panel chi tiết cơ sở với đúng 16 trường: Mã cơ sở, Tên cơ sở, Loại cơ sở,
    Trạng thái, Trường phụ trách, Phường/Xã, Địa chỉ, Tọa độ, Điện thoại, Email,
    Người quản lý, Lớp học, Học sinh, Phòng học, Phòng chức năng, Nhân sự.
- `src/pages/GIS/style.scss` – style cho detail panel và stats panel.
- `src/utils/campusDetail.ts` – hàm thuần gom số liệu và sinh 16 nhãn trường.
- `src/utils/campusDetail.test.ts` – 11 test.

Phân biệt hai khái niệm ward: `Campus.wardId` (ward hồ sơ, dùng để lọc/thống kê)
và `GisWard` (ward hình học, dùng để vẽ).

## 3. Ẩn Cảnh báo

Gỡ khỏi UI nhưng **giữ nguyên** route `/operations/alerts`, page, mock và CSS:
- `src/components/dashboard/Sidebar/menuItems.tsx` (mục "Cảnh báo").
- `src/layouts/AppSidebar/menuItems.tsx`.
- `src/pages/Home/operationFeatures.tsx` (thẻ tính năng).
- `src/pages/OperationsDashboard/index.tsx` (KPI, card, quick-link).
- `src/config/roles.ts`, `src/config/taskModules.ts`.

## 4. Báo cáo quản trị BGH

### Nguyên tắc
Không tạo dataset hay số liệu viết tay. Toàn bộ chỉ số derive từ nguồn đang có:
`campuses`, `classes`, `students`, `personnel` (qua `getCurrentRegionMockData()`)
cùng `canThoRooms`, `canThoBoardingProfiles`, `canThoEnrolmentChanges`,
`canThoAcademicYears`. Nhu cầu học sinh lấy từ `canThoBoardingProfiles` (không
dùng `canThoBoarding`).

### Bộ lọc
Chỉ giữ **Năm học**. Bỏ Học kỳ vì không tác động tới bất kỳ chỉ số nào.

### Xu hướng nhiều năm
Dữ liệu chỉ có một năm học (`2026-2027`), nên thay biểu đồ xu hướng nhiều năm
bằng so sánh quy mô học sinh giữa các cơ sở, kèm ghi chú
`Chưa có dữ liệu nhiều năm học để so sánh xu hướng.`. Khi dữ liệu có từ hai năm
học trở lên, ghi chú tự động bị bỏ (`hasTrendData`).

### Nội dung
- 6 KPI: Học sinh, Lớp học, Nhân sự, Phòng học, Nội trú, Cơ sở.
- 8 biểu đồ: Học sinh theo khối; Quy mô học sinh theo cơ sở; Nhu cầu học sinh
  theo cơ sở (xếp chồng 2 buổi / nội trú / suất ăn); Cơ cấu nhân sự; Biến động
  tăng học sinh; Biến động giảm học sinh; Trạng thái lớp học; Tình trạng phòng học.
- Bảng tổng hợp theo cơ sở (Mã, Tên, Loại, Lớp, Học sinh, TB/lớp, Phòng học, Nhân sự).

### Files
- `src/pages/Reports/reportStats.ts` – hàm thuần `buildReportOverview()`,
  `gradeRangeOf()`, `gradeLabel()`; hằng `REPORT_SCHOOL_ID`, `TREND_UNAVAILABLE_NOTE`.
- `src/components/dashboard/Charts/index.ts` – mô hình thuần: `buildBarChart`,
  `buildBarList`, `buildDonut`, `buildStackedRows`, `colorAt`.
- `src/components/dashboard/Charts/Charts.tsx` – component chart tự viết bằng
  TSX/CSS/SVG, không dùng thư viện biểu đồ.
- `src/components/dashboard/Charts/style.scss`.
- `src/pages/Reports/ReportOverview.tsx`, `overview.scss`.
- `src/pages/Reports/index.tsx` – hai tab "Tổng quan BGH" và "Danh mục báo cáo".

### Sửa trong lúc rà soát
- Biểu đồ "Biến động tăng học sinh" trước đó dùng `row.net > 0 ? row.net : 0`,
  tức biến động ròng thay vì số học sinh tăng. Đã đổi sang `row.increase`.
- Bỏ `useMemo` ở `src/pages/Reports/index.tsx`: dữ liệu vùng đến từ store nên
  không giữ tham chiếu bất biến, React Compiler không bảo toàn được phép ghi nhớ
  (`react-hooks/preserve-manual-memoization`). Quy mô dữ liệu nhỏ nên tính trực tiếp.
- `DonutChart` dùng biến `cursor` cộng dồn trong `map`, React Compiler báo lỗi
  "Cannot reassign variable after render completes". Đã dùng `segment.startPercent`
  do `buildDonut` trả về.

## 5. Encoding

Quét toàn repo tìm ký tự thay thế U+FFFD: chỉ còn 2 dòng trong
`src/mock/canTho/alerts.ts` (tiêu đề và mô tả alert Chu Văn An) do có sẵn từ trước.
Đã sửa lại thành "Cần cập nhật danh sách học sinh phân hiệu Chu Văn An" và mô tả
tương ứng. Toàn bộ file trong repo hiện sạch U+FFFD.

## New files
- `src/mock/canTho/gis.test.ts` – 6 test cho lọc địa bàn, hình học, marker.
- `src/utils/campusDetail.ts`, `src/utils/campusDetail.test.ts` – 11 test.
- `src/components/dashboard/Sidebar/menuItems.tsx` – tách danh sách menu khỏi
  component để test kiểm tra được nội dung menu (`react-refresh/only-export-components`).
- `src/layouts/AppSidebar/menuItems.tsx` – cùng lý do.
- `src/pages/Home/operationFeatures.tsx` – cùng lý do.
- `src/config/alertsVisibility.test.ts` – 10 test khoá trạng thái ẩn Cảnh báo.
- `src/components/dashboard/Charts/` – `index.ts`, `Charts.tsx`, `style.scss`,
  `charts.test.ts` (13 test).
- `src/pages/Reports/reportStats.ts`, `src/pages/Reports/ReportOverview.tsx`,
  `src/pages/Reports/overview.scss`, `src/pages/Reports/reportStats.test.ts` (27 test).
- `src/reportsOverview.render.test.tsx` – 7 test render.
- `src/components/TimetableCalendar/overview.ts` – số liệu tổng quan tuần cho TKB.

## Verification
- `npm run typecheck` (`tsc -b`) – pass, 0 error.
- `npm run lint` – **0 error**, 1 warning có sẵn từ trước
  (`src/components/dashboard/CrudManager/index.tsx:544` react-hooks/exhaustive-deps).
- `npx vitest run` – **26 file, 294 test, tất cả pass** (trước Reports: 20 file,
  220 test).
- `npm run build` – OK (cảnh báo chunk > 500 kB có sẵn từ trước).

Test mới của phase: `gis.test.ts` 6, `campusDetail.test.ts` 11,
`alertsVisibility.test.ts` 10, `charts.test.ts` 13, `reportStats.test.ts` 27,
`reportsOverview.render.test.tsx` 7.

## Remaining issues / notes
- `src/mock/canTho/alerts.ts` và route `/operations/alerts` vẫn còn nguyên theo
  yêu cầu; mock alert dùng chung cho các module khác nên chưa xóa.
- Báo cáo giới hạn ở `can-tho-school-001` (6 cơ sở Ninh Kiều) theo phạm vi đã
  chốt; `REPORT_SCHOOL_ID` là hằng nên đổi sang nhiều trường cần chuẩn hoá thêm.
- `grades: []` được truyền vào `buildReportOverview` vì khối học lấy từ
  `gradeRangeOf` theo bậc, không cần bảng điểm.
- Biến động học sinh hiện gom theo ngày hiệu lực, chưa lọc theo năm học vì
  `EnrolmentChange` không có trường `academicYearId`.
- Cảnh báo chunk > 500 kB của Vite là vấn đề có sẵn, chưa xử lý trong phase này.