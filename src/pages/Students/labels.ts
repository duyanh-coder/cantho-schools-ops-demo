export const MOVEMENT_TYPE_LABEL: Record<string, string> = {
    admitted: "Nhập học",
    class_transfer: "Chuyển lớp",
    campus_transfer: "Chuyển cơ sở",
    school_transfer: "Chuyển trường",
    drop_out: "Nghỉ học",
    withdraw: "Xin thôi học",
    graduate: "Tốt nghiệp",
};

export const movementTypeTone: Record<string, string> = {
    admitted: "green",
    class_transfer: "cyan",
    campus_transfer: "geekblue",
    school_transfer: "orange",
    drop_out: "red",
    withdraw: "volcano",
    graduate: "purple",
};

export const MOVEMENT_TYPE_TONE: Record<string, string> =
    movementTypeTone;

export const HISTORY_EVENT: Record<string, { label: string; tone: string }> = {
    created: { label: "Tạo hồ sơ", tone: "green" },
    updated: { label: "Cập nhật", tone: "blue" },
    profile_changed: { label: "Hồ sơ", tone: "cyan" },
    status_changed: { label: "Trạng thái", tone: "orange" },
    class_changed: { label: "Chuyển lớp", tone: "geekblue" },
    campus_changed: { label: "Chuyển cơ sở", tone: "purple" },
    admitted: { label: "Nhập học", tone: "green" },
    transferred: { label: "Chuyển trường", tone: "orange" },
    graduated: { label: "Tốt nghiệp", tone: "purple" },
};

export const STATUS_TONE: Record<string, string> = {
    studying: "green",
    transferred: "orange",
    dropped_out: "red",
    graduated: "blue",
    suspended: "orange",
};