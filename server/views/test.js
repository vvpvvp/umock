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


function getObj(obj, path) {
  var paths = path.split(".");
  while (paths.length > 0) {
    if (obj == undefined || obj[paths[0]] == undefined) {
      return undefined;
    }
    obj = obj[paths[0]];
    paths.shift();
  }
  return obj;
}

console.log(getObj({
  a: {
    b: {
      d: 3
    }
  }
}, "a.b.d"));
