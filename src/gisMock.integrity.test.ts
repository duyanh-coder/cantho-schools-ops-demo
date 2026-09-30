import { describe, expect, it } from "vitest";

import {
  canThoCampuses,
  canThoGis,
} from "@/mock/canTho";

import {
  canThoMockData,
} from "@/mock";

const PRIMARY_CAMPUS_IDS = [
  "campus-main",
  "campus-an-lac",
  "campus-tran-hung-dao",
  "campus-huynh-thuc-khang",
  "campus-thoi-binh",
  "campus-chu-van-an",
];

const campusEntityById = new Map<string, (typeof canThoCampuses)[number]>(
  canThoCampuses.map(
    (campus) => [campus.id, campus] as [string, (typeof canThoCampuses)[number]],
  ),
);

describe("PHASE 02 GIS + campus list integrity", () => {
  it("every GIS campus resolves to a Campus entity (single source)", () => {
    for (const gisCampus of canThoGis.campuses) {
      const entity = campusEntityById.get(gisCampus.id);

      expect(entity, `GIS campus ${gisCampus.id} must map to Campus entity`).toBeDefined();

      expect(gisCampus.isMainCampus).toBe(entity!.isMainCampus);

      expect(gisCampus.schoolName).toBe(entity ? String(canThoMockData.schools.find(
        (school) => school.id === entity.schoolId,
      )?.name ?? "") : "");
    }
  });

  it("every GIS campus position is finite coordinates", () => {
    for (const gisCampus of canThoGis.campuses) {
      const [lat, lng] = gisCampus.position;

      expect(Number.isFinite(lat)).toBe(true);

      expect(Number.isFinite(lng)).toBe(true);
    }
  });

  it("every Campus entity has finite latitude/longitude", () => {
    for (const campus of canThoCampuses) {
      expect(Number.isFinite(campus.latitude)).toBe(true);

      expect(Number.isFinite(campus.longitude)).toBe(true);

      expect(campus.location.lat).toBe(campus.latitude);

      expect(campus.location.lng).toBe(campus.longitude);
    }
  });

  it("primary school campuses all have type and phone populated", () => {
    for (const campusId of PRIMARY_CAMPUS_IDS) {
      const campus = campusEntityById.get(campusId);

      expect(campus, `campus ${campusId} must exist`).toBeDefined();

      expect(campus!.type).toMatch(/^(HEADQUARTERS|BRANCH)$/);

      expect(campus!.phone).toBeTruthy();
    }
  });

  it("primary campus id lookup covers all six school-001 campuses", () => {
    const school001Ids = canThoCampuses
      .filter((campus) => campus.schoolId === "can-tho-school-001")
      .map((campus) => campus.id);

    expect([...PRIMARY_CAMPUS_IDS].sort()).toEqual([...school001Ids].sort());
  });
});