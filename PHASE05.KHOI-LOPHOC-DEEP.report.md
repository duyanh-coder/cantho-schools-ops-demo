# PHASE 05 – KHỐI / LỚP HỌC (mở rộng sâu)

Bản cập nhật của `PHASE04.KHOI-LOPHOC.report.md`. Phạm vi: dữ liệu lớp học cho
Trường THCS Ninh Kiều và 3 trường khác, quản lý khối, thời khóa biểu phủ 64 lớp
sinh thêm, giao diện 7 tab, CRUD có chặn tham chiếu, và bộ kiểm thử toàn vẹn.

## Bối cảnh và nguyên tắc giữ nguyên

- Route giữ nguyên: `/operations/classes` → `Schools?tab=classes`, detail tại
  `/operations/classes/:classId`.
- Sự thật duy nhất: `Student.classId` cho sĩ số, `SchoolClass.homeroomTeacherId`
  cho GVCN, `PersonnelAssignment` cho khối giảng dạy, `TimetableEntry` cho tiết
  học, `BoardingProfile` cho nhu cầu nội trú / hai buổi.
- Tên campus chuẩn hóa: `Trường THCS Ninh Kiều`, `Phân hiệu ...`.
  `THCS Đoàn Thị Điểm` chỉ còn là tên lịch sử trong dữ liệu cũ.

## Dữ liệu mới

| Nhóm | Số lượng | Ghi chú |
| --- | --- | --- |
| Lớp Ninh Kiều | 142 | main 40, An Lạc 26, Chu Văn An 24, Huỳnh Thúc Kháng 20, Thới Bình 17, Trần Hưng Đạo 15 |
| Lớp trường khác | 9 | `can-tho-school-002` 4 lớp, `-003` 2 lớp, `-004` 3 lớp |
| Tổng lớp | 151 | 142 + 9 |
| Phòng | 229 | 214 classroom + 15 phòng chức năng, sinh từ `canThoFacilities` cho **toàn hệ** 10 cơ sở |
| Khối học | 13 | NK 6–9, CR 6–9, BT 6–7, CK 10–12 |
| Học sinh | 5.682 | 5.676 đang học; Ninh Kiều 5.676, mỗi lớp 30–48 học sinh |
| Biến động lớp | 12 | tên campus đã chuẩn hóa, không còn campus đã nghỉ |
| Hồ sơ nội trú / hai buổi | 480 | sinh từ lớp `BOARDING` / `TWO_SESSION` + 30 hồ sơ viết tay |
| Nhân sự | 252 | 240 Ninh Kiều + 12 ở 3 trường khác (thêm 3 GV cho đủ chủ nhiệm) |

### GVCN và phòng học phủ kín danh sách lớp

Trước đây `assignHomeroomTeachers` và `assignRooms` chỉ duyệt `CAMPUS_PLAN` (6 cơ sở
Ninh Kiều) và cứng `schoolId === "can-tho-school-001"`, nên 9 lớp của 3 trường khác
hiện "Chưa phân công" ở cả cột GVCN lẫn Phòng học.

- `homeroomCandidatesOf(schoolId, campusId, personnel)` lấy trường theo chính lớp;
  `assignHomeroomTeachers`/`assignRooms` duyệt mọi cơ sở có lớp, chạy trên
  `allClasses`.
- Bổ sung 3 giáo viên (`can-tho-personnel-018` Đỗ Thị Mai · `-019` Trương Văn Kiệt ·
  `-020` Lý Thị Hồng Vân) vì 3 trường nhỏ chỉ có 1–3 giáo viên cho 2–3 lớp. Chuỗi
  id sinh tự động dịch sang `GENERATED_ID_START = 21` để không trùng.
- `rooms.ts` bỏ giới hạn `schoolId === SCHOOL_001` và thêm tiền tố `g`/`h`/`i`/`j`
  cho 4 cơ sở mới. Vì một cơ sở có thể khai nhiều cơ sở vật chất cùng loại, số thứ
  tự chạy liên tục theo từng cặp cơ sở + loại phòng; phòng thực hành mang hậu tố
  `th` (`room-j-th-01`, mã `JTH1`) để `id`/mã phòng duy nhất toàn hệ.

Kết quả: **151/151 lớp có GVCN** (đúng trường, đúng cơ sở, đang công tác, có môn,
không giáo viên nào chủ nhiệm 2 lớp) và **151/151 lớp có phòng học** hợp lệ.

