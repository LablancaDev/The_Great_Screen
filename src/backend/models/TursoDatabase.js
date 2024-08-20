// * DATA BASE TURSO

const { createClient } = require('@libsql/client');

require('dotenv').config();

const client = createClient({ 
    url: 'libsql://thegreatscreen-lablancadev.turso.io', 
    apikey: process.env.TURSO_API_KEY
});
console.log('TURSO_API_KEY:', process.env.TURSO_API_KEY);   


const getDb = () => {

    return client
};


module.exports = {
    getDb
};

