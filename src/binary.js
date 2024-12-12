import { getColor } from "./colors.js";

/**
 * @typedef {Function} SearchBinaryCallback
 * @param {number} h - hue
 * @returns {Promise<colorAPIResponse>}
 */

/**
 * Abstract binary search function
 * @async
 * @function binarySearch
 * @param {number} saturation
 * @param {number} lightness
 // * @param {SearchBinaryCallback} callback
 */
async function binarySearchAsync(saturation, lightness) {
  /**
   * @param h
   * @returns {Promise<string>}
   */
  async function getColorName(h) {
    const res = await getColor(h, saturation, lightness);
    return res.name.value;
  }

  let breakpoints = [];
  let activeHue = 0;

  // debugger;
  async function findBreakpoint(start, end, colorName) {
    let left = start;
    let right = end;
    let breakpoint = null;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midColorName = await getColorName(mid);

      if (midColorName !== colorName) {
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
    const breakpoint = await findBreakpoint(activeHue, 360, startColor);

    if (breakpoint === null) {
      break;
    }

    activeHue = breakpoint;
    startColor = await getColorName(activeHue);
    breakpoints.push({ hue: activeHue, name: startColor });
  }

  return breakpoints;
}

export { binarySearchAsync };
