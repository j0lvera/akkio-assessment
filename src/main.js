import "./style.css";
import { getColor } from "./colors.js";

(async function () {
  const color = await getColor(0, 100, 50);
  console.log(color);
})();

(() => {
  // Initial values
  let saturation = 25;
  let lightness = 50;

  // DOM elements
  const d = document;
  const $saturationRange = d.getElementById("saturation-range");
  const $saturationNumber = d.getElementById("saturation-number");
  const $lightnessRange = d.getElementById("lightness-range");
  const $lightnessNumber = d.getElementById("lightness-number");

  // Initial state
  $saturationRange.value = saturation;
  $saturationNumber.value = saturation;

  $lightnessRange.value = lightness;
  $lightnessNumber.value = lightness;

  // Functions
  /**
   * @param {number} value
   * @param {HTMLElement} $range
   * @param {HTMLElement} $number
   */
  function updateState(value, $range, $number) {
    $range.value = value;
    $number.value = value;
  }

  /**
   * @param {Event} event
   */
  function handleRangeChange(event) {
    const value = event.target.value;

    $saturationNumber.value = value;
  }

  /**
   * @param {Event} event
   */
  function handleNumberChange(event) {
    const value = event.target.value;

    $saturationRange.value = value;
  }

  $saturationNumber.addEventListener("change", handleNumberChange);
  $saturationRange.addEventListener("change", handleRangeChange);
})();
