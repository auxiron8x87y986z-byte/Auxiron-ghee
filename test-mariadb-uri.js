const mariadb = require('mariadb');
async function test() {
  const pool = mariadb.createPool("mariadb://root@localhost:3306/auxiron");
  try {
    const conn = await pool.getConnection();
    console.log("Connected successfully via mariadb:// URI!");
    conn.release();
  } catch (err) {
    console.error("Error connecting via URI:", err);
  }
  process.exit(0);
}
test();
