import bcrypt from 'bcryptjs';
const users = [
    {
      name: 'Admin User',
      email: 'admin@email.com',
      password: bcrypt.hashSync('123456', 10),
      isAdmin: true,
      phoneNo:'1234567890',
    },

  ];
  
  export default users;