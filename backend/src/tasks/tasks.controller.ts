import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  async createTask(
    @Body() body: { title: string; description: string; dueDate?: Date; tags?: string[] },
    @Request() req,
  ) {
    const taskData = {
      ...body,
      user: req.user.userId,
    };
    return this.tasksService.createTask(taskData);
  }

  /**
   * GET /tasks
   * Permite filtrar por createdAt, dueDate, tags
   * Ejemplo: /tasks?createdAt=2025-02-23&dueDate=2025-03-01&tags=hogar,personal
   */
  @Get()
  async getTasks(@Query() query, @Request() req) {
    return this.tasksService.getTasksByUser(req.user.userId, query);
  }

  @Get(':id')
  async getTask(@Param('id') id: string) {
    return this.tasksService.getTaskById(id);
  }

  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body()
    body: Partial<{
      title: string;
      description: string;
      dueDate?: Date;
      completed?: boolean;
      tags?: string[];
    }>,
    @Request() req,
  ) {
    return this.tasksService.updateTask(id, req.user.userId, body);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string, @Request() req) {
    return this.tasksService.deleteTask(id, req.user.userId);
  }
}
