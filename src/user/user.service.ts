import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDTO } from './dto/create-user.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { UpdatePutUserDTO } from './dto/update-put-user.dto'
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto'
import { genSalt, hash } from 'bcrypt'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDTO) {
    const salt = await genSalt()

    data.password = await hash(data.password, salt)

    return this.prisma.user.create({
      data: { ...data, birthAt: data.birthAt ? new Date(data.birthAt) : null }
    })
  }

  async list() {
    return this.prisma.user.findMany()
  }

  async show(id: number) {
    await this.exists(id)

    return this.prisma.user.findUnique({
      where: {
        id
      }
    })
  }

  async update(id: number, data: UpdatePutUserDTO) {
    await this.exists(id)

    const salt = await genSalt()

    data.password = await hash(data.password, salt)

    return this.prisma.user.update({
      data: { ...data, birthAt: data.birthAt ? new Date(data.birthAt) : null },
      where: {
        id
      }
    })
  }

  async updatePartial(id: number, data: UpdatePatchUserDTO) {
    await this.exists(id)

    if (data.password) {
      const salt = await genSalt()

      data.password = await hash(data.password, salt)
    }

    return this.prisma.user.update({
      data: { ...data, birthAt: data.birthAt ? new Date(data.birthAt) : null },
      where: {
        id
      }
    })
  }

  async delete(id: number) {
    await this.exists(id)

    return this.prisma.user.delete({
      where: {
        id
      }
    })
  }

  async exists(id: number) {
    if (!(await this.prisma.user.count({ where: { id } }))) {
      throw new NotFoundException(`O usuário ${id} não existe`)
    }
  }
}
