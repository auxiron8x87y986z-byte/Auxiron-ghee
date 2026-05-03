const mariadb = require('mariadb');
async function test() {
  const pool = mariadb.createPool({ host: 'localhost', user: 'root', password: '', database: 'auxiron' });
  try {
    const conn = await pool.getConnection();
    console.log("mariadb connected successfully!");
    conn.release();
  } catch (err) {
    console.error("mariadb error:", err.message);
  }
  process.exit();
}
test();
