import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      // 2. Load it globally
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite', // The database type
      database: 'taskflow.db', // The name of the file
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Find your entities
      synchronize: true, // Auto-creates DB tables from your entities (DEV ONLY)
    }),
    AuthModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
