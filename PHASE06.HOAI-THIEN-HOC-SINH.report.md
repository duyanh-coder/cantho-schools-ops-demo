# PHASE 06 – HOÀI THIỆN HỌC SINH (đưa học sinh vào context lớp)

Phạm vi: biến "Học sinh" từ một module cấp trường thành **ngữ cảnh bên trong lớp
học** – Trường & Phân hiệu → Lớp học → Chi tiết lớp → tab Học sinh → Hồ sơ học
sinh. Gỡ mọi entry point cấp trường, giữ nguyên route hồ sơ cũ để không phá link
đã lưu, và siết tính toàn vẹn dữ liệu sĩ số/nhu cầu.

## Bối cảnh và nguyên tắc giữ nguyên

- Chuỗi điều hướng duy nhất:
  `/operations/schools?tab=classes` → `/operations/classes/:classId?tab=students`
  → `/operations/students/:studentId`.
- Sự thật duy nhất: `Student.classId` cho sĩ số, `SchoolClass.homeroomTeacherId`
  cho GVCN, `BoardingProfile` cho nhu cầu, `StudentMovement` cho biến động,
  `StudentHistoryEntry` cho lịch sử.
- **Không** thêm `boarding` / `twoSession` / `mealRequired` vào `Student`;
  **không** thêm menu sidebar "Học sinh"; **không** thêm model/store/calendar mới.
- Ngữ cảnh lớp là bắt buộc: mọi màn hình học sinh phải trả lời được "lớp nào đang
  mở, ai là GVCN, học sinh có thuộc lớp không".
- `school-001` giữ đúng 142 lớp, toàn hệ vẫn 151 lớp, 5.682 học sinh.

## Điểm vào đã gỡ và đường dẫn tương thích

| Nơi | Trước | Sau |
| --- | --- | --- |
| `src/router/index.tsx` | `/operations/students` render module | `<Navigate to="/operations/schools?tab=classes" replace />` |
| `src/pages/Schools/index.tsx` | 6 tab, gồm `students` | 5 tab: `schools`, `campuses`, `personnel`, `sectors`, `classes` |
| `src/pages/OperationsDashboard/index.tsx` | 2 card trùng chủ đề | 1 card **Lớp học & Học sinh** → `?tab=classes` |
| `src/config/roles.ts` | đường dẫn cấp trường | `path: /operations/schools?tab=classes`, `flow: … → chi tiết lớp → tab Học sinh → …` |
| `src/config/taskModules.ts` | module học sinh | task "học sinh" mở `?tab=classes` |
| `src/pages/Campuses/index.tsx` | link không có đối số lọc | "Xem lớp học" kèm `campusId` |
| `src/pages/Schools/SchoolOverview.tsx` | link không có đối số lọc | "Xem lớp học" kèm `campusId` |

Tương thích ngược:

- `/operations/students/:studentId` **vẫn hợp lệ** (deep link hồ sơ, kết quả tìm
  kiếm, dữ liệu seed).
- `RETIRED_TAB_ALIASES` trong `Schools/index.tsx` ánh xạ bookmark
  `/operations/schools?tab=students` → `?tab=classes`, **giữ nguyên** tham số
  `school` để không mất trường đang xem.
- `?tab=students` vẫn hợp lệ trên `/operations/classes/:classId` (tab Học sinh)
  và trên hồ sơ học sinh. Kiểm thử chốt rõ hai điều này.

Dead code: xóa `src/pages/Students/index.tsx` (không còn import nào), khối
`students-list__context` và class SCSS tương ứng (ClassDetail đã sở hữu ngữ cảnh).

## Chi tiết lớp – ngữ cảnh và KPI

Tab **Học sinh** của `src/pages/Classes/ClassDetail.tsx` mở đầu bằng thanh ngữ cảnh
(`classes-detail__students-context`):

- `HỌC SINH – LỚP <TÊN LỚP VIẾT HOA>`
- Khối · Cơ sở · Năm học · GVCN (tên lấy từ `Personnel`, "Chưa phân công" nếu thiếu)

KPI lấy từ `rosterStats`/`needs` (tức `buildClassRosterStats`,
`buildClassNeeds`) để không lệch với dữ liệu dùng ở Tổng quan:

| KPI | Giá trị |
| --- | --- |
| Sĩ số | `total / capacity`, ghi chú `vượt sức chứa` hoặc `% sức chứa` |
| Nam / Nữ | sĩ số đang học |
| Còn trống | chỉ tiêu tiếp nhận |
| Bán trú / 2 buổi / Ăn uống | số học sinh có hồ sơ `BoardingProfile` |

