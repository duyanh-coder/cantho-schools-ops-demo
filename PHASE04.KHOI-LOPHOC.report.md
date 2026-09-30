# PHASE 04 – KHỐI / LỚP HỌC (Classes module)

## Scope delivered
Class now behaves as a master entity for Trường THCS Ninh Kiều (`can-tho-school-001`):
list + 9-tab detail, deep-linking, drill-downs from/near Cuối module, no hard delete
(only status change CLOSED/SUSPENDED with required reason), reusing existing data
(students, personnel, timetables, teachingAttendance, personnelAssignments, facilities).

## New files
- `src/mock/common/types/classModel.ts` – `AcademicYearStatus`, `AcademicYear`,
  `SemesterStatus`, `Semester`, `Grade`, `ClassType`, `ClassStatus`,
  `ClassHistoryEventType`, `ClassHistoryEntry`, `SchoolRoom`.
- `src/mock/canTho/academicYears.ts` – 3 years (2025-2026 CLOSED / 2026-2027 ACTIVE /
  2027-2028 DRAFT) + 4 semesters (HK1/HK2).
- `src/mock/canTho/rooms.ts` – rooms derived from existing `canThoFacilities`
  quantities per campus (prefixes main/b/c/d/e/f, ids `room-{prefix}-NN`),
  keeping the "no second data source" rule.
- `src/mock/canTho/classHistory.ts` – 5 seed history entries.
- `src/store/useAcademicYears.ts`, `useSemesters.ts`, `useClassHistory.ts`,
  `useRooms.ts` – localStorage-backed stores following `useCrud(key, seed)` + `useMemo`.
- `src/pages/Classes/ClassList.tsx` – KPI cards, filters (Năm học, Cơ sở, Khối, Loại
  lớp, GVCN, Trạng thái), keyword search, create/edit modal (duplicate-code check per
  year+campus, capacity >= current students), status-change modal (no delete), history
  entries on create/update/teacher change/status change, deep-link sync via
  URLSearchParams (default academicYear=2026-2027), dropdown actions and double-click
  navigate to detail (`?tab=students`, `?tab=history`).
- `src/pages/Classes/ClassDetail.tsx` – 9 tabs: Tổng quan, Học sinh, GVCN, Giáo viên
  bộ môn, Thời khóa biểu, Phòng học, Sĩ số, Hoạt động, Lịch sử; KPI → tab jump;
  cross-links to personnel/campus detail; `?tab=` deep link; back nav to list.
- `src/pages/Classes/style.scss`.
- `src/classModule.integrity.test.ts` – 8 data-integrity tests (FK validity).

## Modified files
- `src/mock/common/types/class.ts` – `SchoolClass` extended: `homeroomTeacherId?`,
  `roomId?`, `classType?`, `capacity?`, `note?`, `status: ClassStatus`
  (`active | inactive | suspended | closed`).
- `src/mock/common/types/index.ts` – re-export new types.
- `src/mock/canTho/classes.ts` – refactored to `baseClasses` + deterministic
  `enrichClass()`: homeroom teachers `can-tho-personnel-002..008`, rooms per campus
  (`room-main-01..03`, `room-b-01..02`, …), class types (2-buổi 024/025, nội trú
  024/025?→BOARDING, chuyên biệt 039/045), capacities 45/42/36 (default 40).
- `src/mock/canTho/index.ts` – export `canThoAcademicYears`, `canThoSemesters`,
  `canThoClassHistory`, `canThoRooms` (not added to `canThoMockData` object).
- `src/store/useClasses.ts` – normalizes status/classType/capacity + `byId`, `bySchool`.
- `src/config/catalogs.ts` – new catalogs: `class-type` (Loại lớp),
  `class-status` (Trạng thái lớp học), `academic-year-status` (Trạng thái năm học).
- `src/pages/Campuses/CampusDetail.tsx` – classes tab now renders status for new
  statuses, name links + double-click → class detail, toolbar button opens the class
  list pre-filtered with `?campusId=...`.
- `src/pages/Personnel/PersonnelDetail.tsx` – assignment tab "Lớp" cell links to
  class detail.
- `src/router/index.tsx` – routes `/operations/classes` and `/operations/classes/:classId`.
- `src/components/dashboard/Sidebar/index.tsx` – "Lớp học" menu item.

