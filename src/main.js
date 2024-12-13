import "./style.css";
import { colorCardTemplate } from "./color.js";
import { binarySearchAsync } from "./binarySearchAsync.js";

window.apiCalls = 0;

/**
 * General loading function where we set the loading state of a specific
 * element, e.g., <div data-loading="login">Loging in...</div>
 *
 * We allow side effects to be passed in as an optional callback function.
 *
 * @param {boolean} isLoading
 * @param {string} dataId
 * @param {Function} [callback]
 * @returns {void}
 */
function setLoading(isLoading, dataId, callback) {
  const loadingFeedback = document.querySelector(`[data-loading='${dataId}']`);

  loadingFeedback.style.display = isLoading ? "block" : "none";

  callback?.();
}

/**
 * Main function
 *
 * We use a named function to allow easier debugging.
 *
 * @param {number} saturation
 * @param {number} lightness
 * @constructor
 */
(function ColorSwatches(saturation, lightness) {
  // DOM elements
  const d = document;
  const $saturationRange = d.getElementById("saturation-range");
  const $saturationNumber = d.getElementById("saturation-number");
  const $lightnessRange = d.getElementById("lightness-range");
  const $lightnessNumber = d.getElementById("lightness-number");
  const $grid = d.getElementById("color-grid");
  const $apiCalls = d.getElementById("api-calls");

  // Initial state
  $apiCalls.innerHTML = window.apiCalls;
  $saturationRange.value = saturation;
  $saturationNumber.value = saturation;
  $lightnessRange.value = lightness;
  $lightnessNumber.value = lightness;

  // Functions
  function cleanUpScreen() {
    $grid.innerHTML = "";
  }

  /**
   * We abstract the logic to get the colors.
   *
   * @returns {Promise<string>}
   */ async function handleGetColors() {
    // Grab the values from the input fields.
    // Yeah, I know about using the DOM as a data store, but it's a demo.
    saturation = $saturationNumber.value;
    lightness = $lightnessNumber.value;

    // We use the binary search algorithm to get the colors.
    const cards = await binarySearchAsync(saturation, lightness);

    // Create the color cards HTML elements.
    const cardElements = cards.map((color) => {
      return colorCardTemplate(color.hex, color.name, color.hex);
    });

    // Join the elements into a single string.
    return cardElements.join("");
  }

  /**
   * This function handles the main logic:
   * - It sets the loading state to true
   * - It calls the `handleGetColors` function to get the color cards
   * - It updates the grid with the color cards
   * @returns {void}
   */
  function updateColors() {
    // Side effects
    window.apiCalls = 0;
    $apiCalls.innerText = window.apiCalls;
    setLoading(true, "grid", cleanUpScreen);

    // Get the colors, update the grid, and act upon the requests' lifecycle.
    handleGetColors()
      .then((cards) => ($grid.innerHTML = cards))
      // NOTE: We can show user feedback about an error.
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false, "grid");
        $apiCalls.innerText = window.apiCalls;
      });
  }

  /**
   * Updates the value of an HTML input and optionally calls a callback function.
   * @param {Event} event
   * @param {HTMLInputElement} target
   * @param {Function} [callback]
   * @returns {void}
   */
  function handleValueChange(event, target, callback) {
    target.value = event.target.value;

    callback?.();
  }

  $saturationNumber.addEventListener("change", (event) =>
    handleValueChange(event, $saturationRange, updateColors),
  );

  $saturationRange.addEventListener("change", (event) =>
    handleValueChange(event, $saturationNumber, updateColors),
  );

  $lightnessNumber.addEventListener("change", (event) =>
    handleValueChange(event, $lightnessRange, updateColors),
  );

  $lightnessRange.addEventListener("change", (event) =>
    handleValueChange(event, $lightnessNumber, updateColors),
  );
})(25, 50);
