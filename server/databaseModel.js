var app = global.app;


var init = function (db) {
  const config = global.config;
  if (config['mysql']) {
    const mysqlConfig = config['mysql'];

    app.get('/umock/databaseModel', (req, res, next) => {
      if (!req.query.tablename) {
        res.send(Result.defaultError("请传递表名"));
        return;
      }
      var tableRowSql = `select column_name columnname,data_type datatype,character_maximum_length length from information_schema.columns where table_name='${req.query.tablename}' and table_schema = '${mysqlConfig.database}'`;
      
      // console.log(tableRowSql);
      db.query(tableRowSql, function (err, rows, fields) {
        if (err) {
          console.log(err);
          res.send(Result.defaultError("查询失败"));
        } else {

          const number = "TINYINT, SMALLINT, MEDIUMINT, INT, INTEGER, BIGINT, FLOAT, DOUBLE, DECIMAL,";
          const string = "CHAR, VARCHAR, TINYBLOB, TINYTEXT, BLOB, TEXT, MEDIUMBLOB, MEDIUMTEXT, LOGNGBLOB, LONGTEXT, VARBINARY, BINARY,";
          const date = "DATE, TIME, YEAR, DATETIME, TIMESTAMP,";
          
          var tableSchema = {};
          for (var r of rows) {
          	var value = {type:"Model.DATE"},datatype = (r.datatype+",").toUpperCase();
          	if(number.indexOf(datatype)!=-1){
          		value = 0;
          	}else if(string.indexOf(datatype)!=-1){
          		value = "";
          	}
          	tableSchema[r.columnname] = value;
          }
          res.json({
          	rows:rows,
          	model:tableSchema
          });
        }
      });
    });

  }
}


module.exports = init;
