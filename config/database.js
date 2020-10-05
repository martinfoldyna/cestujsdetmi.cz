module.exports = ({ env }) => ({
  // defaultConnection: 'default',
  // connections: {
  //   default: {
  //     connector: 'mongoose',
  //     settings: {
  //       host: env('DATABASE_HOST', 'cestujsdetmi.r1glt.mongodb.net'),
  //       srv: env.bool('DATABASE_SRV', true),
  //       port: env.int('DATABASE_PORT', 27017),
  //       database: env('DATABASE_NAME', 'cestujsdetmi'),
  //       username: env('DATABASE_USERNAME', 'admin'),
  //       password: env('DATABASE_PASSWORD', 'G2vP8afnCFluBqcM'),
  //     },
  //     options: {
  //       authenticationDatabase: env('AUTHENTICATION_DATABASE', null),
  //       ssl: env.bool('DATABASE_SSL', true),
  //     },
  //   },
  // },
  defaultConnection: "default",
  connections: {
    default: {
      connector: "mongoose",
      settings: {
        uri: "mongodb+srv://admin:G2vP8afnCFluBqcM@cestujsdetmi.r1glt.mongodb.net/cestujsdetmi?retryWrites=true&w=majority"
      },
      options: {
        ssl: true
      }
    }
  }
});

//mongodb+srv://admin:<password>@cestujsdetmi.r1glt.mongodb.net/<dbname>?retryWrites=true&w=majority
