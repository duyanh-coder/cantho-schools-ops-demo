# PHASE 07 — TỔNG QUAN THỜI KHÓA BIỂU (BGH)

## 1. File mã nguồn chính

| File | Vai trò |
| --- | --- |
| `src/pages/Timetable/index.tsx` | Màn hình quản trị TKB, tab **Lưới thời khóa biểu** được làm lại thành màn hình tổng quan toàn trường |
| `src/pages/Timetable/style.scss` | Style khối Tổng quan tuần (`.tt-overview*`) |
| `src/components/TimetableCalendar/overview.ts` | Selector suy ra Tổng quan tuần từ đúng pipeline dữ liệu của lưới |
| `src/components/TimetableCalendar/index.tsx` | Component dùng chung: legend, mode `overview`/`student` |
| `src/components/TimetableCalendar/types.ts` | Mode mới, `dayOfWeek`, props Năm học/Ngày/Legend, `model.legend` |
| `src/components/TimetableCalendar/helpers.ts` | Lọc theo ngày, truyền `dayOfWeek` qua scope |
| `src/components/TimetableCalendar/TimetableCalendarFilters.tsx` | Select Năm học và Ngày |
| `src/components/TimetableCalendar/useTimetableCalendar.ts` | Cột ngày theo filter + suy ra legend môn |
| `src/components/TimetableCalendar/TimetableEventDetail.tsx` | Tách Ngày/Tiết/Buổi/Giờ học |
| `src/components/TimetableCalendar/links.ts` | Link Phòng (dẫn campus) và ẩn link lớp ở mode `student` |
| `src/components/TimetableCalendar/style.scss` | Style `.tt-cal__legend*` |
| `src/pages/Students/StudentDetail.tsx` | Chuyển sang `mode="student"`, sửa placeholder tên cơ sở |

## 2. Component lịch dùng chung

- **Không** tạo component lịch thứ hai. Trang quản trị render đúng `<TimetableCalendar>` với `mode="overview"`.
- `TimetableCalendarMode` nay gồm `overview | school | campus | grade | class | student | teacher | room`; `"school"` giữ lại để không phá context cũ.
- `mode="overview"` và `mode="student"` là alias hành vi:
  - `overview`: hiện Phòng, không khoá lớp mặc định.
  - `student`: tự gán `classId` mặc định, ẩn bộ lọc Lớp và ẩn link Lớp trong drawer (vì học sinh không điều hướng tới trang Lớp).
- Không thêm toggle Week/Day theo quyết định của người dùng; chỉ thêm **filter Ngày**.

## 3. Store / tiện ích dùng lại

- Nguồn dữ liệu: `useTimetables({ academicYearId, semesterId, campusId })` → `.effective`.
- Năm học: `useAcademicYears(SCHOOL_ID).activeYear` / `.items`.
- Học kỳ: `useSemesters(academicYearId).byAcademicYear`.
- Lookups: `buildLookups(subjects, classes, personnel, campuses, rooms)` — dùng chung với các tab còn lại.
- Định mức: `usePersonnelAssignments` **bám theo học kỳ đang xem** (`semester: 1 | 2` suy từ mã học kỳ) thay vì hard-code HK1.
- `ACADEMIC_YEAR_ID` đã bị gỡ khỏi trang; test chốt lại việc này.
- `summarizeTimetableWeek()` chỉ đọc `applyCalendarFilters` + `toTimetableEvents`, không tạo nguồn số liệu thứ hai.

## 4. Bộ lọc

| Bộ lọc | Vị trí | Ghi chú |
| --- | --- | --- |
| Năm học | Đầu trang | Chọn đổi sẽ nạp lại danh sách học kỳ tương ứng |
| Học kỳ | Đầu trang | Nguồn theo năm học đang chọn |
| Phân hiệu | Đầu trang | Mặc định "Tất cả phân hiệu" |
| Ngày | `TimetableCalendarFilters` | Lọc cả cột ngày lẫn sự kiện |
| Tuần | `TimetableCalendar` | Mặc định tuần hiện tại của học kỳ |
| Khối / Lớp / GV / Môn / Phòng / Buổi | `TimetableCalendarFilters` | `showSubjectFilter`, `showRoom`, `scopeOptionsToEntries` |
| Đặt lại bộ lọc | Đầu trang | Xóa phân hiệu, filter lưới, tuần, học kỳ |

## 5. Điều hướng & chi tiết

