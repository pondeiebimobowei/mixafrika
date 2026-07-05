import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { Dialect } from 'sequelize';

const requiredConfig = <T = string>(
  configService: ConfigService,
  key: string,
): T => {
  const value = configService.get<T>(key);
  if (value === undefined || value === '') {
    throw new Error(
      `Missing ${key}. Copy .env.test.example to .env.test for test commands, or set ${key} in the active environment.`,
    );
  }
  return value;
};

export const getSequelizeConfig = (
  configService: ConfigService,
): SequelizeModuleOptions => {
  const databaseSsl = configService.get<string>('DB_SSL') === 'true';
  const rejectUnauthorized = configService.get<string>('DB_SSL_REJECT_UNAUTHORIZED') !== 'false';

  const baseConfig: SequelizeModuleOptions = {
    database: requiredConfig(configService, 'DB_NAME'),
    username: requiredConfig(configService, 'DB_USER'),
    password: requiredConfig(configService, 'DB_PASS'),
    host: requiredConfig(configService, 'DB_HOST'),
    port: Number(requiredConfig(configService, 'DB_PORT')),
    dialect: requiredConfig<Dialect>(configService, 'DB_DIALECT'),
    autoLoadModels: true,
    synchronize: false,
    logging: false,
    pool:{
      max:50,
      min: 5,
      acquire: 30000,
      idle: 10000
    }
  };

  const sequelizeConfig: any = { ...baseConfig };

  if (databaseSsl) {
    sequelizeConfig.dialectOptions = {
      ssl: {
        require: true,
        rejectUnauthorized,
      },
    };
  }

  return sequelizeConfig;
};
