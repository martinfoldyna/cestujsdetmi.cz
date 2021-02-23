module.exports = {
  jwtSecret: process.env.JWT_SECRET || '9d1c0b69-c049-4fcc-a889-36e6ae8b7a04',
  jwt: {
    expiresIn: "3600s"
  }
};
