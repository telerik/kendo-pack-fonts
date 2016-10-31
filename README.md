# Pack fonts as inline scripts

This module packs one or more fonts into JavaScript code.  You can then load that code with a `<script>` tag and it will work no matter where you store it (no need for CORS headers).  It will also work if the page is loaded on `file://` URL, because no AJAX request is needed to load the fonts in Kendo PDF library.

## Usage

Put your `.ttf` files in a directory, and add a file named `fonts.json` file with contents similar to this:

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

The `fontFamily` should be the name you use in CSS for your `font-family` declarations.  The `fontWeight` and `fontStyle` should be either `"normal"` or `"bold"`/`"italic"`.  And the `src` is the path to the font file.

Now simply run `kendo-pack-fonts` from that directory:

    cd /path/to/fonts/directory
    kendo-pack-fonts > fonts.js

Our module bundles the fonts into JS code and dumps it on standard output.  In the example above, we redirected it into a `fonts.js` file.  Now, in your page you should just load it with a script tag:

    <head>
      ...
      <script src="fonts.js"></script>

Placing it in `<head>` is not a strict requirement, but we recommend it.  The script will inject `@font-face` declarations into the page with `document.write`.  Do not attempt to load this with RequireJS or similar tools, it will not work.

Like any compromise, this method has its advantages and drawbacks:

Pros:

- Single HTTP request is needed to load all the fonts you use in a page

- No domain security restrictions

- The fonts will be available before your page renders (no flickering)

Cons:

- The size of the generated file is greater than the sum of the sizes of the binary `.ttf` files.  But serving JS with gzip compression (which you should do anyway) almost makes up for the difference.

- All fonts will be loaded, even if only a few are needed.

- Loading the generated `<script>` spends, on average, 15 milliseconds per font, to create a binary `Blob` from BASE64.  This should be faster than the classic method - loading the `.ttf` files as usual with plain CSS.

## Browser support

The generated bundle should work in all browsers that support [`Blob`](https://developer.mozilla.org/en/docs/Web/API/Blob).  Tested on IE 10, Firefox, Chrome.

A workaround should be possible for IE9, but it's not yet implemented.
