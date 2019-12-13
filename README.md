# jquery-position-event
jQuery cursor position change event

[![npm](https://img.shields.io/badge/npm-0.1.0-blue.svg)](https://www.npmjs.com/package/jquery-position-event)

[Demo](https://codepen.io/jcubic/pen/GRgjgad)

# Usage

## Browser with CDN

```html
<script src="https://unpkg.com/jquery-position-event"></script>
```

## jQuery Code


```javascript
var textarea = $('textarea').on('position', function(e) {
   console.log(e.position);
});

textarea.trigger('position');
textarea.off('position');

```

## Weback/Node

```
npm install --save jquery-position-event
```

then use this import:

```
var position = require('imports-loader?define=>false!jquery-position-event');
position(window, $);
```

# API

**Event** object have this properties:

* **position** - index of the cursor
* **column** - index to the begining of the line
* **line** - index of the line

All indexes start from 0.

# License

Licensed under [MIT](http://opensource.org/licenses/MIT) license

Copyright (c) 2019 [Jakub T. Jankiewicz](https://jcubic.pl/me)