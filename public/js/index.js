var fs = require('fs');
var ytdl = require('ytdl-core');

// ytdl('http://www.youtube.com/watch?v=A02s8omM_hI')
// ytdl('https://www.youtube.com/watch?v=QLHbiQ8Q57M')

ytdl('https://www.youtube.com/watch?v=GPNU3UlJros')
  .pipe(fs.createWriteStream('vid/video2.flv'));
