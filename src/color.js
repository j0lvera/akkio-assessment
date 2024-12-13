// Everything related to getting the colors from the API.

const API_URL = "https://www.thecolorapi.com/id";

/**
 * @typedef {Object} colorAPIResponse
 * @property {string} hex.value
 * @property {string} hex.clean
 * @property {string} hsl.h
 * @property {string} hsl.s
 * @property {string} hsl.l
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
 * Calls the color API and returns the response.
 *
 * The function has a few side effects, but with good reason. We are caching
 * API responses in case people need to re-fetch repeated hsl values.
 *
 * Additionally, we are updating a global variable to display the amount of
 * API calls we make compared to the 360 we'd do without any optimization.
 *
 * @param h - hue
 * @param s - saturation
 * @param l - lightness
 * @returns {Promise<colorAPIResponse>}
 */
async function getColor(h, s, l) {
  const key = `${h}-${s}-${l}`;

  if (colorCache.has(key)) {
    console.info("Cache hit", key);
    return colorCache.get(key);
  }
  console.info("Cache miss", key);

  // construct the URL
  const params = new URLSearchParams({
    format: "json",
    hsl: `${h},${s}%,${l}%`,
  }).toString();

  const url = `${API_URL}?${params}`;

  /** type {Response<colorAPIResponse>} */
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Side effects
  window.apiCalls++;
  colorCache.set(key, await response.json());

  return colorCache.get(key);
}

/**
 * @param {string} color
 * @param {string} name
 * @param {string} hex
 * @returns {string}
 */
const colorCardTemplate = (color, name, hex) => `
  <div class="color-card">
    <div class="color-card-content" style="background-color: ${color};"></div>
    <div class="color-card-name">${name}</div>
    <div class="color-card-hex">${hex}</div>
  </div>`;

export { getColor, colorCardTemplate };
