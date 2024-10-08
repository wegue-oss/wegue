# Custom icons

Wegue allows to inject custom icons inside Vuetify. Each icon to be injected must be defined in a separate file in the `app/custom-icons` folder.

Those files should be standard `.js` files containing a default export of an `SVG` path definition preceded by `svg:`. The name of the file, without the `.js` extension will be used to reference the icon afterwards.  
To use a custom icon inside a component or a configuration file, you have to name it as `$myIconName`.

To integrate nicely inside Vuetify and keep the visual coherence of the whole framework, path coordinates should stay in the [0, 24] range in both horizontal and vertical directions.

## Example

Below is an example of an icon file which defines a W letter:


```js
export default 'svg:M 23.16738,3.1894921 18.478314,20.810508 H 16.232499 L 12.802077,9.2605987 Q 12.579963,8.5695784 12.382529,7.8538789 12.209775,7.1134999 12.061699,6.5705557 11.938302,6.002932 11.913624,5.780818 11.888911,6.1016475 11.64215,7.1628586 11.395358,8.1993891 11.074526,9.3346366 L 7.7428218,20.810508 H 5.497006 L 0.83261985,3.1894921 H 3.1524731 L 5.8918748,13.949664 q 0.2961515,1.135248 0.4935859,2.196457 0.2221136,1.06121 0.3455113,1.999023 0.1233977,-0.962492 0.3701893,-2.09774 0.2467916,-1.135247 0.5676237,-2.221136 l 3.10959,-10.6367759 h 2.295174 l 3.232988,10.7108139 q 0.345511,1.135247 0.592302,2.270495 0.246792,1.135247 0.37019,1.974343 0.09872,-0.913134 0.320829,-1.974343 0.246792,-1.085889 0.542945,-2.245816 L 20.847525,3.1894921 Z'
```

If this icon file is named `app/custom-icons/WLetter.js`, it can used inside a configuration file like this:

```json
  "sample-module": {
    "target": "toolbar",
    "win": "floating",
    "icon": "$WLetter"
  }
```

And to use the same icon inside of a Vue component:


```vue
  <v-icon color="teal darken-2">$WLetter</v-icon>
```