## Routes / components
- `/operations/classes` → `ClassList`
- `/operations/classes/:classId` → `ClassDetail`
- Deep links: `?academicYear=`, `?campusId=`, `?grade=`, `?classType=`, `?status=`,
  `?gvcn=`, `?tab=`

## Data model / relationships
- `SchoolClass` ↔ Campus (1:1 via campusId), ↔ AcademicYear (1:1 via academicYear
  string), ↔ Personnel GVCN (optional), ↔ SchoolRoom (optional roomId), ↔ Students
  (student.classId), ↔ TimetableItem (timetable.classId), ↔ TeachingAttendance
  (classId), ↔ PersonnelAssignment (classId).
- `SchoolRoom` ↔ Campus (1:1); `Semester` ↔ AcademicYear (1:1).

## Mockup data
- 57 base classes, 54+ enriched classes incl. grades 6-12 from other campuses
  (base data includes THPT Cái Khế), 3 academic years, 4 semesters, rooms derived
  from facilities, 5 class-history entries.

> Số liệu ở mục này là của bản Phase 04. Phase 05 đã nâng lên 151 lớp, 229
> phòng, 13 khối và 12 bản ghi biến động – xem `PHASE05.KHOI-LOPHOC-DEEP.report.md`.

## CRUD / validation
- Create / update / status-change only – no delete (status CLOSED).
- Duplicate code check within (academicYear, campusId).
- Capacity must be >= current number of students.
- Status change requires a reason → appended to history (`status_changed`).
- Every create/update/teacher-change writes a `ClassHistoryEntry`.

## Verification
- `npm run lint` – 0 errors, 1 pre-existing warning
  (`CrudManager/index.tsx:544:9` react-hooks/exhaustive-deps).
- `npm test` – 23 passed (15 existing + 8 integrity).
- `npm run build` – OK (pre-existing chunk-size warning).

## Remaining issues / notes
- Filter "Học kỳ" is not yet applied in ClassList (Filter uses academicYear only);
  Semester store exists and is ready to wire if desired.
- `SchoolClass.status` extended to 4 values – verify other renderers (SchoolOverview)
  if they hardcode active/inactive (CampusDetail already updated, Grep suggested no
  other status consumers rely on the old 2-value set; SchoolOverview uses catalog).
- Legacy `campus-main` ids normalized via `CAMPUS_LEGACY_ID_MAP` for display.

---

# Cập nhật Phase 05 (mở rộng sâu khối/lớp học)

Báo cáe chi tiết nằm ở `PHASE05.KHOI-LOPHOC-DEEP.report.md`. Tóm tắt thay đổi
so với bản Phase 04 ở trên:

- Lớp học tăng từ 57 lên **151 lớp**: Ninh Kiều 142 (main 40, An Lạc 26,
  Chu Văn An 24, Huỳnh Thúc Kháng 20, Thới Bình 17, Trần Hưng Đạo 15) và
  9 lớp của 3 trường khác.
- Phòng học: **229 phòng** (214 classroom + 15 phòng chức năng) cho cả 10 cơ sở
  trong hệ, sinh từ `canThoFacilities`; đủ phòng cho 151 lớp.
- GVCN: **151/151 lớp** có chủ nhiệm (trước đây 9 lớp của 3 trường khác bị "Chưa
  phân công" do chỉ duyệt 6 cơ sở Ninh Kiều).
- Thêm khối học `Grade` (13 khối, id `${schoolId}-g{grade}`) và `gradeId` trên
  `SchoolClass`.
- Detail gộp từ 9 tab còn **7 tab**: Tổng quan, Học sinh, Giáo viên, Thời khóa
  biểu, Tiếp nhận, Nhu cầu, Hồ sơ. GVCN nằm trong tab Giáo viên; Phòng học và
  Sĩ số nằm ở Tổng quan; Lịch sử gộp vào Hồ sơ.
- Bổ sung `useGrades`, `useEnrolmentChanges`, `classRoster.ts` (derive sĩ số,
  nhu cầu, tiếp nhận, cảnh báo), `GradeManagerModal`.
- CRUD lớp nay dùng chung quy tắc với store: `classDraftBlockers` (tên, mã,
  khối, cơ sở, năm học, mã duy nhất, GVCN phải đang hoạt động và thuộc đúng
  trường/cơ sở) và `classBlockers` cho xóa. Xóa lớp chỉ được phép khi lớp không
  còn học sinh, thời khóa biểu, phân công hay biến động.
- Sửa liên kết sai `?tab=history` (tab đã gỡ) thành `?tab=records`.