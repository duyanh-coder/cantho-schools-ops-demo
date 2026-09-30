# PHASE 02 – DANH SÁCH CƠ SỞ & GIS (hiệu chỉnh Trường & Phân hiệu)

## 0. Bổ sung hiệu chỉnh (theo phản hồi sau chốt phạm vi)
- **Cột "Quy mô" logic với Tổng quan**: số liệu không còn đếm dòng mock thật
  (quá nhỏ: "8 lớp · 96 HS") mà phân bổ đúng tổng KPI (48 lớp · 4.280 HS ·
  240 CB-GV-NV) theo **share lớp thật** của từng cơ sở (8/48 = 1/6) bằng thuật
  toán **largest-remainder** để 6 cơ sở **khớp tổng chính xác** (2 cơ sở 714 HS,
  4 cơ sở 713 HS; CB-GV-NV 40 người/cơ sở). Cơ sở thuộc trường khác (không có
  stats) fallback về đếm thật.
- **Cột "Trạng thái" (CRUD) → link/popup**: bảng **Danh sách cơ sở (tab
  campuses, CRUD)** bỏ cột Trạng thái (Tag), thay bằng cột **Quy mô** link →
  popup số lượng ngắn gọn (lớp / HS / CB-GV-NV) + [Xem học sinh] / [Xem giáo
  viên] (cùng util dùng chung với SchoolOverview). Trạng thái hoạt động vẫn điều
  khiển được qua menu ⠇ ("Đổi trạng thái hoạt động") và CampusDetail header.

## 1. Phạm vi & mục tiêu
Hiệu chỉnh luồng **cơ sở giáo dục + GIS** cho **Trường THCS Ninh Kiều**
(`can-tho-school-001`): bảng **Danh sách cơ sở** trong tab "Tổng quan trường"
(`/operations/schools`) và trang **Bản đồ GIS** (`/operations/gis`). Phạm vi đã
chốt với người dùng: **chỉ bảng cơ sở trong SchoolOverview** được đổi cấu trúc;
sau đó user hiệu chỉnh thêm: cột **Quy mô** phải logic với Tổng quan và cột
**Trạng thái** của tab Danh sách cơ sở (CRUD) đổi thành **link/popup** số lượng
ngắn gọn (xem mục 0).

## 2. Files đã thay đổi
- `src/utils/campusScale.ts` – **mới**: `buildCampusScale(campusId)` phân bổ tổng
  KPI (4.280 HS / 240 CB-GV-NV) theo share lớp thật (largest-remainder, khớp
  tổng); fallback đếm thật khi không có stats. Dùng chung cho SchoolOverview và
  CRUD.
- `src/pages/Schools/SchoolOverview.tsx` – bảng cơ sở: cột **Quy mô**
  (dùng `buildCampusScale` dùng chung), cột Chi tiết 👁 + Bản đồ 📍 giữ deep-link;
  Table locale `emptyText: "Chưa có dữ liệu cơ sở."`; ô **Quy mô** là link mở
  **popup** số lượng ngắn gọn (lớp / HS / CB-GV-NV) + nút [Xem học sinh] → tab
  Học sinh lọc `campusId` và [Xem giáo viên] → tab Nhân sự của CampusDetail.
- `src/pages/GIS/index.tsx` – GIS page nâng cấp (chi tiết mục 5).
- `src/pages/GIS/style.scss` – style marker selected, popup, error banner.
- `src/pages/Campuses/CampusDetail.tsx` – header meta thêm điện thoại; guard
  **tab GIS** khi thiếu tọa độ (hiện trạng thái "Chưa có tọa độ GIS..." thay vì
  crash/NaN); trạng thái **"Không tìm thấy cơ sở."** khi `:campusId` không tồn tại
  (thay redirect câm) + nút [Quay lại danh sách].
- `src/pages/Campuses/index.tsx` – bỏ cột **Trạng thái** (Tag); thêm cột **Quy
  mô** link → popup cùng util (lớp / HS / CB-GV-NV + [Xem học sinh] / [Xem giáo
  viên]).
- `src/pages/Campuses/style.scss` – style `.campus-detail__empty` +
  `.campus-detail__gis-empty` + `.campus-list__scale` (popup cột Quy mô CRUD).
- `src/styles/_dashboard.scss` – style `.page-head__meta-phone`.
- `src/pages/Schools/overview.scss` – (giữ từ PHASE 01) khu vực bảng nằm trong
  layout scoped sẵn có; không phá vỡ PHASE 01.

## 3. Files mới
- `src/gisMock.integrity.test.ts` – 5 test integrity:
  1. Mọi GisCampus resolve được Campus entity (single source, khớp
     `isMainCampus` + schoolName).
  2. Mọi position GIS là tọa độ finite.
  3. Mọi Campus entity có latitude/longitude finite và khớp `location.lat/lng`.
  4. 6 cơ sở school-001 đều có `type` (HEADQUARTERS/BRANCH) + `phone`.
  5. 6 campus id khớp đúng tập campus school-001.

