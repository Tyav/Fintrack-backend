const Admin = require('./app/models/admin.model');

async function createAdmin() {
  let admin;
  try {
    admin = new Admin({
      name: 'James',
      email: 'James1@gmail.com',
      phone: '3434234234',
      role: 2,
      password: '1234567890'
    });
    await admin.save();
    console.log({ admin: admin.transformUser(), accessToken: admin.token() });
  } catch (error) {
    admin = await Admin.loginAndGenerateToken({
      email: 'James1@gmail.com',
      password: '1234567890'
    });
    console.log(admin);
  }
}

createAdmin();

module.exports = {};
