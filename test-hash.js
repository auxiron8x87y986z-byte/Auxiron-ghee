const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('admin123', 10);
console.log("Newly generated hash:", hash);
console.log("Does admin123 match old hash?", bcrypt.compareSync('admin123', '$2b$10$mGOetiaalgIMSaAY2l1Yhulv1Ch9zy/sXcefFmEQLZtwNvDwESmMK'));
