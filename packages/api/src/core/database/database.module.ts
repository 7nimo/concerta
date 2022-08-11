/* eslint-disable @typescript-eslint/no-var-requires */
import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import databaseConfig from '../etc/database.config';
import { CsvParserFactory } from '../common/factories/csv-parser.factory';

@Module({
  providers: [ConfigService, SeederService, CsvParserFactory],
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot({ load: [databaseConfig] })],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        Object.assign(configService.get<DataSourceOptions>('database'), {
          autoLoadEntities: true,
        }),
    }),
  ],
  exports: [TypeOrmModule, SeederService],
})
export class DatabaseModule {}
