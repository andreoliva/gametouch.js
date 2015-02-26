gametouch.js
============
Creates an on-screen gamepad for mobile devices, that you can map to your KeyboardEvents.

Why?
------------
I had some small games that needed to be playable on mobile, but only had keyboard controls. I created this library as an all-purpose "gamepad" that I could easily map to my existent "key down" and "key up" functions without having to reprogram the actual game, and that would fail silently if TouchEvents were not existent (so I don't have to create different versions of the game). Another goal is to create something totally independent from other libraries.

Currently it contains:
- up to two "action buttons" (A & B)
- one directional OR one analogic

Installation:
------------
Just add the gametouch.js and gametouch.css files to your project and include them in your html.
```
<link rel="stylesheet" media="all" href="path/to/gametouch.css">
<script src="path/to/gametouch.js"></script>
```

How to use it:
------------
_This section is under construction, come back later._

Tested on:
------------
- Android 4.2 and 5.0 (Google Chrome)
- iOS 7 (Safari)
- **theoretically** it'll work on any CSS3 capable browser

To do list:
------------
- use of more than two action buttons
- use of two analog sticks (a.k.a. "katamari controls")
- different button positioning profiles
- different button styles