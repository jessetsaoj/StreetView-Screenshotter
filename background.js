var ext = '.jpg';

chrome.runtime.onInstalled.addListener(function() {
    console.log('MSP extension');
});

chrome.browserAction.onClicked.addListener((tab) => {
    action();
});

function action() {
    chrome.tabs.insertCSS({file: "ui-off.css"});
    setTimeout(takeScreenshot, 200);
}

function takeScreenshot() {
    chrome.tabs.captureVisibleTab((imageUrl) => {
        chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
            function(tabs){
                // get gps location from google streetview url
                let url = tabs[0].url;
                let imageUrlWithExif = addGPSInfo(imageUrl, url);
                
                let filename = `${new Date().getTime()}${ext}`
                var hrefElement = document.createElement('a');
                hrefElement.href = imageUrlWithExif;
                hrefElement.download = filename;
                hrefElement.click();
                hrefElement.remove();
                chrome.tabs.insertCSS({file: "ui-on.css"});
            }
        );
    });
}

function addGPSInfo(imgUrl, tabUrl) {
    const urlRegex = tabUrl.match(/.*\/@(.*)\//);
    let urlGeo = urlRegex[1];
    let geoTags = urlGeo.split(',');
    let lat = geoTags[0];
    let lng = geoTags[1];
    gpsIfd = {}
    gpsIfd[piexif.GPSIFD.GPSLatitudeRef] = lat < 0 ? 'S' : 'N';
    gpsIfd[piexif.GPSIFD.GPSLatitude] = piexif.GPSHelper.degToDmsRational(lat);
    gpsIfd[piexif.GPSIFD.GPSLongitudeRef] = lng < 0 ? 'W' : 'E';
    gpsIfd[piexif.GPSIFD.GPSLongitude] = piexif.GPSHelper.degToDmsRational(lng);;
    var exifBytes = piexif.dump({"GPS": gpsIfd});
    var insertedUrl = piexif.insert(exifBytes, imgUrl);
    return insertedUrl;
}