Khối giờ có id `${schoolId}-g{grade}` (`gradeIdOf`), mã `NK-K6`… và
`SchoolClass.gradeId` được suy ra từ `SchoolClass.grade` khi đọc dữ liệu cũ.
`SchoolClass.grade` vẫn là nguồn sự thật, `gradeId` chỉ là khoá tra cứu.

## Thời khóa biểu

`src/mock/canTho/timetablePlan.ts` sinh thêm tiết học cho 64 lớp:

- 138 tiết planned, 170 planned periods, 186 tiết hiệu lực sau khi gộp phiên bản
  (48 tiết có sẵn + 138 tiết sinh thêm).
- 64/64 lớp sinh thêm đều có tiết trên lưới; 50 giáo viên trong kho sinh thêm,
  52 giáo viên xuất hiện trên toàn bộ thời khóa biểu.
- Mỗi giáo viên trong kho chỉ dạy ở **một** cơ sở. Đây là bản vá cho lỗi "một
  giáo viên bị xếp ở 6 cơ sở": trước đó kho giáo viên được lấy lại ở mọi cơ sở
  nên thuật toán bị bão hòa 30 tiết và phần lớn lớp không có tiết.
- Xung đột còn lại đúng bằng kịch bản khai báo trong `TIMETABLE_SCENARIOS`:
  1 `teacher_conflict`, 1 `class_conflict`, 1 `room_conflict`, 1 `quota_exceeded`;
  không có `assignment_missing` hay `campus_mismatch`.
- 14 `quota_missing`: 13 phân công học kỳ 1 được cố ý chờ xếp tiết, cộng kịch
  bản E (`missingPeriod`) khai báo trong `TIMETABLE_SCENARIOS`.
- 6 cảnh báo đa cơ sở: đến từ `can-tho-personnel-001..006` vốn đã có phân công
  nhiều cơ sở trong khối dữ liệu. Kiểm thử chứng minh mỗi cảnh báo đều có ít nhất
  hai cơ sở **không** thuộc phần sinh thêm, tức là phần sinh thêm không tự tạo ra
  tình trạng dạy liên cơ sở.
- Lịch sử và cảnh báo thời khóa biểu không còn tham chiếu tiết hoặc lớp đã bị
  thay thế.

## Giao diện

`ClassDetail` còn đúng 7 tab, được khoá bằng `TAB_KEYS` và kiểm thử cấu trúc:

1. **Tổng quan** – thông tin lớp, cơ sở, GVCN (link), phòng học, sức chứa, sĩ số
   nam/nữ, cảnh báo lớp (vượt sức chứa, thiếu GVCN, chờ tiếp nhận).
2. **Học sinh** – danh sách học sinh của lớp.
3. **Giáo viên** – GVCN và giáo viên bộ môn từ `PersonnelAssignment`, kèm số tiết
   và link hồ sơ/phân công.
4. **Thời khóa biểu** – lưới tiết của lớp, click để mở chi tiết tiết học.
5. **Tiếp nhận** – học sinh chuyển vào / chuyển khỏi lớp, trạng thái chờ duyệt.
6. **Nhu cầu** – số học sinh nội trú, hai buổi, ăn cơm, hồ sơ đã kết thúc.
7. **Hồ sơ** – lịch sử thay đổi của lớp.

`ClassList` giữ bộ lọc (năm học, cơ sở, khối, loại lớp, GVCN, trạng thái) và tìm
kiếm, đồng bộ `URLSearchParams`, có nút **Quản lý khối** mở `GradeManagerModal`.

## CRUD và chặn tham chiếu

- `useGrades`: `byId`, `bySchool`, `createGrade`, `removeGrade`, `gradeBlockers`.
  Mã khối sinh theo prefix của trường (`NK`, `CR`, `BT`, `CK`) lấy từ
  `gradeCodePrefixOf`, không lấy từ đuôi mã trường.
- `useClasses`: storage `can-tho-classes-v2`, `normalizeClass` bổ sung
  `gradeId`, `byCampus`, `createClass`, `removeClass`, `classBlockers`.
- `classDraftBlockers` chặn lớp mới khi: thiếu tên, thiếu mã, mã có khoảng
  trắng, khối không hợp lệ, thiếu cơ sở, thiếu năm học, trùng mã hoặc tên trong
  cùng trường và năm học, thiếu GVCN, GVCN không tồn tại, GVCN không hoạt
  động, GVCN khác trường, hoặc GVCN không được phân công ở cơ sở của lớp.
