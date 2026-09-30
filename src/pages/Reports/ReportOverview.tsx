import {
    BarList,
    ChartCard,
    ColumnChart,
    DonutChart,
    StackedBars,
} from "@/components/dashboard/Charts/Charts";

import type {
    ChartSeries,
} from "@/components/dashboard/Charts";

import type {
    ReportOverview as ReportOverviewModel,
} from "@/pages/Reports/reportStats";

import {
    TeamOutlined,
    ReadOutlined,
    SolutionOutlined,
    BankOutlined,
    HomeOutlined,
    ApartmentOutlined,
} from "@ant-design/icons";

import StatsCard from "@/components/dashboard/StatCard";

import "./overview.scss";


const fmt = (value: number): string => value.toLocaleString("vi-VN");


const DEMAND_SERIES: ChartSeries[] = [
    { key: "twoSessionCount", label: "Học hai buổi", color: "#0891b2" },
    { key: "boardingCount", label: "Nội trú", color: "#2563eb" },
    { key: "mealCount", label: "Cần suất ăn", color: "#f59e0b" },
];


export interface ReportOverviewProps {
    overview: ReportOverviewModel;
}


/**
 * Bảng điều khiển báo cáo quản trị cho ban giám hiệu.
 *
 * Toàn bộ số liệu do `reportStats` tính sẵn nên phần hiển thị chỉ lo
 * bố trí, không tự tính lại.
 */