## 4. Data (mock)
Không thêm/đổi dữ liệu PHASE 02 — dùng lại `canThoCampuses` (6 cơ sở school-001,
mỗi cơ sở có `latitude/longitude/phone/type`) và `canThoGis` (6 GisCampus id
**khớp** Campus id, position/lat-lng đồng nhất). Không hard-code tọa độ/nhân sự
riêng cho từng campus.

## 5. Changes GIS
- **Single source**: popup marker đọc `Campus` entity qua `campusEntityById`
  (map từ `canThoMockData.campuses`) — cùng entity với bảng danh sách.
- **Popup nâng cấp**: tên cơ sở + tag **Loại** (Trụ sở chính/Phân hiệu) + địa chỉ +
  ☎ **điện thoại** + cảnh báo đang mở + hành động **[Chi tiết]** (→
  `/operations/campuses/:id`) và **[Đóng]**.
- **Focus/highlight**: `createCampusIcon(..., isSelected)` đổi marker thành
  `gis-campus-marker--selected`; `?campus=:id` → auto `openPopup()` qua
  `markerRefs`.
- **Empty/error states**:
  - `?campus=id-không-tồn-tại` → banner giữa map: "Không tìm thấy cơ sở." +
    [Quay lại danh sách]. Bỏ đúng trường hợp này khỏi context banner.
  - Campus được chọn mà thiếu tọa độ → banner "Chưa có tọa độ GIS..." + [Cập nhật
    tọa độ]; marker tự bỏ qua (không crash).
  - GIS page không có campus nào hiển thị → vẫn render bản đồ nền (ward/legend).

## 6. Components reused
- `StatsCard` (KPI GIS), `FocusMap`, `Marker`/`Popup`/`TileLayer`, `Button`,
  `Popover`/`Tooltip`, `Alert`, `WarningOutlined` — không tạo component GIS mới đặt
  ở nơi khác.

## 7. Routes
Không đổi route. Deep-link giữ nguyên:
- Bảng cơ sở → Chi tiết: `/operations/campuses/:id`.
- Bảng cơ sở → Bản đồ: `/operations/gis?campus=:id`.
- GIS popup → Chi tiết: `/operations/campuses/:id`.

## 8. Validation
- `npx tsc -b` ✅
- `npx eslint .` ✅ (0 error; 1 warning sẵn có ở `CrudManager` — không thuộc PHASE 02)
- `npx vitest run` ✅ **55/55** (7 files; +5 test PHASE 02 trong gisMock cộng 50 PHASE 01)
- `npm run build` ✅ (chỉ còn warning chunk-size sẵn có)
- Smoke: `vite preview` HTTP 200 cho `/operations/schools`,
  `/operations/schools?tab=campuses`, `/operations/gis`.

## 9. Test cases đã rà
- `schools?tab=schools` → bảng cơ sở 06 dòng, cột Quy mô là link → popup hiện
  số lượng logic với Tổng quan (~8 lớp · 713-714 HS · 40 CB-GV-NV, tổng khớp
  4.280 / 240) + nút [Xem học sinh]/[Xem giáo viên].
- `schools?tab=campuses` → bảng CRUD **không còn cột Trạng thái**; cột Quy mô
  link → popup số lượng ngắn gọn + [Xem học sinh]/[Xem giáo viên]; trạng thái vẫn
  đổi được qua menu ⠇.
- Chi tiết cơ sở → header hiển thị tên/loại/trạng thái/điện thoại; tab GIS có map.
- Bản đồ → `?campus=campus-main` auto zoom + mở popup + marker highlight.
- Popup → [Chi tiết] về đúng CampusDetail; [Đóng] đóng popup.
- `?campus=id-lạ` → "Không tìm thấy cơ sở." + [Quay lại danh sách].
- Campus thiếu tọa độ → GIS (marker ẩn + banner) và CampusDetail tab GIS (message)
  đều không crash.
- Refresh đường dẫn giữ được trạng thái (deep-link trả về nội dung đúng).

## 10. Không đụng tới (đúng ràng buộc)
Không CRUD mới, không nhân sự/học sinh/TKB/điểm danh, không phân quyền, không
thiết kế lại toàn bộ GIS (giữ ward filter, polygon, legend, sidebar), không thêm
menu mới, không duplicate data, không đổi design system. Tab "Danh sách cơ sở"
(/operations/schools?tab=campuses) chỉ đổi cột Trạng thái → Quy mô (link/popup);
toàn bộ CRUD (form thêm/sửa/xóa, đổi trạng thái, lịch sử) giữ nguyên.

## 11. Ghi chú / remaining issues
- Còn warning chunk-size build (sẵn có), warning lint CrudManager (sẵn có).
- Marker "Phân hiệu có cảnh báo" giữ logic đã có (chỉ phân hiệu không phải trụ sở).
- Demo GIS dùng tile `openstreetmap.de` — phụ thuộc mạng khi xem.
- Dừng tại PHASE 02 hoàn thành; chưa thực hiện PHASE 03 (chuyên sâu từng module).