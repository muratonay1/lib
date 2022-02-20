const cron = require('node-cron');
var Cron = {

    init: function() {

    },
    render: function() {

    },
    setTimeZone: function() {
        cron.schedule('47 9 * * *', function() {
            console.log('running a task every minute');
        });
    }
}