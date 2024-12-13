// Binary Search Async
//

import { getColor } from "./color.js";

/**
 * @typedef {Function} SearchBinaryCallback
 * @param {number} h - hue
 * @returns {Promise<colorAPIResponse>}
 */

/**
 * @typedef {Object} Color
 * @property {string} name
 * @property {string} hex
 */

/**
 * Binary search function
 *
 * A small algorithm that uses binary search to find the closest color name to
 * a given color. I tried to make the function as pure as possible, it could be
 * further optimized by taking a general async function as a parameter. This
 * improvement would remove dependencies and make the function more reusable and
 * easy to test.
 *
 * @async
 * @function binarySearch
 * @param {number} saturation
 * @param {number} lightness
 * @returns {Promise<Color[]>}
 */
async function binarySearchAsync(saturation, lightness) {
  /**
   * @param h
   * @returns {Promise<Color>}
   */
  async function getColorName(h) {
    const res = await getColor(h, saturation, lightness);

    return {
      name: res.name.value,
      hex: res.name.closest_named_hex,
    };
  }

  let breakpoints = [];
  let activeHue = 0;

  async function findBreakpoint(start, end, colorName) {
    let left = start;
    let right = end;
    let breakpoint = null;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midColorName = await getColorName(mid);

      if (midColorName.name !== colorName) {
        breakpoint = mid;
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    return breakpoint;
  }

  let startColor = await getColorName(activeHue);

  while (activeHue <= 360) {
    const breakpoint = await findBreakpoint(activeHue, 360, startColor.name);

    if (breakpoint === null) {
      break;
    }

    activeHue = breakpoint;
    startColor = await getColorName(activeHue);
    breakpoints.push(startColor);
  }

  return breakpoints;
}

export { binarySearchAsync };