export default function ReportOverview({
    overview,
}: ReportOverviewProps) {
    const {
        totals,
        campusRows,
        gradeRows,
        personnelGroups,
        classStatusRows,
        roomConditionRows,
        enrolmentRows,
        trendNote,
    } = overview;

    const demandByCampus = new Map(
        campusRows.map((row) => [
            row.name,
            new Map<string, number>([
                ["twoSessionCount", row.twoSessionCount],
                ["boardingCount", row.boardingCount],
                ["mealCount", row.mealCount],
            ]),
        ]),
    );

    const increaseColumns = enrolmentRows.map((row) => ({
        label: row.label,
        value: row.increase,
        color: "#0d9488",
    }));

    const decreaseColumns = enrolmentRows.map((row) => ({
        label: row.label,
        value: row.decrease,
        color: "#f97316",
    }));

    return (
        <div className="report-overview">
            <div className="page-kpi">
                <StatsCard
                    tone="blue"
                    title="Học sinh"
                    value={fmt(totals.studentCount)}
                    note={`${fmt(totals.maleCount)} nam · ${fmt(totals.femaleCount)} nữ`}
                    icon={<ReadOutlined />}
                />

                <StatsCard
                    tone="green"
                    title="Lớp học"
                    value={fmt(totals.classCount)}
                    note={`TB ${totals.avgStudentsPerClass} HS/lớp`}
                    icon={<SolutionOutlined />}
                />

                <StatsCard
                    tone="purple"
                    title="Nhân sự"
                    value={fmt(totals.staffCount)}
                    note="Cộng tác viên tại các cơ sở"
                    icon={<TeamOutlined />}
                />

                <StatsCard
                    tone="orange"
                    title="Phòng học"
                    value={fmt(totals.classroomCount)}
                    note={`${fmt(totals.functionRoomCount)} phòng chức năng`}
                    icon={<BankOutlined />}
                />

                <StatsCard
                    tone="blue"
                    title="Nội trú"
                    value={fmt(totals.boardingCount)}
                    note={`${totals.boardingRate}% học sinh nội trú`}
                    icon={<HomeOutlined />}
                />

                <StatsCard
                    tone="green"
                    title="Cơ sở"
                    value={fmt(totals.campusCount)}
                    note="Trụ sở chính và phân hiệu"
                    icon={<ApartmentOutlined />}
                />
            </div>

            <div className="report-overview__grid">
                <ChartCard
                    title="Học sinh theo khối"
                    note="Số học sinh đang học của từng khối"
                >
                    <ColumnChart
                        data={gradeRows.map((row) => ({
                            label: row.label,
                            value: row.studentCount,
                        }))}
                    />
                </ChartCard>

                <ChartCard
                    title="Quy mô học sinh theo cơ sở"
                    note="So sánh giữa trụ sở chính và các phân hiệu"
                    extra={trendNote}
                >
                    <BarList
                        data={[...campusRows]
                            .sort((a, b) => b.studentCount - a.studentCount)
                            .map((row) => ({
                                label: row.code,
                                value: row.studentCount,
                            }))}
                        unit=" HS"
                    />
                </ChartCard>

                <ChartCard
                    title="Nhu cầu học sinh theo cơ sở"
                    note="Học hai buổi, nội trú và nhu cầu suất ăn"
                >
                    <StackedBars
                        rows={[...campusRows]
                            .sort((a, b) => a.code.localeCompare(b.code))
                            .map((row) => ({ label: row.name }))}
                        series={DEMAND_SERIES}
                        valuesByKey={demandByCampus}
                        unit=" HS"
                    />
                </ChartCard>

                <ChartCard
                    title="Cơ cấu nhân sự"
                    note="Phân theo nhóm chức danh"
                >
                    <DonutChart
                        data={personnelGroups.map((row) => ({
                            label: row.label,
                            value: row.count,
                        }))}
                        centerLabel="cán bộ"
                    />
                </ChartCard>

                <ChartCard
                    title="Biến động tăng học sinh"
                    note="Tổng số học sinh tăng theo ngày hiệu lực"
                >
                    <ColumnChart
                        data={increaseColumns}
                        emptyText="Chưa có biến động nhập học trong năm học đã chọn"
                    />
                </ChartCard>

                <ChartCard
                    title="Biến động giảm học sinh"
                    note="Số học sinh rời đi theo ngày hiệu lực"
                >
                    <ColumnChart
                        data={decreaseColumns}
                        emptyText="Chưa có biến động rời trường trong năm học đã chọn"
                    />
                </ChartCard>

                <ChartCard
                    title="Trạng thái lớp học"
                    note="Phân bổ lớp theo trạng thái"
                >
                    <DonutChart
                        data={classStatusRows.map((row) => ({
                            label: row.label,
                            value: row.count,
                        }))}
                        centerLabel="lớp"
                    />
                </ChartCard>

                <ChartCard
                    title="Tình trạng phòng học"
                    note="Theo kết quả kiểm tra cơ sở vật chất"
                >
                    <DonutChart
                        data={roomConditionRows.map((row) => ({
                            label: row.label,
                            value: row.count,
                        }))}
                        centerLabel="phòng"
                    />
                </ChartCard>
            </div>

            <ChartCard
                title="Bảng tổng hợp theo cơ sở"
                note="Dùng để đối chiếu với báo cáo gửi phòng, sở"
            >
                <div className="report-overview__table">
                    <table>
                        <thead>
                            <tr>
                                <th>Mã cơ sở</th>
                                <th>Tên cơ sở</th>
                                <th>Loại</th>
                                <th>Lớp</th>
                                <th>Học sinh</th>
                                <th>TB/lớp</th>
                                <th>Phòng học</th>
                                <th>Nhân sự</th>
                                <th>Hai buổi</th>
                                <th>Nội trú</th>
                                <th>Suất ăn</th>
                            </tr>
                        </thead>

                        <tbody>
                            {campusRows.map((row) => (
                                <tr key={row.campusId}>
                                    <td>{row.code}</td>
                                    <td>{row.name}</td>
                                    <td>{row.campusType}</td>
                                    <td>{fmt(row.classCount)}</td>
                                    <td>{fmt(row.studentCount)}</td>
                                    <td>{row.avgStudentsPerClass}</td>
                                    <td>{fmt(row.classroomCount)}</td>
                                    <td>{fmt(row.personnelCount)}</td>
                                    <td>{fmt(row.twoSessionCount)}</td>
                                    <td>{fmt(row.boardingCount)}</td>
                                    <td>{fmt(row.mealCount)}</td>
                                </tr>
                            ))}

                            {campusRows.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={11}
                                        className="report-overview__blank"
                                    >
                                        Chưa có dữ liệu cho bộ lọc hiện tại
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </ChartCard>
        </div>
    );
}