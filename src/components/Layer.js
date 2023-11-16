export const Layer = (id, type, sourceName, style) => {
  return { id, type, source: sourceName, paint: style };
};
