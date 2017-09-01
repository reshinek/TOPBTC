/**
 * Created by 12 on 2017/7/3.
 */
const query = require('../utils/utils');

/**
*query type
*==1 get all markets by COINID
*==2 get all coins by markets
*==3 get all market by market pair
*/
const router = (req, res) => {
  var type = req.query.type;
  var id = req.query.id;
  var bvalidparam = true;
  if(type && id){
    var sql = "select * from MARKET";
    switch (type) {
      case "1":
        sql = sql + " where COINID='"+ id +"'";
        break;
      case "2":
      sql = sql + " where EXCHANGEID='"+ id +"'";
      break;
      case "3":
      id = id.replace('-','/');
      sql = sql + " where PAIR='"+ id +"'";
      break;
      default:bvalidparam = false
    }
    sql += " order by VOLUME desc"
    if(bvalidparam){
      query(sql, [1], (err, results, fields) => {
        if (err) throw err
        res.send(results)
      })
    }
    else{
      res.send([])
    }

  }else{
    res.send([])
  }

}

module.exports = router