Bảng cảnh báo của lớp nay nhận thêm `integrity` từ
`buildClassRosterIntegrity`, nên phát hiện được học sinh lệch khối/cơ sở/trường/năm
học/không có lớp.

`ClassDetail` là nơi **duy nhất** hiển thị ngữ cảnh và KPI trong tab Học sinh:
`StudentList` không render lại `students-list__context` hay dải `page-kpi` khi ở
chế độ `compact`. Trước khi sửa, tab này hiện **2 thanh ngữ cảnh giống nhau và 13
thẻ KPI** với hai bộ số khác nguồn (KPI của danh sách phản ánh bộ lọc tìm kiếm nên
lệch với sĩ số lớp).

## Danh sách học sinh trong lớp

`src/pages/Students/StudentList.tsx` nhận `classId` và tự suy ra phạm vi:

- `scopedClass = classesApi.byId.get(classId)`; `bySchool` + `classId` +
  `academicYear của lớp` ⇒ danh sách chỉ có học sinh của đúng lớp đang mở.
- `studentsApi.byClass(classId)` dùng cho số liệu toàn lớp (KPI, cảnh báo), còn
  `bySchool` dùng cho bộ lọc khi xem ở cấp trường.
- **Mặc định chỉ hiển thị `studying`** trong context lớp; bấm "Xoá lọc" trở về mặc
  định đó, không nhảy về "tất cả".
- Thanh tìm kiếm dùng lại placeholder `Tìm kiếm tên, mã HS, GVCN...`, tìm được
  theo tên, mã, GVCN, phòng học, cơ sở.
- Bộ lọc **Nhu cầu** (`Bán trú` / `2 buổi` / `Ăn cơm`) và cột **Nhu cầu** đọc từ
  `useBoardingProfiles` theo `rosterYear` của lớp; hồ sơ trùng năm học được bỏ qua.
- Trong context lớp **không** hiện bộ lọc Cơ sở/Khối/Lớp/Năm học; GVCN của lớp nằm
  ở thanh ngữ cảnh của `ClassDetail`.
- Tạo học sinh trong lớp: form prefill `classId`, `campusId`, `schoolId`, `grade`,
  `academicYear`; trường chọn lớp ở chế độ read-only (tag "Thuộc lớp này").
- Chặn lưu: học sinh `studying` bắt buộc có lớp, và lớp phải cùng trường.

## Hồ sơ học sinh

`src/pages/Students/StudentDetail.tsx`:

- Không tìm thấy học sinh (deep link hỏng) → chuyển về `/operations/schools?tab=classes`.
- `backPath` = tab Học sinh của lớp đang có; học sinh không có lớp → về tab Lớp học
  cấp trường.
- Breadcrumb: **Khối & Lớp học → Khối <khối> / Lớp <tên> → <tên học sinh>**, dùng
  `href` + `preventDefault` để copy link được.
- Biến động (`StudentMovement`): chỉ chuyển trong **cùng trường**, **cùng năm học**,
  **khác lớp**; `class_transfer` phải cùng cơ sở, `campus_transfer` phải khác cơ sở.
   Vẫn ghi `fromClassId`/`toClassId`, cập nhật học sinh và ghi lịch sử.

## Lần bổ sung: Hồ sơ dạng CV và Lịch học dùng chung

Yêu cầu bổ sung trên hồ sơ `can-tho-student-001`:

- Tab **Hồ sơ** không còn là `Descriptions` phẳng mà dựng thành lý lịch dạng CV, cùng
  bố cục với hồ sơ nhân sự: 3 thẻ KPI tóm tắt, cột trái danh tính dính (avatar, họ
  tên, lớp, thẻ bán trú/hai buổi/ăn cơm, mã học sinh, ngày sinh, SĐT giám hộ),
  cột phải gồm 6 khối có id để điều hướng:
  `student-cv-ly-lich`, `student-cv-hoc-tap`, `student-cv-nguoi-giam-ho`,
  `student-cv-ban-tru`, `student-cv-thanh-tich`, `student-cv-lich-su`.
- Mỗi khối chỉ tóm tắt rồi kèm nút **Xem tất cả** mở đúng tab chi tiết, nên CV
  không nhân bản dữ liệu của các tab khác.
- Component mới: `src/pages/Students/StudentCv.tsx`. Nhãn/tone dùng chung được gom
  vào `src/pages/Students/labels.ts` (`HISTORY_EVENT`, `MOVEMENT_TYPE_TONE`,
  `STATUS_TONE`) thay vì khai báo lặp trong hai trang.
