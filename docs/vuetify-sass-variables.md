# Vuetify SASS variables

For more advanced use-cases, Wegue allows to completely customize its look and feel by overriding the `SASS` variables used by Vuetify. These overrides must be done via the `app/styles/vuetify-settings.scss` file.

An extensive list of Vuetify configurable global `SASS` variables can be found [here](https://vuetifyjs.com/en/api/globals/).  
To this list, you can also add the variables defined specifically for each component. These are listed in the `API` section of the official Vuetify documentation, at the bottom of each page dedicated to components. If you have a clear idea of the parameter you want to override, you can search the complete list of variables from the combobox located [here](https://vuetifyjs.com/en/features/sass-variables/#variable-api)

## Examples

Below are two examples of customisation, one very simple and the other requiring a few additional steps.

For example, it is possible to modify the border radius of component windows by changing the variable `$card-border-radius`. This can be done very easily by modifying your `app/styles/vuetify-settings.scss` file as follows:

```css
$custom-font-family: Avenir, Helvetica, Arial, sans-serif;

@use 'vuetify/settings' with (
  $body-font-family: $custom-font-family,
  $heading-font-family: $custom-font-family,
  $card-border-radius: 16px
);
```

As a more complicated example, it is possible to change the font used in Wegue. To do this, you will need to install a package containing this font and include it somewhere in your code.  
To find open-source fonts packaged in the expected format and easy to use, you can visit [fontsource.org](https://fontsource.org/). This site contains a [generic guide](https://fontsource.org/docs/getting-started/install) explaining how to include a font bundled by them, and these explanations are clearly adapted on each font-specific page.

If you wanted to use the [Space Grotesk](https://fontsource.org/fonts/space-grotesk) font, you can follow [their dedicated install page](https://fontsource.org/fonts/space-grotesk/install).

First, you must install the font by installing its NPM package:

```sh
npm i --save @fontsource-variable/space-grotesk
```

You must then import this font somewhere in your code, for example in the `app/WguAppTemplate.vue` file by adding this line:

```js
import '@fontsource-variable/space-grotesk';
```

And finally, you must modify the Vuetify `SASS` variables by modifying your `app/styles/vuetify-settings.scss` file as follows:

```css
$custom-font-family: 'Space Grotesk Variable', sans-serif;

@use 'vuetify/settings' with (
  $body-font-family: $custom-font-family,
  $heading-font-family: $custom-font-family
);
```
