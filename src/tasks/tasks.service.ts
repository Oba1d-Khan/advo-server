import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}
  async createTask(
    createTaskDto: CreateTaskDto,
    user: User,
  ): Promise<{ message: string }> {
    const { title, description } = createTaskDto;

    const task = this.taskRepository.create({
      title,
      description,
      user,
    });

    try {
      await this.taskRepository.save(task);
      // delete task.user;
      return { message: 'Task Created Successfully!' };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findAllTasks(user: User): Promise<Task[]> {
    const tasks = await this.taskRepository.find({
      where: {
        user: { id: user.id },
      },
    });

    return tasks;
  }

  async findSingleTask(id: string): Promise<Task | null> {
    try {
      const fetchedTask = await this.taskRepository.findOneById(id);

      return fetchedTask;
    } catch (error) {
      throw new NotFoundException('Task not found!');
    }
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