- `onNavigate` được bật: Lớp → `/operations/classes/:id`, GV → `/operations/personnel/:id`, Cơ sở/Phòng → `/operations/campuses/:campusId`.
- Drawer chi tiết dùng lại `TimetableEventDetail`, tách rõ Ngày, Tiết, Buổi, Tuần, Môn, Lớp, Khối, GV, Cơ sở, Phòng, trạng thái.
- Không có route Phòng riêng nên link Phòng dẫn tới chi tiết phân hiệu; đã ghi rõ trong báo cáo này.
- `CellDrawer` vẫn được giữ nguyên cho luồng kiểm tra xung đột (tab 2). Click trên lưới **không** mở `CellDrawer`.

## 6. Nhất quán dữ liệu

- Tổng quan tuần và lưới dùng chung `scopedCalendarFilters` + `activeWeek`, nên số liệu luôn khớp tiết đang hiển thị.
- Kiểm thử `src/timetableContextConsistency.test.ts` chốt:
  - `summary.totalLessons === events.length` cho cùng bộ lọc.
  - Lọc phân hiệu/ngày chỉ làm tổng tiết **giảm**.
  - Số lớp/GV/phòng không bao giờ vượt tổng tiết.
  - Trang dùng `useTimetables` + `useAcademicYears` + `useSemesters` và không còn `ACADEMIC_YEAR_ID`.
  - Không xuất hiện `TimetableCalendar2`.

## 7. Kiểm thử

- `src/timetableOverview.render.test.tsx` (mới, 5 test): giữ đủ 5 tab, có Tổng quan tuần, giữ KPI định mức cũ, có Năm học/Học kỳ/Phân hiệu + nút đặt lại, không lộ tên cũ.
- `src/timetableContextConsistency.test.ts` (mới, 6 test): nhất quán số liệu như mục 6.
- Cập nhật `src/studentRouting.test.ts`: khẳng định `mode="student"` thay cho `mode="class"`.
- `src/studentCvTimetable.render.test.tsx` và `src/components/TimetableCalendar/timetableCalendar.test.ts` chạy lại để chống hồi quy.

## 8. Kiểm tra tự động

| Cổng | Kết quả |
| --- | --- |
| `npx vitest run` | 20 file, **218/218 pass** |
| `npm run typecheck` | Pass, 0 lỗi |
| `npm run lint` | 0 lỗi, 1 warning cũ |
| `npm run build` | Pass (`✓ built`) |

Warning còn lại là của phase trước, không thuộc Phase 07:
`src/components/dashboard/CrudManager/index.tsx:544:9 react-hooks/exhaustive-deps`.

Build vẫn in cảnh báo chunk > 500 kB (đã có từ trước, `index.js` ~2.2 MB → gzip ~646 kB).

## 9. Checklist kiểm tra thủ công

- [ ] `/operations/timetable` mở mặc định vào tab **Lưới thời khóa biểu**.
- [ ] Tiêu đề hiện `Trường THCS Ninh Kiều` và `Tuần N · Học kỳ ... năm học ...`.
- [ ] Năm học → học kỳ nạp lại đúng danh sách học kỳ của năm đó.
- [ ] Bộ lọc Ngày ẩn/hiện đúng cột ngày tương ứng.
- [ ] Chọn tuần trước / hiện tại / sau hoạt động; nhãn tuần cập nhật.
- [ ] Tổng quan tuần đổi số khi đổi phân hiệu / ngày / lớp / GV / môn / phòng.
- [ ] Click một tiết mở drawer chi tiết đầy đủ, các link Lớp/GV/Cơ sở/Phòng điều hướng đúng.
- [ ] Nút **Đặt lại bộ lọc** trả về tuần hiện tại + tất cả phân hiệu.
- [ ] Legend môn hiển thị và tô màu khớp khối tiết trong lưới.
- [ ] 5 tab còn lại (xung đột, phân công, phiên bản, phòng) không đổi hành vi.
- [ ] Tab lịch của học sinh vẫn lọc theo lớp, không có nút chọn Lớp.
- [ ] Kiểm tra responsive ở 1366px và 768px.
- [ ] Xác nhận không hiển thị "Đoàn Thị Điểm" làm tên cơ sở hiện tại.

## 10. Điểm còn lại / ngoài phạm vi

- Chưa chạy kiểm tra thị giác trên trình duyệt thật (mục 9 cần người dùng xác nhận).
- Chưa có route chi tiết Phòng; link Phòng tạm dẫn campus detail.
- Năm học cũ (`2025-2026`) không có dữ liệu TKB mẫu nên lưới sẽ trống — đúng dữ liệu, không phải lỗi.
- Không đưa các tính năng phát sinh (đổi tiết trực tiếp trên lưới, duyệt xuất bản, tối ưu tự động) vào phase này.