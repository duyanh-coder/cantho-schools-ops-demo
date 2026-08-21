import {
  BankOutlined,
  EnvironmentOutlined,
  FilterOutlined,
  GlobalOutlined,
  HomeOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import { Button, Card, Col, Empty, Row, Select, Statistic, Tag } from "antd";

import { useEffect, useMemo, useState } from "react";

import {
  CircleMarker,
  MapContainer,
  Polygon,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import type { LatLngBoundsExpression } from "leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import OperationPageHeader from "@/components/OperationPageHeader";

import { getCurrentRegionMockData } from "@/mock";

import "./style.scss";

/* ========================================
   FIX LEAFLET MARKER
======================================== */

delete (
  L.Icon.Default.prototype as unknown as {
    _getIconUrl?: unknown;
  }
)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ========================================
   AUTO FIT MAP TO MOCK DATA
======================================== */

interface MapBoundsProps {
  bounds: LatLngBoundsExpression | null;
}

function MapBounds({ bounds }: MapBoundsProps) {
  const map = useMap();

  useEffect(() => {
    if (!bounds) {
      return;
    }

    map.fitBounds(bounds, {
      padding: [40, 40],

      maxZoom: 15,
    });
  }, [map, bounds]);

  return null;
}

/* ========================================
   PAGE
======================================== */

function GisPage() {

  const { gis } = getCurrentRegionMockData();

  const { wards, campuses } = gis;

  const [selectedWardId, setSelectedWardId] = useState("all");

  const [selectedCampusId, setSelectedCampusId] = useState("all");

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

  /* ========================================
       SELECTED CAMPUS
    ======================================== */

  const selectedCampus = useMemo(() => {
    if (selectedCampusId === "all") {
      return null;
    }

    return campuses.find((campus) => campus.id === selectedCampusId) ?? null;
  }, [campuses, selectedCampusId]);
  
  const filteredSchoolCount = useMemo(() => {
    return new Set(filteredCampuses.map((campus) => campus.schoolId)).size;
  }, [filteredCampuses]);

  /* ========================================
       MAP BOUNDS

       LẤY TRỰC TIẾP TỪ MOCK:

       1. wards[].polygon
       2. campuses[].location
    ======================================== */

  const mapBounds = useMemo(() => {
    const points = [
      ...wards.flatMap((ward) => ward.polygon),

      ...filteredCampuses.map((campus) => campus.position),
    ];

    if (points.length === 0) {
      return null;
    }

    return L.latLngBounds(points);
  }, [wards, filteredCampuses]);

  /* ========================================
       HANDLERS
    ======================================== */

  const handleWardChange = (wardId: string) => {
    setSelectedWardId(wardId);

    setSelectedCampusId("all");
  };

  const handleCampusChange = (campusId: string) => {
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
  };

  return (
    <div className="gis-page">
      <OperationPageHeader
        eyebrow="GIS"
        title="Bản đồ GIS"
        description="Trực quan hóa địa bàn, trường học và các cơ sở giáo dục."
        icon={<GlobalOutlined />}
      />

      {/* ========================================
               STATISTICS
            ======================================== */}

      <Row gutter={[16, 16]} className="gis-page__statistics">
        <Col xs={12} lg={6}>
          <Card className="gis-stat-card">
            <Statistic
              title="Địa bàn"
              value={wards.length}
              prefix={<EnvironmentOutlined />}
            />
          </Card>
        </Col>

        <Col xs={12} lg={6}>
          <Card className="gis-stat-card">
            <Statistic
              title="Trường học"
              // value={
              //     schools.length
              // }
              value={new Set(campuses.map((campus) => campus.schoolId)).size}
              prefix={<BankOutlined />}
            />
          </Card>
        </Col>

        <Col xs={12} lg={6}>
          <Card className="gis-stat-card">
            <Statistic
              title="Cơ sở"
              value={campuses.length}
              prefix={<HomeOutlined />}
            />
          </Card>
        </Col>

        <Col xs={12} lg={6}>
          <Card className="gis-stat-card">
            <Statistic
              title="Đang hiển thị"
              value={filteredCampuses.length}
              prefix={<EnvironmentOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* ========================================
               MAIN CONTENT
            ======================================== */}

      <Row gutter={[16, 16]}>
        {/* MAP */}

        <Col xs={24} xl={17}>
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
                center={[9.176, 105.15]}
                zoom={13}
                className="gis-map__leaflet"
                style={{
                  width: "100%",
                  height: "750px",
                  background: "#e5e7eb",
                }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <MapBounds bounds={mapBounds} />

                {/* ========================================
                    WARD POLYGONS
                ======================================== */}

                {wards.map((ward) => (
                  <Polygon
                    key={ward.id}
                    positions={ward.polygon}
                    pathOptions={{
                      color: selectedWardId === ward.id ? "#1677ff" : "#0f766e",

                      weight: 3,

                      fillColor:
                        selectedWardId === ward.id ? "#60a5fa" : "#5eead4",

                      fillOpacity: selectedWardId === ward.id ? 0.35 : 0.18,
                    }}
                    eventHandlers={{
                      click: () => {
                        setSelectedWardId(ward.id);

                        setSelectedCampusId("all");
                      },
                    }}
                  >
                    <Popup>
                      <strong>{ward.name}</strong>
                    </Popup>
                  </Polygon>
                ))}

                {/* ========================================
                    CAMPUS MARKERS
                ======================================== */}

                {filteredCampuses.map((campus) => (
                  <CircleMarker
                    key={campus.id}
                    center={campus.position}
                    radius={campus.isMainCampus ? 10 : 7}
                    pathOptions={{
                      color: "#ffffff",

                      weight: 2,

                      fillColor: campus.isMainCampus ? "#1677ff" : "#f97316",

                      fillOpacity: 1,
                    }}
                    eventHandlers={{
                      click: () => {
                        setSelectedCampusId(campus.id);

                        setSelectedWardId(campus.wardId);
                      },
                    }}
                  >
                    <Popup>
                      <div className="gis-popup">
                        <strong>{campus.schoolName}</strong>

                        <span>{campus.name}</span>

                        <p>{campus.address}</p>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>

              {/* LEGEND */}

              <div className="gis-map__legend">
                <div>
                  <span className="gis-map__legend-ward" />
                  Ranh giới phường
                </div>

                <div>
                  <span className="gis-map__legend-campus" />
                  Cơ sở giáo dục
                </div>
              </div>
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
                <label>Địa bàn</label>

                <Select
                  value={selectedWardId}
                  onChange={handleWardChange}
                  className="gis-select"
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
                  onChange={handleCampusChange}
                  className="gis-select"
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
