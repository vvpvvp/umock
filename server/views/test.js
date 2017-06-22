// var db = new PouchDB('dbname');

// db.put({
//   _id: 'dave@gmail.com',
//   name: 'David',
//   age: 69
// });

// db.changes().on('change', function() {
//   console.log('Ch-Ch-Changes');
// });

// db.replicate.to('http://example.com/mydb');


// function getObj(obj, path) {
//   var paths = path.split(".");
//   while (paths.length > 0) {
//     if (obj == undefined || obj[paths[0]] == undefined) {
//       return undefined;
//     }
//     obj = obj[paths[0]];
//     paths.shift();
//   }
//   return obj;
// }

// console.log(getObj({
//   a: {
//     b: {
//       d: 3
//     }
//   }
// }, "a.b.d"));

var request = require('request');
request('http://petstore.swagger.io/v2/swagger.json', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred 
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
  let api = JSON.parse(body);
  console.log('body:', api); // Print the HTML for the Google homepage. 
});

