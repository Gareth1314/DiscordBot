var Xray = require('x-ray')
var xray = Xray()

function scrapeGregsKitchen(bot, channelID) {
    /*let scrape
    var clientRequest = https.get("https://api.zenrows.com/v1/?apikey=02fc875bb06783e2971be2eb83ca89c1c0460143&url=https://www.youtube.com/c/GregsKitchen/videos&autoparse=true", res => {
        var body = [];

        res.on('data', function (chunk) {
            body.push(chunk);
        });

        res.on('end', function () {
            var data = body;
        });
    }).on('error', function (e) {
        console.log("Error: ", e);
    });*/

    xray('https://www.youtube.com/c/GregsKitchen/videos', 'div#details', [
        {
          title: 'a#video-title@title'
        }
      ])
        .write('results.json')
}

module.exports = { scrapeGregsKitchen };