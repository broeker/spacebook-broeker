const axios  = require('axios');
const seed   = require('../../_includes/assets/utils/save-seed.js');


// Once a google sheet is "published to the web" we can access its JSON
// via a URL of this form. We just need to pass in the ID of the sheet
// which we can find in the URL of the document.
const sheetID = "1uBfqzfH6XgQ9ByHrQCVi72QUSh9uDL9k1acEc8V8HJQ";
const googleSheetUrl = `https://spreadsheets.google.com/feeds/list/${sheetID}/od6/public/values?alt=json`;

module.exports = () => {
  return new Promise((resolve, reject) => {

    console.log(`Requesting data from ${googleSheetUrl}`);
    console.log(`My dir: ${__dirname}`)

    axios.get(googleSheetUrl)
      .then(response => {

        // massage the data from the Google Sheets API into
        // a shape that will more convenient for us in our SSG.
        var data = {
          "Links": [],
        };
        response.data.feed.entry.forEach(item => {
          data[item.gsx$links.$t].push({
            "date": item.gsx$date.$t,
            "title": item.gsx$title.$t,
            "url": item.gsx$url.$t
          })
        });

        // stash the data locally for developing without
        // needing to hit the API each time.
        seed(JSON.stringify(data), `${__dirname}/../dev/sheet.json`);

        // resolve the promise and return the data
        resolve(data);

      })

      // uh-oh. Handle any errors we might encounter
      .catch(error => {
        console.log('Error :', error);
        reject(error);
      });
  })
}
