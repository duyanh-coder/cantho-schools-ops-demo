# PHASE 05 – THỜI KHÓA BIỂU (Timetable module)

## Scope delivered
Thời khóa biểu là module độc lập tại `/operations/timetable` (route mới trong
`src/router/index.tsx`), áp dụng cho Trường THCS Ninh Kiều (`can-tho-school-001`),
năm học `2026-2027`, học kỳ `2026-2027-HK1`. Module gồm 6 tab lớn (đồng bộ URL
qua `?tab=grid|conflicts|assignment|versions|rooms|alerts`), kèm drawer chi tiết
ô thời gian, và tích hợp **4 trang chi tiết** khác qua `useTimetables(...)`:
Personnel / Class / Campus / StudentDetail.

## Navigation decisions
- Trang `/operations/timetable` có header "LỊCH GIẢNG DẠY / Thời khóa biểu" với
  Select **Học kỳ** + **Cơ sở** (mặc định Toàn địa bàn), KPI 4 thẻ (Tiết trong
  lưới / Xung đột / Thiếu tiết / Vượt định mức), sau đó là 6 tab:
  1. **Lưới thời khóa biểu** – bảng Tiết × Thứ Hai→Sáu, giờ học mỗi tiết; mỗi ô
     tô màu theo xung đột, click mở `CellDrawer`.
  2. **Kiểm tra & chỉnh sửa (n)** – `ConflictPanel`: KPI theo loại xung đột, danh
     sách 20 xung đột có cause/resolution, bảng "Chênh lệch so với định mức phân
     công" (thiếu/vượt), nút xử lý áp đề xuất ô trống.
  3. **Phân công giảng dạy** – `AssignmentBoard`: bảng `activeAssignments` của kỳ,
     KPI hạn mức/đã xếp, thêm phân công, link tới lớp/giáo viên.
  4. **Phiên bản & lịch sử** – `VersionPipeline`: KPI trạng thái, chuỗi phiên bản
     theo `rootId = supersedesId ?? id` (bản cao thay bản thấp, không sửa trực tiếp
     bản PUBLISHED), nút chuyển trạng thái theo luồng, timeline 16 lịch sử.
  5. **Phòng & công suất** – `RoomUsagePanel`: mỗi phòng dùng bao nhiêu tiết/ngày,
     dư sức chứa theo lớp, cảnh báo vượt sức chứa, link tới cơ sở.
  6. **Cảnh báo (6)** – đọc `canThoTimetableAlerts`, mỗi thẻ hiện level/refType/
    conflictType/cause/resolution, nút "Xem trong lưới" (nhảy tới ô của
    `timetableIds[0]`) và "Mở bảng xung đột".
- `CellDrawer` khi mở ô: danh sách tiết trong ô, xung đột tại ô, đề xuất ô trống
  (`suggestFreeSlots`), chuyển trạng thái, dời hoặc tạo bản điều chỉnh; apply
  bằng `applySuggestion`.
- Các trang chi tiết lọc `useTimetables({ teacherId | classId | campusId })`:
  PersonnelDetail (tab Lịch dạy, sort theo thứ), ClassDetail (tab Lịch học theo
  lớp), CampusDetail (tab Lịch học theo cơ sở), StudentDetail (tab Lịch học theo
  `student.classId`).
- Lịch sử được ghi tự động khi đổi trạng thái / dời tiết / tạo bản điều chỉnh
  (`historyApi.create`, actor "Ban Giám hiệu" / "Tổ trưởng chuyên môn").

## New files
- `src/mock/common/types/timetable.ts` – `WeekDay`, `TimetableEntryStatus`
  (gồm `ADJUSTING`), `TimetableEntry` (+ `assignmentId?`, `version`, `supersedesId?`,
  `updatedAt?`), `PERIOD_TIME` (5 tiết 07:00–11:05), `WEEKDAY_ORDER`,
  `STATUS_LABELS/STATUS_TONES`, `TimetableHistoryEntry` + `TimetableHistoryAction`
  (created/moved/teacher_changed/room_changed/status_changed/conflict_detected/…),
  `TimetableConflictType` (teacher/class/room_conflict, quota_*, assignment_missing,
  campus_mismatch, capacity_exceeded), `TimetableConflict`, `TimetableQuota`,
  `TimetableSuggestion`.
- `src/mock/canTho/timetablePlan.ts` – **nguồn dữ liệu TKB**:
  - `BASE_PLAN` 31 tiết nền (`can-tho-timetable-001..031`) giữ id/lớp/GV/môn cũ,
    ô giờ được xếp lại bằng greedy `findFreeSlot` (xoay vòng, lớp không dồn tiết);
    tất cả `PUBLISHED` `version: 1`.
  - `SUBJECT_TEACHERS` (5 môn × GV), `CYCLE_A/B/C`; `buildGenerated()` sinh 117 tiết
    cho 42 lớp học (`can-tho-timetable-032..`, trạng thái rải đều DRAFT/CHECKING/…).
  - `TIMETABLE_SCENARIOS`: 6 tiết kịch bản cố ý trạng thái `CONFLICT`
    (`-b01/b02` trùng GV, `-c01/c02` trùng lớp, `-d01/d02` trùng phòng),
    `adjustmentVersion = "can-tho-timetable-v01"`, `missingPeriod`
    (personnel-005/class-055/physics), `exceededPeriod` (personnel-005/class-011/
    physics), `crossCampus` (personnel-002).
  - `plannedPeriods` (135 bộ ba GV-lớp-môn, dedupe theo **winners map** trên
    version cao nhất) — đầu vào cho `personnelAssignments`.
