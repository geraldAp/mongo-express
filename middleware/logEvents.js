const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (message, logName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        // one directory up thus ''
        if (!fs.existsSync(path.join(__dirname,'..' , 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, 'logs'));
        }

        await fsPromises.appendFile(path.join(__dirname,'..', 'logs', logName), logItem);
    } catch (err) {
        console.log(err);
    }
}

const logger = (req, res, next) => {
    // taking two parameters and args the first the message and the second what the message should be written into 
    logEvents(`${req.method} \t ${req.url} \t ${req.ip}\t ${req.headers.origin}`, 'reqLog.txt');
    console.log(req.method, req.url, req.ip, req.path);
    next();
  }

module.exports = {logger , logEvents};
