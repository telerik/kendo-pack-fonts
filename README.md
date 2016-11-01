# Pack Fonts as Inline Scripts

## Overview

Thе `kendo-pack-fonts` module packs one or more fonts into JavaScript code. In this way, you can load that code by using a `<script>` tag.

The packed code works:
* Regardless of the location you store it&mdash;this means that you do not need CORS headers.
* Even if the page is loaded to the `file://` URL, because you do not need an AJAX request to load the fonts into the Kendo UI PDF library.

## Basic Usage

The following steps demonstrate how to use the module:

1. Install the package by running `npm install -g @telerik/kendo-pack-fonts`

1. Place the `.ttf` files of your project in a directory.

1. Add a file named `fonts.json` that has contents similar to the example below.

    ```
        [
            {
                "fontFamily": "DejaVu Sans",
                "fontWeight": "normal",
                "fontStyle": "normal",
                "src": "./DejaVuSans.ttf"
            },{
                "fontFamily": "DejaVu Sans",
                "fontWeight": "bold",
                "fontStyle": "normal",
                "src": "./DejaVuSans-Bold.ttf"
            },{
                "fontFamily": "DejaVu Sans",
                "fontWeight": "normal",
                "fontStyle": "italic",
                "src": "./DejaVuSans-Oblique.ttf"
            },{
                "fontFamily": "DejaVu Sans",
                "fontWeight": "bold",
                "fontStyle": "italic",
                "src": "./DejaVuSans-BoldOblique.ttf"
            }
        ]
    ```

    > **Important**
    > * The `fontFamily` has to be the name you use in CSS for your `font-family` declarations.
    > * The `fontWeight` and `fontStyle` have to be either `"normal"`, `"bold"`, or`"italic"`.
    > * The `src` is the path to the font file.

1. Run the `kendo-pack-fonts` command from the directory.

    cd /path/to/fonts/directory
    kendo-pack-fonts > fonts.js

    The module bundles the fonts into JavaScript code and dumps it into standard output. In the example above, the code is redirected to a `fonts.js` file.

1. Load the file with a script file to your page.

    ```
        <head>
          ...
          <script src="fonts.js"></script>
    ```

    While placing it in the `<head>` is not a requirement, it is strongly recommended. The script injects the `@font-face` declarations into the page with the `document.write` setup. Do not attempt to load it with RequireJS or similar tools, because it will not work.

# Sample Page

The `sample` folder contains a page that uses packed "DejaVu Sans" fonts. It was created using the steps described above.

## Pros and Cons

This approach demonstrates the following advantages and disadvantages:

|PROS|CONS|
|:---|:---|
|To load all the fonts you want to use in a page, you need a single HTTP request. |The size of the generated file is greater than the sum of the sizes of the binary `.ttf` files. However, when you serve JavaScript with the `gzip` compression, you make up for the difference.|
|You do not have domain security restrictions.|Though you might need just one, all fonts are loaded.|
|The fonts are available before your page is rendered&mdash;this means that no flickering occurs.|The average time the generated `<script>` spends to create a binary `Blob` from BASE64 is 15 milliseconds per font. The process is faster when you use the classic method of loading the `.ttf` files with plain CSS.|

## Browser Support

The generated bundle works in all browsers that support [`Blob`](https://developer.mozilla.org/en/docs/Web/API/Blob). It is tested against Interenet Explorer 10, Firefox, and Chrome.
