Playing a chunked MP3 with the Web Audio API
=============================

Play a chunked MP3 with the Web Audio API without having to wait for all the pieces to be loaded.

In this proof of concept **(currently only tested and working in Chrome)** I've split the mp3 in 23 parts by using the unix split command. The moment the first part is loaded then the playback starts immediately and it loads the second part.
When the second part is loaded then then I create a new AudioBuffer by combining the old and the new, and I change the buffer of the AudioSourceNode with the new one. At that point I start playing again from the new AudioBuffer.

A lot of thanks to Paul (<a href="http://twitter.com/aerotwist" title="Paul Lewis on Twitter" target="_blank">@aerotwist</a>) for his suggestions and to Theo for letting me use his awesome track <a href="https://soundcloud.com/theokouroumlis/breathe-in" title="Theo Kouroumlis - Breathe In" target="_blank">Breathe In</a>.
