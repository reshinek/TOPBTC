/**
 * Created by 12 on 2017/7/3.
 */
const query = require('../utils/utils')

const router = (req, res) => {
  const id = req.query.id;
  const type = req.query.type;

  if(type == 'data'){
    query(`select * from COIN where COINID='${id}'`, [1], (err, results, fields) => {
      if (err) throw err
      res.send(results[0])
    })
  }else if(type == 'info'){
    query(`select * from COININFO where COINID='${id}'`, [1], (err, results, fields) => {
      if (err) throw err
      res.send(results[0])
    })
  }

  //var sql = "select * from COIN where COINID='" + id +"'";

}

module.exports = router
