require('ts-node/register');

const requiredEnv = (name) => {
  const value = process.env[name];
  if (value === undefined || value === '') {
    throw new Error(
      `Missing ${name}. Copy .env.test.example to .env.test for test commands, or set ${name} in the active environment.`,
    );
  }
  return value;
};

const databaseConfig = () => ({
  username: requiredEnv('DB_USER'),
  password: requiredEnv('DB_PASS'),
  database: requiredEnv('DB_NAME'),
  host: requiredEnv('DB_HOST'),
  port: Number(requiredEnv('DB_PORT')),
  seederStorage: 'sequelize',
  dialect: requiredEnv('DB_DIALECT'),
});

const sslEnabled = process.env.DB_SSL === 'true';
const rejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false';

const development= {
  ...databaseConfig(),
//   dialectOptions: {
//       ssl: {
//           require: true,
//           rejectUnauthorized: false,
//       }
//   }
}

const test = {
    ...databaseConfig(),
    // dialectOptions: {
    //     ssl: {
    //         require: true,
    //         rejectUnauthorized: false,
    //     }
    // }
}

const production = {
  ...databaseConfig(),
  ...(sslEnabled
    ? {
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized,
          },
        },
      }
    : {}),
};

module.exports = {
  production,
  test,
  development,
};
