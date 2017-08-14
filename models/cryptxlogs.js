var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CryptXLogsSchema = new Schema({
    username: String,
    level: Number,
    answer: String,
    time: {
      type: Date,
    }
});


var CryptXLogs = mongoose.model('CryptXLogs', CryptXLogsSchema);
module.exports = CryptXLogs;
