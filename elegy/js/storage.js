export const Storage = {
  read(area, key, fallback) {
    try {
      const raw = area.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (error) {
      console.warn(`Nem sikerült beolvasni a tárolt adatot: ${key}`, error);
      return fallback;
    }
  },
  write(area, key, value) {
    try {
      area.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Nem sikerült elmenteni a tárolt adatot: ${key}`, error);
      return false;
    }
  },
  remove(area, key) {
    try {
      area.removeItem(key);
    } catch (error) {
      console.warn(`Nem sikerült törölni a tárolt adatot: ${key}`, error);
    }
  },
  clone(value) {
    if (typeof structuredClone === "function") return structuredClone(value);
    return JSON.parse(JSON.stringify(value));
  }
};
