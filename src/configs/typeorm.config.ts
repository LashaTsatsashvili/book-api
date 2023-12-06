// import { Injectable } from '@nestjs/common';
// import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { ConfigService } from '@nestjs/config';
// import { User } from "../entities";
//
// @Injectable()
// export class TypeOrmConfigService implements TypeOrmOptionsFactory {
//   constructor(private config: ConfigService) {}
//
//   public createTypeOrmOptions(): TypeOrmModuleOptions {
//     return {
//       type: 'mysql',
//       host: this.config.get<string>('DATABASE_HOST'),
//       port: this.config.get<number>('DATABASE_PORT'),
//       database: this.config.get<string>('DATABASE_NAME'),
//       username: this.config.get<string>('DATABASE_USER'),
//       password: this.config.get<string>('DATABASE_PASSWORD'),
//       entities: [User],
//       migrations: [],
//       // entities: ["src/**/*.entity.ts"],
//       // migrations: ['src/migrations/*{.ts,.js}'],
//     };
//   }
// }
