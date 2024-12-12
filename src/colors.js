const API_URL = "https://www.thecolorapi.com/scheme";

/**
 * @typedef {Object} colorAPIResponse
 * @property {string} hex.value
 * @property {string} hex.clean
 * @property {string} name.value
 * @property {string} name.closest_named_hex
 * @property {boolean} name.exact_match_name
 * @property {number} name.distance
 */

/**
 * @type {Map<string, colorAPIResponse>}
 */
const colorCache = new Map();

/**
 * @param h - hue
 * @param s - saturation
 * @param l - lightness
 * @returns {Promise<colorAPIResponse>}
 */
async function getColor(h, s, l) {
  const key = `${h}-${s}-${l}`;

  if (colorCache.has(key)) {
    return colorCache.get(key);
  }

  // construct the URL
  const params = new URLSearchParams({
    format: "json",
    count: 10,
    hsl: `${h},${s}%,${l}%`,
  }).toString();

  const url = `${API_URL}?${params}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  colorCache.set(key, data.colors[0].hex.value);
  return colorCache.get(key);
}

export { getColor };
