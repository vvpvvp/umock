const config = {
    'mongo': {
    	'uri' : ""
    },
    'pouchdb': {
    },
    'mysql': {
    	'connectionLimit' : 20,
        'host': 'localhost',
        'user':"root",
        'password':"root",
        "database":"mock"
    },
    'port': 8000

};
module.exports = config;