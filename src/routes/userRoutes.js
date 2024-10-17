const pool = require("../utils/connectDB");

async function test() {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT * FROM users");
    console.log(rows);
  } catch (error) {
    console.error("error", error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = test;