- Tab **Lịch học** dùng `TimetableCalendar` với `mode="class"` và
  `entityId={classItem.id}` vì `TimetableCalendar` chỉ có hai chế độ `class`/`campus`
  và lịch của học sinh chính là lịch của lớp. Trên lưới TKB có bảng **Môn học**
  dựng từ `usePersonnelAssignments().byClass` (môn, giáo viên, tiết/tuần, tô màu
  theo `subjectTone`), bộ lọc học kỳ lấy từ `useSemesters`.
- Lớp chưa có thời khóa biểu hoặc học sinh chưa thuộc lớp nào hiện thông báo rõ
  ràng thay vì lưới rỗng. Trong dữ liệu mẫu mới 64/151 lớp có TKB nên nhánh này là
  trạng thái thật, không phải phòng thủ hình thức.
- `personnel-detail__identity*` trong `StudentDetail` được đổi thành
  `students-detail__identity*` (style cũ lồng dưới `.personnel-detail-page` nên
  không áp dụng). Toàn bộ style CV sao chép từ `Personnel/style.scss` và đặt trong
  `src/pages/Students/style.scss`, có thêm breakpoint 900px/620px.
- Bảng tiết cũ (`timetableColumns`) và các import không còn dùng đã bị gỡ.

## Toàn vẹn dữ liệu và cache

- `src/utils/classRoster.ts`: thêm `ClassRosterIntegrity` và
  `buildClassRosterIntegrity(students, classItem)`; `buildClassWarnings` nhận thêm
  `integrity` và phát cảnh báo thiếu `classId`/lệch `campusId`/`schoolId`/`grade`/
  `academicYear`.
- `useStudents`: `STUDENTS_SEED_VERSION = 1`; `useBoardingProfiles`:
  `BOARDING_PROFILES_SEED_VERSION = 1` — cache cũ tự hết hạn khi cấu trúc scope đổi.
- Sĩ số mẫu của `7A1` là 43/40, nên `remaining` âm và cảnh báo "vượt sức chứa" là
  dữ liệu thật, không phải lỗi hiển thị.

## Kiểm thử

| File | Số test | Nội dung |
| --- | --- | --- |
| `src/studentRouting.test.ts` | 18 | redirect `/operations/students`, giữ route hồ sơ, `RETIRED_TAB_ALIASES`, 5 tab trường, không còn `/operations/schools?tab=students`, link hợp lệ giữ nguyên, sidebar sạch, seed version; thêm: 6 section CV có id đúng, tab Lịch học dùng `TimetableCalendar` + bảng môn học từ `assignmentsApi.byClass`, không còn `timetableColumns`, không tái dùng class `personnel-detail__*` |
| `src/studentClassContext.integrity.test.ts` | 10 | `buildClassRosterIntegrity` phát hiện lệch khối/cơ sở/trường/năm học/thiếu lớp, không báo nhầm trên dữ liệu mẫu, `buildClassWarnings` dùng integrity, `buildClassNeeds` khớp hồ sơ nội trú, hồ sơ không trùng năm học |
| `src/studentClassContext.render.test.tsx` | 5 | render thật `StudentList` trong context lớp: **không** lặp context/KPI của `ClassDetail`, chỉ hiện học sinh đang học của lớp đang mở (không lọt học sinh lớp khác), mặc định lọc đúng `studying` và khớp `buildClassRosterStats`, có tìm kiếm + bộ lọc Nhu cầu/Giới tính và **không** có bộ lọc Cơ sở/Khối/Năm học, mã học sinh render trong bảng |
| `src/studentCvTimetable.render.test.tsx` | 5 | render thật `StudentDetail` cho `can-tho-student-001`: tab Hồ sơ có `.students-detail__cv` + cột dính + đủ 6 id section + 3 thẻ KPI, mọi bảng tóm tắt đều có nút **Xem tất cả**, hồ sơ không tồn tại thì không render CV và chuyển về context lớp; tab Lịch học có bảng Môn học + `.tt-cal`, không còn bảng tiết cũ, lớp chưa có TKB thì có thông báo |

Render test dùng jsdom + `@testing-library/react`. Polyfill `matchMedia` và
`ResizeObserver` cho antd đã tách ra `src/test/setupDom.ts` và nối qua
`test.setupFiles` trong `vitest.config.ts` để dùng chung cho mọi file test.

## Cổng kiểm tra

- `npm run typecheck` – sạch.
- `npx vitest run` – 18 file, 207/207 pass.
- `npm run lint` – 0 lỗi, 1 cảnh báo có sẵn
  (`src/components/dashboard/CrudManager/index.tsx:544:9`,
  `react-hooks/exhaustive-deps` về `confirmRemove` và `openEdit`).
- `npm run build` – OK.

