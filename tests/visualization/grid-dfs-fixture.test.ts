import { describe, expect, it } from "vitest";
import { flowerZones } from "@/content/problems/dfs/flower-zones";
import { GENERATORS, runGenerator } from "@/lib/visualization/generators";
import { FLOWER_ZONES_MINI_STEPS } from "../fixtures/grid-dfs.flower-zones-mini";

describe("grid-dfs — docs/05 fixture", () => {
  it("미니 정원 입력의 스텝 33개가 fixture와 정확히 일치한다", () => {
    const result = runGenerator("grid-dfs", [["110", "010", "001"]]);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.steps).toHaveLength(33);
    expect(result.steps).toEqual(FLOWER_ZONES_MINI_STEPS);
  });

  it("문제 프리셋의 의사코드는 generator 의사코드와 줄 수가 같다 (codeLine 호환)", () => {
    for (const preset of flowerZones.visualization?.presets ?? []) {
      expect(preset.pseudocode).toHaveLength(GENERATORS[preset.generator].pseudocode.length);
    }
  });
});
