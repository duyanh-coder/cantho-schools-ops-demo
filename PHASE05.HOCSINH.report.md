# PHASE 05 – HỌC SINH (Students module)

## Scope delivered
Students act as a deeply-managed, master-linked entity for Trường THCS Ninh Kiều
(`can-tho-school-001`): list + 9-tab detail, cascading campus→grade→class filters,
deep-linking, drill-downs from Cuối module, movements/history with **no hard delete**,
all derived from existing data (classes, personnel, timetables, teachers, campuses,
wards, facilities). Routing replaces the old redirect to
`/operations/schools?tab=students` (the hub CrudManager tab in `src/pages/Students/index.tsx`
is intentionally left untouched).

Follows the PHASE 04 convention: `academicYear` (string = `AcademicYear.id`, e.g.
"2026-2027") and `grade` (number) on the student instead of `academicYearId`/`gradeId`.

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
  and class detail; dual-click navigate; stats sections (Khối/Cơ sở/Lớp/Phường);
  global movements table.
- `src/pages/Students/StudentDetail.tsx` – header/breadcrumb + 9 tabs: Tổng quan
  (Descriptions + 6 KPI→tab jump), Hồ sơ, Quá trình học tập (timeline
  movements+history), Học bạ số (score/teacher/result/comment), Lịch học (timetables
  of `student.classId`, grouped by day), Biến động (list + movement modal writing
  movement → update student → history), Bán trú / 2 buổi, Thành tích, Lịch sử.
  Cross-links to class / campus / GVCN personnel.
- `src/pages/Students/labels.ts` – `MOVEMENT_TYPE_LABEL`, `movementTypeTone`.
- `src/pages/Students/style.scss`.
- `src/studentModule.integrity.test.ts` – 11 data-integrity tests (FK validity, status
  representation, roster coherence, movement/boarding flag coherence, evidence for
  every non-studying student).

## Modified files
- `src/mock/common/types/index.ts`, `src/mock/common/index.ts` – re-export new types.
- `src/mock/canTho/index.ts` – named exports for movements/achievements/boarding/
  history (not added to `canThoMockData` object, mirroring PHASE 04 arrays).
- `src/config/catalogs.ts` – `student-status` now 5 values: `studying`/Đang học,
  `transferred`/Chuyển trường, `dropped_out`/Nghỉ học, `graduated`/Đã tốt nghiệp,
  `suspended`/Tạm nghỉ (kept type `pending` legacy).
- `src/router/index.tsx` – routes `/operations/students` → `StudentList`,
  `/operations/students/:studentId` → `StudentDetail` (replaces the redirect).
- `src/components/dashboard/Sidebar/index.tsx` – "Học sinh" menu item (after "Lớp học").
- `src/pages/OperationsDashboard/index.tsx` – Học sinh card path → `/operations/students`.
- `src/config/taskModules.ts`, `src/config/roles.ts` – module hint / role feature path →
  `/operations/students`.
- `src/pages/Campuses/CampusDetail.tsx` – sĩ số only `status==="studying"`; student rows
  link (single path) to student/class detail; birthDate→dob; catalog status labels;
  toolbar "Xem tất cả học sinh" → `/operations/students?campusId=`.
- `src/pages/Classes/ClassDetail.tsx` – sĩ số/nam/nữ KPIs count `studying` only; name rows
  link to student detail; catalog status labels; toolbar → `/operations/students?classId=`.
- `src/pages/Classes/ClassList.tsx` – `studentCountByClassId` counts `studying` only;
  "Học sinh" cell now links to `/operations/students?classId=`.
- `src/pages/Schools/SchoolOverview.tsx` – Học sinh KPI `studying` only; name/class/campus
  cells link; section header "Xem tất cả".
- `src/mock/canTho/studentMovements.ts` – one record normalized: same-campus class change
  relabeled `class_transfer` (was `campus_transfer`).

## Routes / components
- `/operations/students` → `StudentList` (default academicYear=2026-2027, school NET)
- `/operations/students/:studentId` → `StudentDetail`
- Deep links: `?academicYear=`, `?campusId=`, `?grade=`, `?classId=`, `?wardId=`,
  `?gender=`, `?status=`, `?tab=` (list/stats/movements + detail tabs)

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
- Create in list context inherits cascading campus→grade→class (class must belong to the
  active campus/year); grade/academicYear normalized to the class's class metadata.
- Every movement writes: `StudentMovement` → `studentsApi.update` (class/campus/status) →
  `StudentHistoryEntry`; create/edit write `created`/`updated` history.

## Verification
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
- `Students/index.tsx` (hub CrudManager) still uses `canThoMockData.students` seed and
  `enrolmentChanges` – intentionally untouched.