Lỗi đã phát hiện và sửa trong lúc kiểm tra:

1. `rosterIntegrity` ban đầu là `useMemo` đặt sau nhánh `return` sớm của
   `ClassDetail`, vi phạm Rules of Hooks – đã chuyển lên cạnh `rosterStats` (cùng
   vùng hook không điều kiện).
2. Tab Học sinh lặp ngữ cảnh và hiện 13 thẻ KPI do cả hai bên cùng render – đã để
   `ClassDetail` sở hữu ngữ cảnh + KPI, `StudentList` chỉ còn bảng và bộ lọc.
    Dữ liệu mẫu cho thấy số KPI của danh sách phụ thuộc từ khoá tìm kiếm, nên để
    cạnh KPI sĩ số của lớp sẽ gây hiểu nhầm.
3. `StudentCv.tsx` khai báo thêm `Avatar`/`formatDate`/`toInitials`/`avatarColor`
   ở `StudentDetail` khi CV còn nằm trong cùng file; sau khi tách component, các
   helper này và `timetableColumns` thành mã chết và `tsc` báo `TS6133` – đã gỡ
   khỏi `StudentDetail`.
4. Script dòng khi ghi file đã đổi line ending của `StudentDetail.tsx` sang CRLF,
   làm kiểm thử nguồn khớp chuỗi nhiều dòng (`useTimetables({...`) hỏng – đã trả
   về LF cho toàn bộ file.

## Sai lệch so với mục tiêu đã đặt

- **Không có màn hình học sinh cấp trường nữa.** `StudentList` vẫn nhận
  `schoolId` không kèm `classId` khi được render từ ngữ cảnh khác (deep link
  cũ), khi đó mới hiện bộ lọc Cơ sở/Khối/Lớp/Năm học. Không còn route để mở nó
  từ UI.
- **Chuyển lớp bị chặn thêm 3 điều kiện** so với yêu cầu tối thiểu (cùng trường,
  cùng năm học): cùng cơ sở với `class_transfer`, khác cơ sở với `campus_transfer`,
  và không chuyển sang chính lớp đang đứng. Đây là siết chặn tham chiếu nhất quán
  với Phase 05; nếu nghiệp vụ cần chuyển xuyên năm học thì phải nới ở đây.
- **`missingClass` trong `buildClassRosterIntegrity` chỉ bắt được khi dữ liệu đầu
  vào gồm học sinh `studying` không có `classId`.** `ClassDetail` truyền
  `studentsApi.byClass(...)` nên mọi học sinh đã có `classId`; kiểm tra thiếu lớp
  hiện chỉ có hiệu lực ở kiểm thử phạm vi toàn hệ, không phát ra được từ màn hình
  lớp. Đã ghi rõ trong JSDoc của hàm.
- **Dashboard gộp 2 card thành 1** ("Lớp học & Học sinh") thay vì giữ 2 card như
  kế hoạch ban đầu, vì hai card trỏ cùng một đích và tạo cảm giác còn module riêng.

## Ghi chú còn lại

- Cột **GVCN** trong `ClassList` (Phase 05) chưa được xác nhận bằng trình duyệt;
  kiểm thử nguồn xác nhận dữ liệu GVCN phủ 151/151 lớp, nhưng hiển thị runtime
  vẫn cần đối chiếu tay.
- `useBoardingProfiles` chỉ được dùng để đọc; chưa có chặn tạo trùng hồ sơ cùng
  năm học ở màn hình (dữ liệu mẫu không có bản ghi trùng).
- Kiểm thử render phủ `StudentList` trong context lớp và `StudentDetail` ở hai tab
  Hồ sơ/Lịch học; `ClassDetail` vẫn mới được kiểm tra ở mức nguồn + dữ liệu.
- Tab Hồ sơ và Lịch học mới chưa được đối chiếu bằng trình duyệt: kiểm thử xác nhận
  cấu trúc DOM (`.students-detail__cv`, 6 section, `.tt-cal`, bảng môn học) nhưng
  căn cột sticky, độ dài danh sách và hành vi cuộn tới section vẫn cần xem tay.
- `TimetableCalendar` không có chế độ `mode="student"`, nên tab Lịch học gắn TKB của
  lớp. Nếu sau này cần lịch riêng theo học sinh (ví dụ lớp học sinh học lệch buổi)
  thì phải bổ sung chế độ mới ở `src/components/TimetableCalendar`.
- `students-list__context` đã bị gỡ; nếu sau này cần hiện ngữ cảnh lớp ở nơi khác
  thì dùng lại khối này, không nhân bản.
- Không commit. Không đụng `Docs/.~lock.Hieu_chinh gop y (28-09).docx#`.