# PHASE 05 – HỌC SINH (Students module)

## Scope delivered
Học sinh is **not** a standalone module: it is a **class-context module** reached only via
Lớp học → Chi tiết lớp → tab **Học sinh** (`/operations/classes/:classId?tab=students`),
for Trường THCS Ninh Kiều (`can-tho-school-001`). Students act as a master-linked entity
with a 9-tab detail (via `/operations/students/:studentId`), cascading campus→grade→class
filters, deep-linking, drill-downs, movements/history with **no hard delete**, all derived
from existing data (classes, personnel, timetables, teachers, campuses, wards, facilities).

Follows the PHASE 04 convention: `academicYear` (string = `AcademicYear.id`, e.g.
"2026-2027") and `grade` (number) on the student instead of `academicYearId`/`gradeId`.

## Navigation decisions
- Restored the hub "Học sinh" tab in Trường & Phân hiệu (`src/pages/Schools/index.tsx`)
  via `/operations/schools?tab=students` → `StudentList compact schoolId` for
  **all-school student management** (KPI + cascading Năm học→Cơ sở→Khối→Lớp +
  add/edit toàn trường); kept the standalone `/operations/students` segment as a
  redirect to this tab.
- "Lớp học" remains a hub tab (`/operations/schools?tab=classes`) alongside Học sinh.
- Class Detail (Tổng quan / Sĩ số / Học sinh / ...) embeds `StudentList` in its Học sinh
  tab via a new `classId` (class-scoped) mode — **thêm dữ liệu học sinh cho chi tiết lớp**.
- StudentDetail back/breadcrumb is class-context when the student has a class:
  `/operations/classes/${classItem.id}?tab=students`; fallback (no class) →
  `/operations/schools?tab=students`.
- Old hub CrudManager page `src/pages/Students/index.tsx` is left untouched/unreferenced.

## New files
- `src/mock/common/types/student.ts` – `StudentStatus` (`studying | pending | suspended |
  transferred | dropped_out | graduated`), extended `Student` (`academicYear?`, `grade?`,
  `wardId?`, `birthPlace?`, `ethnicity?`, `guardianName?`, `email?`), extended `Transcript`
  (`semesterId?`, `teacherId?`, `comment?`, `result?`), plus `StudentMovement`/
  `StudentMovementType`, `StudentAchievement` (+ category/level types), `BoardingProfile`,
  `StudentHistoryEntry`/`StudentHistoryEventType`.
- `src/mock/canTho/students.ts` – enriched from existing seed: `CAMPUS_WARD` campus→ward
  map, `CLASS_BY_ID`, `specialStudents` (6 `can-tho-student-special-00X`: graduated ×2,
  transferred, suspended, dropped_out ×2), deterministic `enrichStudent()` filling
  academicYear/grade/wardId/ethnicity/birthPlace; exports `canThoStudents` +
  `canThoActiveStudents()`.
- `src/mock/canTho/studentMovements.ts` – 16 records (admitted/class_transfer/
  school_transfer/drop_out/graduate, source decisions QD-…).
- `src/mock/canTho/studentAchievements.ts` – 12 (competition/movement/other, levels
  school→national).
- `src/mock/canTho/boardingProfiles.ts` – 30 profiles (bán trú vs 2-buổi coherent flags:
  bán trú ⇒ 2 buổi; ăn trưa ⇒ bán trú).
- `src/mock/canTho/studentHistory.ts` – 15 audit entries.
- `src/mock/canTho/transcripts.ts` – rewritten: base rows enriched with `semesterId`
  (`{academicYear}-HK{semester}`), `teacherId` (`can-tho-teacher-001..004`),
  `result`, `comment`.
- `src/store/useStudents.ts`, `useTranscripts.ts`, `useStudentMovements.ts`,
  `useStudentAchievements.ts`, `useBoardingProfiles.ts`, `useStudentHistory.ts` –
  localStorage-backed stores (`useCrud` + `useMemo`); `useStudents` exposes
  `byId/bySchool/byCampus/byClass` and `isActiveStudent`.
