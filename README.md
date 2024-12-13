# Akkio assessment

## Installation

```shell
# Install dependencies
npm i

# Run the app
npm run dev
```

Open the app on http://localhost:5173/

## Summary

The application is written in plain JavaScript and uses TypeScript as JSDoc comments. I chose this approach to make it as simple as possible and because I thought it'd be fun.

I put two input types per value, i.e., saturation and lightness. 

* The `type="number"` inputs make it easier for people to enter a specific value instead of trying to get an exact number with the mouse or arrow keys.  
* The `type="range"` allows for people to quickly understand how the application works.

There are a few optimizations that I'd like to implement if I had more time:

* Use a colors-ready state where we can start displaying swatches as soon as they are ready.
* An `onKeyUp` listener on the input fields to update the swatches as the user types. Probably with a debounce function.
* Use local storage or indexDB to cache the API responses across sessions.

## Bonus challenge

I implemented two approaches. Both optimizations work together.

* Implemented binary search on the 360 possible hue values 
* Cached the API responses to avoid multiple requests on the same hsl values