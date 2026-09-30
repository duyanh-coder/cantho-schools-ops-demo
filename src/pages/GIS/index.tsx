import {
  AimOutlined,
  AppstoreOutlined,
  ArrowLeftOutlined,
  BankOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  FilterOutlined,
  GlobalOutlined,
  HomeOutlined,
  LineChartOutlined,
  ReloadOutlined,
  ShopOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import {
  Button,
  Card,
  Col,
  Empty,
  Row,
  Select,
  Tag,
} from "antd";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import type { LatLngBoundsExpression } from "leaflet";

import L from "leaflet";

import {
  Marker,
  MapContainer,
  Polygon,
  Popup,
  ScaleControl,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";

import { renderToStaticMarkup } from "react-dom/server";

import "leaflet/dist/leaflet.css";

import StatsCard from "@/components/dashboard/StatCard";

import {
  canThoMockData,
  getCurrentRegionMockData,
} from "@/mock";

import { canThoRooms } from "@/mock/canTho";

import type {
  Campus,
  CampusType,
  Ward,
} from "@/mock/common/types";

import type {
  GisWard,
} from "@/mock";

import {
  buildCampusDetail,
  campusDetailFields,
  CAMPUS_TYPE_LABELS,
} from "@/utils/campusDetail";

import "./style.scss";

/* ========================================
   AUTO FIT MAP
======================================== */

interface FocusMapProps {
  bounds: LatLngBoundsExpression | null;
}

function FocusMap({ bounds }: FocusMapProps) {
  const map = useMap();

  useEffect(() => {
    if (!bounds) {
      return;
    }

    map.fitBounds(bounds, {
      padding: [30, 30],
      maxZoom: 16,
    });
  }, [map, bounds]);

  return null;
}

/* ========================================
   CAMPUS MARKER ICON
======================================== */

function createCampusIcon(
  isMainCampus: boolean,
  isSelected = false,
) {
  const glyph = renderToStaticMarkup(<BankOutlined />);

  const className = [
    "gis-campus-marker",

    isMainCampus ? "gis-campus-marker--main" : "gis-campus-marker--sub",

    isSelected ? "gis-campus-marker--selected" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return L.divIcon({
    className,
    html: `
      <div class="gis-campus-marker__pin gis-campus-marker__pin--${isMainCampus ? "main" : "sub"}">
        ${glyph}
      </div>
    `,
    iconSize: [30, 37],
    iconAnchor: [15, 37],
    popupAnchor: [0, -34],
  });
}

/* ========================================
   CAMPUS ENTITY LOOKUP (single source)
======================================== */

const campusEntityById = new Map<string, Campus>(
  canThoMockData.campuses.map(
    (campus) => [campus.id, campus] as [string, Campus],
  ),
);

/** Phường/xã nghiệp vụ, khác với đơn vị hành chính vẽ trên bản đồ. */
const businessWardById = new Map<string, Ward>(
  canThoMockData.wards.map((ward) => [ward.id, ward] as [string, Ward]),
);

const CAMPUS_TYPE_OPTIONS: Array<{ value: CampusType; label: string }> = [
  { value: "HEADQUARTERS", label: CAMPUS_TYPE_LABELS.HEADQUARTERS },
  { value: "BRANCH", label: CAMPUS_TYPE_LABELS.BRANCH },
];

const hasValidCoordinates = (
  campus: Campus | GisWard,
): boolean => {
  if ("latitude" in campus && "longitude" in campus) {
    return (
      Number.isFinite(campus.latitude) &&
      Number.isFinite(campus.longitude)
    );
  }

  return false;
};

/* ========================================
   PAGE
======================================== */

function GisPage() {
  const navigation = useNavigate();

  const { gis } = getCurrentRegionMockData();

  const { province, wards, campuses } = gis;

  const [searchParams] = useSearchParams();

  const presetCampusId = searchParams.get("campus");

  const presetCampus = useMemo(
    () => campuses.find((campus) => campus.id === presetCampusId) ?? null,
    [campuses, presetCampusId],
  );

  const presetCampusMissing = useMemo(
    () => presetCampusId !== null && presetCampus === null,
    [presetCampus, presetCampusId],
  );

  const markerRefs = useRef<Record<string, L.Marker | null>>({});

  const DEFAULT_WARD_ID = "can-tho-31135";

  const defaultWard = useMemo(
    () => wards.find((ward) => ward.id === DEFAULT_WARD_ID) ?? null,
    [wards],
  );

  const [selectedWardId, setSelectedWardId] = useState(
    presetCampus?.wardId ?? DEFAULT_WARD_ID,
  );

  const [selectedCampusId, setSelectedCampusId] = useState<string>(
    presetCampus ? presetCampus.id : "all",
  );

  /**
   * Ba bộ lọc nghiệp vụ: trường, loại cơ sở và phường/xã trong hồ sơ.
   *
   * Chúng tác động lên danh sách marker, còn `selectedWardId` chỉ điều
   * khiển vùng bản đồ để tránh lẫn hai loại địa bàn.
   */
  const [selectedSchoolId, setSelectedSchoolId] = useState("all");

  const [selectedCampusType, setSelectedCampusType] =
    useState<CampusType | "all">("all");

  const [selectedBusinessWardId, setSelectedBusinessWardId] = useState("all");

  const [mapBounds, setMapBounds] = useState<LatLngBoundsExpression | null>(
    () => {
      if (presetCampus) {
        return L.latLngBounds([
          [presetCampus.position[0], presetCampus.position[1]],
        ]);
      }

      if (defaultWard) {
        return L.latLngBounds(defaultWard.polygon.flat(2));
      }

      return L.latLngBounds(province.polygons.flat(2));
    },
  );

  /* ========================================
       SELECTED WARD
    ======================================== */

  const selectedWard = useMemo<GisWard | null>(() => {
    if (selectedWardId === "all") {
      return null;
    }

    return wards.find((ward) => ward.id === selectedWardId) ?? null;
  }, [wards, selectedWardId]);

  /* ========================================
       FILTER CAMPUSES
    ======================================== */

  const filteredCampuses = useMemo(() => {
    return campuses.filter((campus) => {
      const matchWard =
        selectedWardId === "all" || campus.wardId === selectedWardId;

      const matchCampus =
        selectedCampusId === "all" || campus.id === selectedCampusId;

      const campusEntity = campusEntityById.get(campus.id);

      const matchSchool =
        selectedSchoolId === "all" || campus.schoolId === selectedSchoolId;

      const matchType =
        selectedCampusType === "all" ||
        campusEntity?.type === selectedCampusType;

      const matchBusinessWard =
        selectedBusinessWardId === "all" ||
        campusEntity?.wardId === selectedBusinessWardId;

      return matchWard
        && matchCampus
        && matchSchool
        && matchType
        && matchBusinessWard;
    });
  }, [
    campuses,
    selectedWardId,
    selectedCampusId,
    selectedSchoolId,
    selectedCampusType,
    selectedBusinessWardId,
  ]);

  const selectedCampus = useMemo(() => {
    if (selectedCampusId === "all") {
      return null;
    }

    return campuses.find((campus) => campus.id === selectedCampusId) ?? null;
  }, [campuses, selectedCampusId]);

  /* ========================================
       AUTO OPEN POPUP FOR PRESET CAMPUS
  ======================================== */

  useEffect(() => {
    if (!presetCampusId) {
      return;
    }

    const marker = markerRefs.current[presetCampusId];

    if (marker) {
      marker.openPopup();
    }
  }, [presetCampusId, filteredCampuses]);

  const campusesInWard = useMemo(() => {
    if (!selectedWard) {
      return [];
    }

    return campuses.filter((campus) => campus.wardId === selectedWard.id);
  }, [campuses, selectedWard]);

  const filteredSchoolCount = useMemo(() => {
    return new Set(filteredCampuses.map((campus) => campus.schoolId)).size;
  }, [filteredCampuses]);

  /* ========================================
       BUSINESS WARD STATISTICS
     ======================================== */

  const businessWardStats = useMemo(() => {
    const scoped = campuses.filter((campus) => {
      const campusEntity = campusEntityById.get(campus.id);

      const matchSchool =
        selectedSchoolId === "all" || campus.schoolId === selectedSchoolId;

      const matchType =
        selectedCampusType === "all" ||
        campusEntity?.type === selectedCampusType;

      return matchSchool && matchType;
    });

    return canThoMockData.wards
      .map((ward) => {
        const campusEntities = scoped
          .filter((campus) => campusEntityById.get(campus.id)?.wardId === ward.id)
          .map((campus) => campusEntityById.get(campus.id))
          .filter((entity): entity is Campus => Boolean(entity));

        const campusIds = new Set(campusEntities.map((campus) => campus.id));

        const classIds = new Set(
          canThoMockData.classes
            .filter((item) => campusIds.has(item.campusId))
            .map((item) => item.id),
        );

        return {
          ward,

          campusCount: campusEntities.length,

          schoolCount: new Set(
            campusEntities.map((campus) => campus.schoolId),
          ).size,

          classCount: classIds.size,

          studentCount: canThoMockData.students.filter((student) =>
            student.classId !== undefined && classIds.has(student.classId),
          ).length,

          personnelCount: new Set(
            canThoMockData.personnel
              .filter((person) =>
                person.campusIds.some((id) => campusIds.has(id)))
              .map((person) => person.id),
          ).size,
        };
      })
      .filter((row) => row.campusCount > 0 || row.ward.id === selectedBusinessWardId)
      .sort((a, b) => b.campusCount - a.campusCount
        || b.studentCount - a.studentCount
        || a.ward.name.localeCompare(b.ward.name, "vi-VN"));
  }, [
    campuses,
    selectedSchoolId,
    selectedCampusType,
    selectedBusinessWardId,
  ]);

  const selectedBusinessWardStat = useMemo(() => {
    return businessWardStats.find(
      (row) => row.ward.id === selectedBusinessWardId,
    ) ?? null;
  }, [businessWardStats, selectedBusinessWardId]);

  /* ========================================
       SELECTED CAMPUS DETAIL (16 fields)
     ======================================== */

  const selectedCampusDetail = useMemo(() => {
    if (!selectedCampus) {
      return null;
    }

    const campusEntity = campusEntityById.get(selectedCampus.id);

    if (!campusEntity) {
      return null;
    }

    const classes = canThoMockData.classes.filter(
      (item) => item.campusId === campusEntity.id,
    );

    const rooms = canThoRooms.filter(
      (room) => room.campusId === campusEntity.id,
    );

    const detail = buildCampusDetail({
      campus: campusEntity,

      school: canThoMockData.schools.find(
        (school) => school.id === campusEntity.schoolId,
      ),

      ward: businessWardById.get(campusEntity.wardId),

      classes,

      rooms,

      personnel: canThoMockData.personnel,

      students: canThoMockData.students,
    });

    return { detail, fields: campusDetailFields(detail) };
  }, [selectedCampus]);

  /* ========================================
       HANDLERS
    ======================================== */

  const handleWardSelect = (wardId: string) => {
    setSelectedWardId(wardId);

    setSelectedCampusId("all");

    if (wardId === "all") {
      setMapBounds(L.latLngBounds(province.polygons.flat(2)));

      return;
    }

    const ward = wards.find((item) => item.id === wardId);

    if (ward) {
      setMapBounds(L.latLngBounds(ward.polygon.flat(2)));
    }
  };

  const handleWardClick = (wardId: string) => {
    setSelectedWardId(wardId);

    setSelectedCampusId("all");

    const ward = wards.find((item) => item.id === wardId);

    if (ward) {
      setMapBounds(L.latLngBounds(ward.polygon.flat(2)));
    }
  };

  const handleCampusSelect = (campusId: string) => {
    setSelectedCampusId(campusId);

    if (campusId === "all") {
      setMapBounds(L.latLngBounds(province.polygons.flat(2)));

      return;
    }

    const campus = campuses.find((item) => item.id === campusId);

    if (campus) {
      setSelectedWardId(campus.wardId);

      setMapBounds(L.latLngBounds([[campus.position[0], campus.position[1]]]));
    }
  };

  const handleReset = () => {
    setSelectedWardId(DEFAULT_WARD_ID);

    setSelectedCampusId("all");

    setSelectedSchoolId("all");

    setSelectedCampusType("all");

    setSelectedBusinessWardId("all");

    setMapBounds(
      defaultWard
        ? L.latLngBounds(defaultWard.polygon.flat(2))
        : L.latLngBounds(province.polygons.flat(2)),
    );
  };

  return (
<div className="gis-page">
      <header className="page-head">
        <div className="page-head__title">
          <span className="page-head__eyebrow">GIS</span>

          <h2>Bản đồ GIS</h2>

          <p>Trực quan hóa địa bàn, trường học và các cơ sở giáo dục.</p>
        </div>

        <div className="page-head__meta">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() =>
              navigation("/operations/schools?tab=campuses")}
          >
            Quay lại danh sách
          </Button>
        </div>
      </header>

      <div className="page-kpi">
        <StatsCard
          tone="blue"
          title="Đơn vị hành chính"
          value={wards.length}
          note="Xã/phường trên bản đồ"
          icon={<AimOutlined />}
        />

        <StatsCard
          tone="green"
          title="Diện tích (km²)"
          value={province.areaKm2.toLocaleString("vi-VN", {
            maximumFractionDigits: 2,
          })}
          icon={<LineChartOutlined />}
        />

        <StatsCard
          tone="orange"
          title="Cơ sở giáo dục"
          value={campuses.length}
          icon={<HomeOutlined />}
        />

        <StatsCard
          tone="purple"
          title="Đang hiển thị"
          value={filteredCampuses.length}
          note="Cơ sở khớp bộ lọc"
          icon={<EyeOutlined />}
        />
      </div>

      {/* ========================================
               MAIN CONTENT
            ======================================== */}

      <Row gutter={[16, 16]}>
        {/* MAP */}

        <Col xs={24} xl={17} className="gis-map-col">
          <Card className="gis-map-card">
            <div className="gis-map-card__toolbar">
              <div>
                <GlobalOutlined />

                <span>Bản đồ GIS cơ sở giáo dục</span>
              </div>

              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                Đặt lại
              </Button>
            </div>

            <div className="gis-map">
              <MapContainer
                center={[9.9, 105.6]}
                zoom={10}
                className="gis-map__leaflet"
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors — tiles by <a href="https://tile.openstreetmap.de">openstreetmap.de</a>'
                  url="https://tile.openstreetmap.de/{z}/{x}/{y}.png"
                  maxZoom={18}
                />

                <ScaleControl imperial={false} />

                <FocusMap bounds={mapBounds} />

                {/* ========================================
                    PROVINCE OUTLINE
                ======================================== */}

                <Polygon
                  positions={province.polygons}
                  interactive={false}
                  pathOptions={{
                    color:
                      selectedWardId === "all" ? "#64748b" : "transparent",

                    weight: selectedWardId === "all" ? 2 : 0.5,

                    fillColor: "#e2e8f0",

                    fillOpacity: 0.06,
                  }}
                >
                  {selectedWardId === "all" && (
                    <Tooltip
                      permanent
                      interactive={false}
                      direction="center"
                      className="gis-province-tooltip"
                    >
                      TP. Cần Thơ
                    </Tooltip>
                  )}
                </Polygon>

                {/* ========================================
                    WARD POLYGONS
                ======================================== */}

                {wards.map((ward) => {
                  const isSelected = selectedWardId === ward.id;

                  return (
                    <Polygon
                      key={ward.id}
                      positions={ward.polygon}
                      pathOptions={{
                        color: isSelected ? "#2563eb" : "#0e7490",

                        weight: isSelected ? 2.6 : 1.4,

                        fillColor: isSelected ? "#60a5fa" : "#22d3ee",

                        fillOpacity: isSelected ? 0.34 : 0.16,
                      }}
                      eventHandlers={{
                        click: (event) => {
                          (event.target as L.Polygon).setStyle({
                            color: "#2563eb",

                            weight: 2.6,

                            fillColor: "#60a5fa",

                            fillOpacity: 0.34,
                          });

                          handleWardClick(ward.id);
                        },

                        mouseover: (event) => {
                          if (isSelected) {
                            return;
                          }

                          (event.target as L.Polygon).setStyle({
                            color: "#3b82f6",

                            weight: 1.8,

                            fillOpacity: 0.24,
                          });
                        },

                        mouseout: (event) => {
                          if (isSelected) {
                            return;
                          }

                          (event.target as L.Polygon).setStyle({
                            color: "#0e7490",

                            weight: 1.4,

                            fillOpacity: 0.16,
                          });
                        },
                      }}
                    >
                      <Tooltip className="gis-ward-tooltip">
                        {ward.name}
                      </Tooltip>

                      <Popup>
                        <div className="gis-popup">
                          <strong>{ward.name}</strong>

                          <span>
                            Diện tích:{" "}
                            {ward.areaKm2.toLocaleString("vi-VN")} km²
                          </span>
                        </div>
                      </Popup>
                    </Polygon>
                  );
                })}

                {/* ========================================
                    CAMPUS MARKERS
                ======================================== */}

                {filteredCampuses.map((campus) => {
                  const campusEntity = campusEntityById.get(campus.id);

                  if (!campusEntity || !hasValidCoordinates(campusEntity)) {
                    return null;
                  }

                  const isSelected = campus.id === selectedCampusId;

                  return (
                    <Marker
                      key={campus.id}
                      position={campus.position}
                      icon={createCampusIcon(campus.isMainCampus, isSelected)}
                      ref={(marker) => {
                        markerRefs.current[campus.id] = marker;
                      }}
                      eventHandlers={{
                        click: () => handleCampusSelect(campus.id),
                      }}
                    >
                      <Popup>
                        <div className="gis-popup">
                          <strong>{campus.name}</strong>

                          <span className="gis-popup__tag">
                            {CAMPUS_TYPE_LABELS[campusEntity.type]}
                          </span>

                          <p>{campus.address}</p>

                          {campusEntity.phone && (
                            <p className="gis-popup__phone">
                              ☎ {campusEntity.phone}
                            </p>
                          )}

                          <div className="gis-popup__actions">
                            <Button
                              type="primary"
                              size="small"
                              icon={<EyeOutlined />}
                              onClick={() =>
                                navigation(`/operations/campuses/${campus.id}`)}
                            >
                              Chi tiết
                            </Button>

                            <Button
                              size="small"
                              onClick={() =>
                                markerRefs.current[campus.id]?.closePopup()}
                            >
                              Đóng
                            </Button>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>

              {/* LEGEND */}

              <div className="gis-map__legend">
                <div>
                  <span className="gis-map__legend-ward" />
                  Ranh giới xã / phường
                </div>

                <div>
                  <span className="gis-map__legend-campus gis-map__legend-campus--main" />
                  Trụ sở chính
                </div>

                <div>
                  <span className="gis-map__legend-campus gis-map__legend-campus--sub" />
                  Phân hiệu
                </div>
              </div>

              {/* CONTEXT BANNER (overview only) */}

              {!selectedWard && !presetCampusMissing && (
                <div className="gis-map__context">
                  <AimOutlined />

                  <span>
                    TP. Cần Thơ · {wards.length} xã/phường ·{" "}
                    {province.areaKm2.toLocaleString("vi-VN", {
                      maximumFractionDigits: 2,
                    })}{" "}
                    km²
                  </span>
                </div>
              )}

              {/* MISSING CAMPUS BANNER */}

              {presetCampusMissing && (
                <div className="gis-map__error-banner gis-map__error-banner--center">
                  <div>
                    <strong>Không tìm thấy cơ sở.</strong>

                    <span>Cơ sở được yêu cầu không tồn tại trong hệ thống.</span>
                  </div>

                  <Button
                    size="small"
                    onClick={() =>
                      navigation("/operations/schools?tab=campuses")}
                  >
                    Quay lại danh sách
                  </Button>
                </div>
              )}

              {/* MISSING COORDINATES BANNER */}

              {!presetCampusMissing &&
                selectedCampus &&
                (() => {
                  const entity = campusEntityById.get(selectedCampus.id);

                  return entity ? !hasValidCoordinates(entity) : false;
                })() && (
                  <div className="gis-map__error-banner gis-map__error-banner--top">
                    <div>
                      <strong>
                        Chưa có tọa độ GIS cho cơ sở này.
                      </strong>

                      <span>
                        Vui lòng cập nhật tọa độ để hiển thị trên bản đồ.
                      </span>
                    </div>

                    <Button
                      size="small"
                      onClick={() =>
                        navigation(`/operations/campuses/${selectedCampus.id}`)}
                    >
                      Cập nhật tọa độ
                    </Button>
                  </div>
                )}
            </div>
          </Card>
        </Col>

        {/* SIDEBAR */}

        <Col xs={24} xl={7}>
          <div className="gis-sidebar">
            {/* FILTER */}

            <Card className="gis-filter-card">
              <div className="gis-sidebar__title">
                <FilterOutlined />

                <span>Bộ lọc bản đồ</span>
              </div>

              <div className="gis-filter-card__field">
                <label>
                  <ShopOutlined /> Trường
                </label>

                <Select
                  value={selectedSchoolId}
                  onChange={(value) => {
                    setSelectedSchoolId(value);

                    setSelectedCampusId("all");
                  }}
                  className="gis-select"
                  showSearch
                  optionFilterProp="label"
                  options={[
                    { value: "all", label: "Tất cả trường" },

                    ...canThoMockData.schools.map((school) => ({
                      value: school.id,
                      label: school.name,
                    })),
                  ]}
                />
              </div>

              <div className="gis-filter-card__field">
                <label>
                  <AppstoreOutlined /> Loại cơ sở
                </label>

                <Select
                  value={selectedCampusType}
                  onChange={setSelectedCampusType}
                  className="gis-select"
                  options={[
                    { value: "all", label: "Tất cả loại" },

                    ...CAMPUS_TYPE_OPTIONS,
                  ]}
                />
              </div>

              <div className="gis-filter-card__field">
                <label>
                  <EnvironmentOutlined /> Phường / Xã hồ sơ
                </label>

                <Select
                  value={selectedBusinessWardId}
                  onChange={setSelectedBusinessWardId}
                  className="gis-select"
                  showSearch
                  optionFilterProp="label"
                  options={[
                    { value: "all", label: "Tất cả phường / xã" },

                    ...canThoMockData.wards.map((ward) => ({
                      value: ward.id,
                      label: ward.name,
                    })),
                  ]}
                />
              </div>

              <div className="gis-filter-card__field">
                <label>Xã / Phường trên bản đồ</label>

                <Select
                  value={selectedWardId}
                  onChange={handleWardSelect}
                  className="gis-select"
                  showSearch
                  optionFilterProp="label"
                  options={[
                    {
                      value: "all",
                      label: "Tất cả địa bàn",
                    },

                    ...wards.map((ward) => ({
                      value: ward.id,

                      label: ward.name,
                    })),
                  ]}
                />
              </div>

              <div className="gis-filter-card__field">
                <label>Cơ sở</label>

                <Select
                  value={selectedCampusId}
                  onChange={handleCampusSelect}
                  className="gis-select"
                  showSearch
                  optionFilterProp="label"
                  options={[
                    {
                      value: "all",
                      label: "Tất cả cơ sở",
                    },

                    ...filteredCampuses.map((campus) => ({
                      value: campus.id,

                      label: `${campus.code} - ${campus.name}`,
                    })),
                  ]}
                />
              </div>
            </Card>

            {/* SELECTED CAMPUS */}

            <Card className="gis-location-card">
              <div className="gis-sidebar__title">
                <EnvironmentOutlined />

                <span>Thông tin cơ sở</span>
              </div>

              {!selectedCampusDetail ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Chọn cơ sở trên bản đồ"
                />
              ) : (
                <div className="gis-campus-detail">
                  <div className="gis-campus-detail__head">
                    <Tag color="blue">
                      {selectedCampusDetail.detail.code}
                    </Tag>

                    <h3>{selectedCampusDetail.detail.name}</h3>
                  </div>

                  <div className="gis-campus-detail__grid">
                    {selectedCampusDetail.fields.map((field) => (
                      <div
                        key={field.key}
                        className="gis-campus-detail__row"
                      >
                        <span>{field.label}</span>

                        <strong>{field.value}</strong>
                      </div>
                    ))}
                  </div>

                  <Button
                    block
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() =>
                      navigation(
                        `/operations/campuses/${selectedCampusDetail.detail.campusId}`,
                      )
                    }
                  >
                    Mở hồ sơ cơ sở
                  </Button>
                </div>
              )}
            </Card>

            {/* BUSINESS WARD STATISTICS */}

            <Card className="gis-location-card">
              <div className="gis-sidebar__title">
                <TeamOutlined />

                <span>Thống kê phường / xã</span>
              </div>

              <p className="gis-ward-stats__hint">
                Theo phường/xã trong hồ sơ cơ sở, đã áp bộ lọc trường và loại.
              </p>

              {businessWardStats.length === 0 ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Không có dữ liệu theo bộ lọc"
                />
              ) : (
                <div className="gis-ward-stats">
                  {businessWardStats.map((row) => {
                    const isActive = row.ward.id === selectedBusinessWardId;

                    return (
                      <button
                        key={row.ward.id}
                        type="button"
                        className={`gis-ward-stats__row${isActive
                          ? " is-active"
                          : ""}`}
                        onClick={() =>
                          setSelectedBusinessWardId(isActive ? "all" : row.ward.id)
                        }
                      >
                        <div className="gis-ward-stats__name">
                          <strong>{row.ward.name}</strong>

                          <span>
                            {row.campusCount} cơ sở · {row.schoolCount} trường
                          </span>
                        </div>

                        <div className="gis-ward-stats__metrics">
                          <span>{row.classCount} lớp</span>

                          <span>
                            {row.studentCount.toLocaleString("vi-VN")} HS
                          </span>

                          <span>{row.personnelCount} CB</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {selectedBusinessWardStat && (
                <div className="gis-ward-stats__total">
                  <span>Tổng đang chọn</span>

                  <strong>
                    {selectedBusinessWardStat.campusCount} cơ sở ·{" "}
                    {selectedBusinessWardStat.classCount} lớp ·{" "}
                    {selectedBusinessWardStat.studentCount.toLocaleString("vi-VN")}{" "}
                    học sinh
                  </strong>
                </div>
              )}
            </Card>

            {/* SELECTED UNIT */}

            <Card className="gis-location-card">
              <div className="gis-sidebar__title">
                <AimOutlined />

                <span>Thông tin đơn vị</span>
              </div>

              {selectedWard ? (
                <div className="gis-unit-info">
                  <Tag color="geekblue">{selectedWard.code}</Tag>

                  <h3>{selectedWard.name}</h3>

                  <div className="gis-unit-info__grid">
                    <span>Mã hành chính</span>

                    <strong>{selectedWard.code}</strong>

                    <span>Diện tích</span>

                    <strong>
                      {selectedWard.areaKm2.toLocaleString("vi-VN")} km²
                    </strong>

                    <span>Dân số (ước tính)</span>

                    <strong>
                      {selectedWard.population.toLocaleString("vi-VN")}
                    </strong>

                    <span>Cơ sở trong địa bàn</span>

                    <strong>{campusesInWard.length}</strong>
                  </div>
                </div>
              ) : (
                <div className="gis-unit-info">
                  <Tag color="cyan">{province.code}</Tag>

                  <h3>{province.name}</h3>

                  <div className="gis-unit-info__grid">
                    <span>Diện tích</span>

                    <strong>
                      {province.areaKm2.toLocaleString("vi-VN", {
                        maximumFractionDigits: 2,
                      })}{" "}
                      km²
                    </strong>

                    <span>Đơn vị hành chính</span>

                    <strong>{wards.length}</strong>

                    <span>Cơ sở toàn TP.</span>

                    <strong>{campuses.length}</strong>
                  </div>
                </div>
              )}
            </Card>

            {/* SUMMARY */}

            <Card className="gis-result-card">
              <div className="gis-sidebar__title">
                <BankOutlined />

                <span>Thống kê hiển thị</span>
              </div>

              <div className="gis-result-card__summary">
                <span>Trường học</span>

                <strong>{filteredSchoolCount}</strong>
              </div>

              <div className="gis-result-card__summary">
                <span>Cơ sở</span>

                <strong>{filteredCampuses.length}</strong>
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default GisPage;