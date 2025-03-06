import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async createTask(taskData: Partial<Task>): Promise<TaskDocument> {
    const task = new this.taskModel(taskData);
    return task.save();
  }

  /**
   * Obtiene las tareas de un usuario con filtros opcionales:
   *  - createdAt: filtra por fecha de creación >= la fecha dada
   *  - dueDate: filtra por fecha de vencimiento >= la fecha dada
   *  - tags: filtra si las etiquetas de la tarea incluyen al menos una de las dadas
   */
  async getTasksByUser(userId: string, filters?: any): Promise<TaskDocument[]> {
    const query: any = { user: userId };

    // Filtrar por fecha de creación (ej. '2025-02-23')
    if (filters.createdAt) {
      // Suponiendo que quieras filtrar las tareas creadas a partir de esa fecha
      query.createdAt = { $gte: new Date(filters.createdAt) };
    }

    // Filtrar por fecha de vencimiento
    if (filters.dueDate) {
      query.dueDate = { $gte: new Date(filters.dueDate) };
    }

    // Filtrar por etiquetas separadas por comas (ej. 'hogar,personal')
    if (filters.tags) {
      const tagsArray = filters.tags.split(',').map((t: string) => t.trim());
      query.tags = { $in: tagsArray };
    }

    return this.taskModel.find(query).exec();
  }

  async getTaskById(taskId: string): Promise<TaskDocument> {
    const task = await this.taskModel.findById(taskId).exec();
    if (!task) {
      throw new NotFoundException('Tarea no encontrada');
    }
    return task;
  }

  async updateTask(taskId: string, userId: string, updateData: Partial<Task>): Promise<TaskDocument> {
    const task = await this.getTaskById(taskId);
    if (task.user.toString() !== userId) {
      throw new ForbiddenException('No tienes permiso para modificar esta tarea');
    }
    Object.assign(task, updateData);
    return task.save();
  }

  async deleteTask(taskId: string, userId: string): Promise<TaskDocument> {
    const task = await this.getTaskById(taskId);
    if (task.user.toString() !== userId) {
      throw new ForbiddenException('No tienes permiso para eliminar esta tarea');
    }
    const deletedTask = await this.taskModel.findByIdAndDelete(taskId).exec();
    if (!deletedTask) {
      throw new NotFoundException('Tarea no encontrada');
    }
    return deletedTask;
  }
}