- `classIdOf` sinh mã lớp ổn định `can-tho-class-{school}-{year}-{code}` để lớp
  tạo mới không đè dải id mẫu.
- Xóa lớp chỉ được phép khi lớp không còn học sinh, thời khóa biểu, phân công
  giảng dạy hay biến động. Nút xóa có `Popconfirm` và trả về lý do khi bị chặn.
- Sức chứa không được nhỏ hơn sĩ số hiện tại.
- Mọi thay đổi GVCN, cập nhật, đổi trạng thái và thành lập lớp đều ghi
  `ClassHistoryEntry`.

## Kiểm thử

| File | Số test | Nội dung |
| --- | --- | --- |
| `src/classOverview.integrity.test.ts` | 22 | 151 lớp, 13 khối, GVCN và phòng hợp lệ, sĩ số theo cơ sở, mã lớp duy nhất |
| `src/classStores.rules.test.ts` | 16 | storage key, quy tắc khối, chặn xóa, `classDraftBlockers`, `classIdOf` |
| `src/classRoster.integrity.test.ts` | 11 | derive sĩ số / nhu cầu / tiếp nhận / cảnh báo, phủ hồ sơ nội trú, GVCN phủ kín 151 lớp |
| `src/personnelRole.integrity.test.ts` | 5 | nhóm nhân sự loại trừ nhau, cán bộ có môn vẫn là cán bộ, thống kê mọi trường khớp |
| `src/classModule.integrity.test.ts` | có sẵn | thêm: `id`/mã phòng duy nhất, phòng phủ mọi cơ sở có lớp, lớp nằm đúng phòng của trường/cơ sở |
| `src/classDetail.tabs.test.ts` | 4 | đúng 7 tab, không còn tab `homeroom`/`room`/`roster`/`activities`/`history` |
| `src/timetableModule.integrity.test.ts` | 11 | FK thời khóa biểu, xung đột, quota, phủ lớp, một cơ sở mỗi giáo viên |
| `src/studentModule.integrity.test.ts` | có sẵn | hồ sơ nội trú, lịch sử học sinh |

## Cổng kiểm tra

- `npm run typecheck` – sạch.
- `npx vitest run` – 14 file, 165/165 pass (sau PHASE 06: 18 file, 207/207 pass,
  thêm `src/studentRouting.test.ts`, `src/studentClassContext.integrity.test.ts`,
  `src/studentClassContext.render.test.tsx`,
  `src/studentCvTimetable.render.test.tsx`).
- `npm run lint` – 0 lỗi, 1 cảnh báo có sẵn
  (`src/components/dashboard/CrudManager/index.tsx:544:9`,
  `react-hooks/exhaustive-deps` về `confirmRemove` và `openEdit`).
- `npm run build` – OK.

## Sai lệch so với mục tiêu đã đặt

- **Số giáo viên trong phần sinh thêm: 50 (52 trên toàn lưới) so với mục tiêu
  khoảng 24.** Rút xuống 24 làm bão hòa lịch: mỗi giáo viên hết tiết trước khi
  64 lớp được phủ, và nhiều lớp không có tiết. Đã ưu tiên phủ đủ 64 lớp và giữ
  đúng 4 xung đột kịch bản. Nếu cần giảm số giáo viên thì phải nới số tiết mỗi
  giáo viên và xử lý lại kho nhân sự, việc này thuộc phase thời khóa biểu.
- **`quota_missing` là 14 và cảnh báo đa cơ sở là 6**, thay vì 13 và 8 như đếm
  ban đầu. Cả hai con số đều được giải thích trong
  `src/timetableModule.integrity.test.ts` và có khẳng định kiểm thử bảo vệ:
  14 = 13 phân công cố ý chờ tiết + 1 kịch bản E; 6 cảnh báo đều bắt nguồn từ
  phân công nhiều cơ sở có sẵn của `can-tho-personnel-001..006`.

## Ghi chú còn lại

- Bộ lọc "Học kỳ" vẫn chưa áp dụng trong `ClassList`; store `useSemesters` đã
  sẵn sàng.
- `useBoardingProfiles` chưa được trang nào dùng ngoài `ClassDetail` và kiểm
  thử.
- Id campus cũ `campus-main` vẫn được chuẩn hóa qua `CAMPUS_LEGACY_ID_MAP` khi
  hiển thị.
