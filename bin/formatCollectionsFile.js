function formatFile() {
    // Open the original collections file.
    const fs = require('fs');

    const data = fs.readFileSync('./public/collection_times.json'); // get file as string
    const json = JSON.parse(data); // parse string to json data

    // Format to our liking.
    const formattedData = json.data.map( place => {
        // const time = place[4].slice(-11);
        const timeIndex = place[4].indexOf('時間：') + 3;
        let time = place[4].slice( timeIndex , timeIndex + 11 );
        time = time.replace(/：/g, ':');
        time = time.replace('~', '-');

        return {
            id: place[0],
            address: place[3].replace('垃圾清運點：', ''),
            startTime: time.split('-')[0],
            endTime: time.split('-')[1],
            lng: place[5],
            lat: place[6],
        }
    } );
    // console.log(formattedData);

    // Save formatted json in new file.
    fs.writeFileSync('./public/formatted_places.json', JSON.stringify( formattedData ) );
}

formatFile();
