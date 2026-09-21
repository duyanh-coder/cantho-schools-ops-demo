import {
  AimOutlined,
  BankOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  FilterOutlined,
  GlobalOutlined,
  HomeOutlined,
  LineChartOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import { Button, Card, Col, Empty, Row, Select, Tag } from "antd";

import { useEffect, useMemo, useState } from "react";

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

import { getCurrentRegionMockData, getFocusWardStats } from "@/mock";

import { WARD_FOCUS } from "@/config";

import type { GisWard } from "@/mock";

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

function createCampusIcon(isMainCampus: boolean) {
  const glyph = renderToStaticMarkup(<BankOutlined />);

  return L.divIcon({
    className: "gis-campus-marker",
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

const campusMainMarkerIcon = createCampusIcon(true);

const campusSubMarkerIcon = createCampusIcon(false);

/* ========================================
   PAGE
======================================== */

function GisPage() {
  const { gis } = getCurrentRegionMockData();

  const { province, wards, campuses } = gis;

  const focusWard = wards.find(
    (ward) => ward.id === WARD_FOCUS.gisWardId,
  ) ?? null;

  const [selectedWardId, setSelectedWardId] = useState(
    focusWard?.id ?? "all",
  );

  const [selectedCampusId, setSelectedCampusId] = useState("all");

  const [mapBounds, setMapBounds] = useState<LatLngBoundsExpression | null>(
    () =>
      focusWard
        ? L.latLngBounds(focusWard.polygon.flat(2))
        : L.latLngBounds(province.polygons.flat(2)),
  );

  const focusWardStats = getFocusWardStats();

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

      return matchWard && matchCampus;
    });
  }, [campuses, selectedWardId, selectedCampusId]);

  const selectedCampus = useMemo(() => {
    if (selectedCampusId === "all") {
      return null;
    }

    return campuses.find((campus) => campus.id === selectedCampusId) ?? null;
  }, [campuses, selectedCampusId]);

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
      return;
    }

    const campus = campuses.find((item) => item.id === campusId);

    if (campus) {
      setSelectedWardId(campus.wardId);
    }
  };

  const handleReset = () => {
    setSelectedWardId("all");

    setSelectedCampusId("all");

    setMapBounds(L.latLngBounds(province.polygons.flat(2)));
  };

  return (
<div className="gis-page">
      <header className="page-head">
        <div className="page-head__title">
          <span className="page-head__eyebrow">GIS</span>

          <h2>Bản đồ GIS</h2>

          <p>Trực quan hóa địa bàn, trường học và các cơ sở giáo dục.</p>
        </div>
      </header>

      <div className="page-kpi">
        <StatsCard
          tone="blue"
          title="Đơn vị hành chính"
          value={wards.length}
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

                {filteredCampuses.map((campus) => (
                  <Marker
                    key={campus.id}
                    position={campus.position}
                    icon={
                      campus.isMainCampus
                        ? campusMainMarkerIcon
                        : campusSubMarkerIcon
                    }
                    eventHandlers={{
                      click: () => handleCampusSelect(campus.id),
                    }}
                  >
                    <Popup>
                      <div className="gis-popup">
                        <strong>{campus.schoolName}</strong>

                        <span>{campus.name}</span>

                        <p>{campus.address}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
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

              {!selectedWard && (
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
                <label>Xã / Phường</label>

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

              {!selectedCampus ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Chọn cơ sở trên bản đồ"
                />
              ) : (
                <div className="gis-location-info">
                  <Tag color="blue">{selectedCampus.code}</Tag>

                  <h3>{selectedCampus.name}</h3>

                  <p>{selectedCampus.schoolName ?? "-"}</p>

                  <div className="gis-location-info__address">
                    <EnvironmentOutlined />

                    <span>{selectedCampus.address}</span>
                  </div>

                  <div className="gis-location-info__coordinates">
                    <span>Lat: {selectedCampus.position[0]}</span>

                    <span>Lng: {selectedCampus.position[1]}</span>
                  </div>
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

            {/* FOCUS WARD MICRO STATS */}

            {focusWardStats.length > 0 && (
              <Card className="gis-result-card">
                <div className="gis-sidebar__title">
                  <BankOutlined />

                  <span>Vi mô Phường Ninh Kiều</span>
                </div>

                <div className="gis-unit-info__grid">
                  <span>Giáo viên</span>

                  <strong>
                    {focusWardStats[0].teacherCount}
                  </strong>

                  <span>Học sinh đang học</span>

                  <strong>
                    {focusWardStats[0].studentCount}
                  </strong>

                  <span>Học 2 buổi</span>

                  <strong>
                    {focusWardStats[0].twoSessionCount}
                  </strong>

                  <span>Đối tượng chính sách</span>

                  <strong>
                    {focusWardStats[0].policyStudentCount}
                  </strong>

                  <span>Biến động sỉ số</span>

                  <strong>
                    {focusWardStats[0].enrollmentChangeCount}
                  </strong>
                </div>
              </Card>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default GisPage;