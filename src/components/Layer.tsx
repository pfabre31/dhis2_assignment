import { LayerType } from "../types";

export const Layer = (
  id: string,
  type: string,
  sourceName: string,
  style: Object
): LayerType => {
  return { id, type, source: sourceName, paint: style };
};