- `src/pages/Students/StudentList.tsx` – KPI cards (Tổng, Nam/Nữ, Đang học, Chuyển
  trường, Nghỉ học, Tốt nghiệp), cascading filters Năm học→Cơ sở→Khối→Lớp (+ Giới
  tính, Trạng thái, Phường-xã), diacritic-insensitive search, inner Tabs (Danh sách /
  Thống kê / Biến động) with URL sync, create/edit modal (duplicate-code check,
  auto `created`/`updated` history), student rows link to `/operations/students/:id`
  and class detail; stats sections (Khối/Cơ sở/Lớp/Phường); global movements table.
  **Class-scoped mode** (`classId` prop): context strip
  "HỌC SINH / Lớp {name} · Khối {grade} · {campus} — Năm học {year}", locked
  academicYear/campus/grade/class filters, compact column set
  (STT | Mã HS | Họ tên | Giới tính | Ngày sinh | Phường/xã | Trạng thái | Thao tác),
  add modal auto-prefill from the class (Cơ sở/Khối hidden), empty state
  "Lớp chưa có học sinh." + "Thêm học sinh".
- `src/pages/Students/StudentDetail.tsx` – header/breadcrumb (class-context back) + 9
  tabs: Tổng quan (Descriptions + 6 KPI→tab jump), Hồ sơ, Quá trình học tập (timeline
  movements+history), Học bạ số (score/teacher/result/comment), Lịch học (timetables
  of `student.classId`, grouped by day), Biến động (list + movement modal writing
  movement → update student → history), Bán trú / 2 buổi, Thành tích, Lịch sử.
  Cross-links to class / campus / GVCN personnel.
- `src/pages/Students/labels.ts` – `MOVEMENT_TYPE_LABEL`, `movementTypeTone`.
- `src/pages/Students/style.scss` (incl. `students-list__context`, `students-list-empty`).
- `src/studentModule.integrity.test.ts` – 11 data-integrity tests (FK validity, status
  representation, roster coherence, movement/boarding flag coherence, evidence for
  every non-studying student).

## Modified files
- `src/mock/common/types/index.ts`, `src/mock/common/index.ts` – re-export new types.
- `src/mock/canTho/index.ts` – named exports for movements/achievements/boarding/
  history (not added to `canThoMockData` object, mirroring PHASE 04 arrays).
- `src/mock/canTho/studentMovements.ts` – one record normalized: same-campus class change
  relabeled `class_transfer` (was `campus_transfer`).
- `src/config/catalogs.ts` – `student-status` now 5 values: `studying`/Đang học,
  `transferred`/Chuyển trường, `dropped_out`/Nghỉ học, `graduated`/Đã tốt nghiệp,
  `suspended`/Tạm nghỉ (kept type `pending` legacy). **"Chuyển lớp" is a movement type
  (`class_transfer`), not a status.**
- `src/router/index.tsx` – `/operations/students` and `/operations/students/:studentId`
  → `StudentList`/`StudentDetail`; `/operations/students` now **redirects** to
  `/operations/schools?tab=students`.
- `src/pages/Classes/ClassDetail.tsx` – **Học sinh tab embeds `<StudentList compact
  classId schoolId />`**; sĩ số/nam/nữ KPIs and student list come from the live
  `useStudents` store (`byClass`), replacing the static `canThoMockData.students` memo;
  "Xem tất cả học sinh" toolbar and old inline `studentColumns` removed.
- `src/pages/Classes/ClassList.tsx` – `studentCountByClassId` counts `studying` only;
  "Học sinh" cell links to `/operations/classes/:id?tab=students`.
- `src/pages/Students/StudentDetail.tsx` – back/breadcrumb + not-found redirect use
  class-context (`/operations/classes/${classItem.id}?tab=students`).
- `src/pages/Schools/index.tsx` – hub "Học sinh" tab removed (`TAB_KEYS`, tab items,
  `StudentList` import); "Lớp học" remains the hub tab.
- `src/pages/Schools/index.tsx` – hub **"Học sinh" tab restored**
  (`TAB_KEYS`, `activeTab`, `StudentList compact schoolId`), alongside "Lớp học";
  all-school management + deep links `?tab=students&campusId=`/`&classId=`.