- `src/mock/canTho/timetableHistory.ts` – 12 lịch sử mẫu (created/room_changed/
  status_changed/conflict_detected ×4/moved/room_changed/published/updated/
  conflict_resolved); **history-002 `room_changed`** trước `room-main-01` sau
  `room-main-03`, **history-003 `status_changed`** PUBLISHED v1 → ADJUSTING v2.
- `src/utils/timetable/status.ts` – `STATUS_FLOW` (DRAFT→CHECKING→APPROVED→
  PUBLISHED; PUBLISHED→ADJUSTING→CHECKING…), `canTransit`, `isEditableStatus`,
  `describeTransition`, `nextStatus`.
- `src/utils/timetable/conflicts.ts` – `weeksOverlap`, `isSameVersionLine`,
  `detectConflicts` (trùng GV/lớp/phòng theo cặp + assignment_missing +
  campus_mismatch + capacity_exceeded + quota), `detectMissingQuota`,
  `detectCrossCampusTeaching`, `detectAssignmentCoverage`, `validatePlacement`,
  `suggestFreeSlots`, `buildChangeLog`, `computeQuotaUsage`, `sortConflicts`.
- `src/utils/timetable/index.ts` – barrel re-export.
- `src/store/useTimetables.ts` – `TimetablesApi`: lọc theo campus/class/teacher/
  room/subject/year/semester/week/status; `bySlot`/`effectiveBySlot`;
  **`effective`** (winners map `supersedesId ?? id`, giữ version cao nhất);
  **`applyTransition`** (chỉ khi `canTransit`, tăng `version+1`); **`createAdjustment`**
  (chỉ khi `isEditableStatus`, tạo `ADJUSTING` `version+1` `supersedesId`, id `-vX`).
  Storage key mới **`can-tho-timetables-v2`** (seed cũ không khớp cấu trúc version).
  **Không cho sửa trực tiếp tiết PUBLISHED.**
- `src/store/useTimetableHistory.ts` – store localStorage + `byEntry/byClass/byTerm`
  (sort theo `createdAt` giảm dần).
- `src/pages/Timetable/index.tsx` (viết lại) + `style.scss` – 6 tab, KPI, drawer,
  `writeHistory`, `applyTransition`, `adjustEntry`, `applySuggestion`,
  `resolveConflict`, đọc `canThoTimetableAlerts`.
- `src/pages/Timetable/helpers.ts` – `buildLookups` (subject/class/teacher/campus/
  room maps, `classroomByCampus`), `slotLabel`, `shortTeacher`, `hasAnyConflict`,
  `SUBJECT_TONES`.
- `src/pages/Timetable/components/{TimetableGrid,CellDrawer,ConflictPanel,
  AssignmentBoard,VersionPipeline,RoomUsagePanel}/index.tsx` (+ `style.scss`) –
  6 component mới theo mô tả ở Navigation.
- `src/timetableModule.integrity.test.ts` – 10 test (xem Verification).

## Modified files
- `src/mock/common/types/index.ts`, `src/mock/common/index.ts` – re-export type/
  constant TKB + `alert` (thêm `conflictType`, `timetableIds`).
- `src/mock/canTho/alerts.ts` – thêm **6** `can-tho-timetable-alert-001..006`
  (teacher_conflict, class_conflict, room_conflict, quota_missing, quota_exceeded,
  campus_mismatch) tham chiếu `TIMETABLE_SCENARIOS`.
- `src/mock/canTho/personnelAssignments.ts` – assignments được sinh từ
  `plannedPeriods` (135 bộ ba, `periodsPerWeek` khớp tiết đã xếp).
- `src/mock/canTho/timetables.ts` – `canThoTimetables` = `plannedTimetables` map
  thêm `version ?? 1` + `assignmentId` (lookup 2026-2027/HK1/active theo bộ ba).
- `src/mock/canTho/index.ts` – exports `canThoTimetableHistory`, `canThoTimetableAlerts`
  (giữ mô hình PHASE 04: không gắn vào `canThoMockData` object).
- `src/store/usePersonnelAssignments.ts` – bổ sung `activeByTerm` (kỳ 1 active)
  dùng làm `quotaSources`.
- `src/pages/{Personnel/PersonnelDetail,Classes/ClassDetail,Campuses/CampusDetail,
  Students/StudentDetail}.tsx` – thêm `useTimetables(...)` + tab "Lịch dạy/Lịch học".
- `src/router/index.tsx` – route `/operations/timetable` → `TimetablePage`.
- `src/classModule.integrity.test.ts` – bỏ qua cặp cùng version line khi so
  trùng kín giờ (`a.id===b.id || a.supersedesId===b.id || b.supersedesId===a.id`).
