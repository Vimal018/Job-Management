import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

async create(createJobDto: CreateJobDto) {
  const { salaryMin, salaryMax, ...rest } = createJobDto;
  const salaryRange = `₹${salaryMin} - ₹${salaryMax}`;

  return this.prisma.job.create({
    data: {
      ...rest,
      salaryRange,
      applicationDeadline: new Date(createJobDto.applicationDeadline), // ✅ Fix here
    },
  });
}



  findAll() {
    return this.prisma.job.findMany();
  }

  async findOne(id: string) {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async update(id: string, updateJobDto: UpdateJobDto) {
    await this.findOne(id); // To throw error if not exists
    return this.prisma.job.update({
      where: { id },
      data: updateJobDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // To throw error if not exists
    return this.prisma.job.delete({ where: { id } });
  }
}