- `src/pages/Schools/SchoolOverview.tsx` – Học sinh KPI `studying` only; name/class/campus
  cells link; section header "Xem tất cả" → `?tab=students` (incl. `&campusId=`).
- `src/pages/Campuses/CampusDetail.tsx` – sĩ số only `status==="studying"`; student rows
  link (single path) to student/class detail; "Xem tất cả học sinh" → `?tab=students&campusId=`.
- `src/pages/OperationsDashboard/index.tsx` – **added "Học sinh" card** (
  `?tab=students`, catalog `student-status`, count students) alongside existing
  "Lớp học" card; `moduleCounts` gains `?tab=students` key.
- `src/config/taskModules.ts`, `src/config/roles.ts` – module hint / role feature path &
  flow → `/operations/schools?tab=students`.

## Routes / components
- `/operations/classes/:classId?tab=students` → `StudentList` (class-scoped) inside
  ClassDetail.
- `/operations/students/:studentId` → `StudentDetail` (class-context back).
- `/operations/students` → redirect `/operations/schools?tab=students`.
- Hub: `/operations/schools?tab=classes` → `ClassList`, `?tab=students` → `StudentList`
  (Trường & Phân hiệu).
- Deep links: `?academicYear=`, `?campusId=`, `?grade=`, `?classId=`, `?wardId=`,
  `?gender=`, `?status=`, `?tab=` (list/stats/movements + detail tabs).

## Data model / relationships
- `Student` ↔ Campus (1:1 campusId), ↔ SchoolClass (optional classId), ↔ AcademicYear
  (academicYear string), ↔ Ward (optional wardId), ↔ Transcript (studentId), ↔
  StudentMovement (studentId), ↔ StudentAchievement (studentId), ↔ BoardingProfile
  (studentId), ↔ StudentHistoryEntry (studentId), ↔ Teacher (transcript.teacherId).
- `Transcript.semesterId` derived = `{academicYear}-HK{semester}`, consistent with
  `useSemesters` naming.

## Mockup data
- ~672 generated students (`can-tho-student-035..696`, ids 023-034 intentionally unused)
  + 22 seed + 6 special; boarding profiles reference only valid ids
  (001-022, special-001/002, 035/039/045/047/054/057); campus→ward mapping covers
  6 campuses; teachers `can-tho-teacher-001..004` on transcripts.

## CRUD / validation
- Create / update / movement only – **no hard delete** (transferred / dropped_out /
  graduated / suspended via movement with required reason).
- Duplicate student code check on create && edit.
- Create in class context inherits the class's campus/grade/academicYear (Cơ sở/Khối
  hidden in the form; class bound via `classFilter`/`classId`); otherwise inherits
  cascading campus→grade→class from filters.
- Every movement writes: `StudentMovement` → `studentsApi.update` (class/campus/status) →
  `StudentHistoryEntry`; create/edit write `created`/`updated` history.

## Verification
- `npx tsc -b` – clean.
- `npm run lint` – 0 errors, 1 pre-existing warning
  (`CrudManager/index.tsx:544:9` react-hooks/exhaustive-deps).
- `npm test` – 34 passed (23 existing + 11 integrity).
- `npm run build` – OK (pre-existing chunk-size warning).

## Remaining issues / notes
- Legacy `can-tho-campus-007..010` ids normalized via `CAMPUS_LEGACY_ID_MAP` on display.
- Transcript AVG in Tổng quan KPI is computed over all records (HK1 seed); labeled
  "Học kỳ 1" – switch to per-semester grouping if HK2 records are added.
- Timeline sort in Quá trình học tập orders by id key substring (movement/history ids
  carry base36 timestamps); effectiveDate/createdAt ordering equal in practice.
- `Students/index.tsx` (old hub CrudManager) still uses `canThoMockData.students` seed and
  `enrolmentChanges` – intentionally unreferenced.
- Dashboard/Hub class counts derive from `useClasses` (classes module) while student
  sĩ số derives from `useStudents` (shared store) – both used consistently downstream.