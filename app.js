var BrowserExporter = require('./lib/browser-exporter')({ applicationRoot : __dirname });

var UI = BrowserExporter.withEntryPoint('./test/client.js');

UI.upload();