# Pack fonts for PDF export

For a quality PDF output, it is essential that our library has access to the same fonts that the browser uses to display the elements that you need to output.  Otherwise the layout of the PDF will look broken and non-ASCII characters might not be displayed properly.

Declaring fonts is somewhat painful:

- you must write the appropriate `@font-face` rules in the CSS
- you must host the CSS file on the same domain as the page
- you must keep the font files on the same domain too, or otherwise, make sure that the server hosting the fonts sends the proper [HTTP access control (CORS) headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS).
- you cannot serve the page over `file:///` URL-s (which can be useful, for example in mobile apps)

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

Placing it in `<head>` is not a strict requirement, but I recommend it.  The script will inject `@font-face` declarations into the page with `document.write`.  Do not attempt to load this with RequireJS or similar tools, it will not work.

Like any compromise, this method has its advantages and drawbacks:

Pros:

- PRO: a single HTTP request is needed to load all the fonts you use in a page

- PRO: it has no domain security restrictions

- PRO: the fonts will be available before your page renders (no flickering)

Cons:

- CON: the size of the generated file is greater than the sum of the sizes of the binary `.ttf` files.  But serving JS with gzip compression (which you should do anyway) almost makes up for the difference.

- CON: all fonts will be loaded, even if only a few are needed.

- CON: loading the generated `<script>` spends, on average, 15 milliseconds per font, to create a binary `Blob` from BASE64.  I did not benchmark the classic method (loading the `.ttf` files as usual with plain CSS) but I think it's safe to say that should be a bit faster.

## Browser support

The generated bundle should work in all browsers that support [`Blob`](https://developer.mozilla.org/en/docs/Web/API/Blob).  I tested it on IE 10, Firefox, Chrome.

A workaround should be possible for IE9, but not yet implemented.
