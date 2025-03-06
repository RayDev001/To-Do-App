import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/todo-app', {
      // Opciones adicionales si se requieren
    }),
    AuthModule,
    UsersModule,
    TasksModule,
  ],
})
export class AppModule {}