- Xóa component TKB cũ (AttendanceChart, CampusStatus, FilterBar, OverviewChart,
  StaffStats, `Timetable/types.ts`) — trang viết lại từ đầu.

## Routes / components
- `/operations/timetable?tab=grid|conflicts|assignment|versions|rooms|alerts`.
- `/operations/personnel/:id` → tab Lịch dạy (theo `teacherId`).
- `/operations/classes/:id` và `/operations/students/:id` → tab Lịch học (theo `classId`).
- `/operations/campuses/:id` → tab Lịch học (theo `campusId`).

## Data model / relationships
- `TimetableEntry` ↔ Assignment giảng dạy (bộ ba `teacherId|classId|subjectId` qua
  `assignmentId`), ↔ SchoolClass/Personnel/Room/Campus/AcademicYear/Semester (FK).
- Bản điều chỉnh `supersedesId` trỏ bản gốc, `version` tăng; **`effective`** loại
  bản bị thay thế → lưới/xung đột/quota chỉ nhìn 1 bản/chuỗi.
- `plannedPeriods` (source of truth assignments) = dedupe winners của
  `plannedTimetables`; `history.before/after` = `snapshot()` từ entry thật.
- `RefType`/`conflictType` trên alert khớp `TimetableConflictType`.

## Mockup data
- `canThoTimetables` **155** dòng: 31 base rải 42 lớp (cơ sở/khối khác nhau —
  tạo nền để `detectCrossCampusTeaching` thấy 8 ca) + 117 generated (có `week:4`
  ở một số tiết) + 1 v01 + 6 scenario. **`effective` = 154** (base-001 bị v01 thay).
- `plannedPeriods` = **135** bộ ba; triple `003|class-001|math` = 3 sau khi dedupe
  (dù raw có 4 dòng: 001 + v01 + generated — gốc 001 bị thay bởi v01).
- Baseline xung đột trên **effective** (đúng thứ trang dựng):
  `teacher/class/room_conflict` = 1 mỗi loại, `quota_exceeded` = 1, `quota_missing`
  = 13, `cross campus` (detectCrossCampusTeaching) = 8, `assignment_missing` = 0,
  `campus_mismatch` đơn tiết = 0. (Chạy trên raw sẽ thấy `quota_exceeded` = 2 vì
  base superseded vẫn đếm — các test đều assert trên effective.)

## CRUD / validation
- Chuyển trạng thái qua `canTransit` (mỗi trạng thái có tập đích hợp lệ), tăng
  `version`; **không sửa trực tiếp PUBLISHED** — chỉ tạo bản ADJUSTING.
- `createAdjustment` chỉ hoạt động với trạng thái editable; thao tác UI gọi nó qua
  `adjustEntry` (bản đã xuất bản hiện nút "Tạo bản điều chỉnh").
- Mọi thay đổi ghi lịch sử (`before`/`after`), chi tiết ô hiển thị đề xuất ô trống.
- `buildAdjustment` luôn tạo v01: nếu ô gốc kín giáo viên khác thì **giữ nguyên
  giáo viên + slot**, chỉ chuyển sang phòng trống (`room-main-03`) — sửa bug v01
  từng không được seed (khiến history-002/003 trỏ entry không tồn tại).

## Verification
- `npx tsc -b` – clean.
- `npx eslint` (pages/Timetable, store TKB, utils/timetable, mock timetablePlan/
  timetableHistory/timetables, test module) – clean.
- `npx vitest run` – **45 passed (45)** / 5 files, gồm `timetableModule.integrity
  .test.ts` 10 test: FK hợp lệ, mọi tiết có assignment active, v01 supersede 001
  giữ slot + teacher + subject, effective 1 bản/chuỗi, plannedPeriods khớp
  effective, không double-book ngoài kịch bản cố ý, detectConflicts trên effective
  = đúng baseline, missing 13/cross 8, history/alerts resolve.
- `npm run build` – OK (chỉ cảnh báo chunk-size có sẵn).

## Remaining issues / notes
- KPI "Tiết trong lưới" đếm trên `effective`; raw repo có 155 dòng — khi làm việc
  với cache localStorage cũ `can-tho-timetables-v2` cần "Khôi phục mẫu" nếu seed
  cũ bị đổi.
- `plannedPeriods` tự sinh từ lưới nên "thiếu tiết" chỉ xuất hiện với assignment
  ngoài lưới (scenario missingPeriod); các assignment từ kịch bản vượt/thiếu đều
  giữ baseline mong muốn.
- `CYCLE_*`/`SUBJECT_TEACHERS` cố định 5 môn; mở rộng thêm môn mới cần thêm
  giáo viên vào pool để ô thời gian không kín.
- Tab Cảnh báo đọc `canThoTimetableAlerts` tĩnh (không theo lọc học kỳ/cơ sở);
  xung đột sống nằm ở tab "Kiểm tra & chỉnh sửa".
- History timeline giới hạn 16 mục gần nhất trên UI (dữ liệu đủ 12 mẫu).