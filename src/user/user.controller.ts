import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  UseGuards
} from '@nestjs/common'
import { CreateUserDTO } from './dto/create-user.dto'
import { UpdatePutUserDTO } from './dto/update-put-user.dto'
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto'
import { UserService } from './user.service'
import { ParamId } from 'src/decorators/param-id/param-id.decorator'
import { Roles } from 'src/decorators/role/role.decorator'
import { Role } from 'src/enums/role.enum'
import { RoleGuard } from 'src/guards/role/role.guard'
import { AuthGuard } from 'src/guards/auth/auth.guard'
import { ThrottlerGuard } from '@nestjs/throttler'

@Roles(Role.Admin)
@UseGuards(ThrottlerGuard, AuthGuard, RoleGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.Admin)
  @Post()
  async create(@Body() data: CreateUserDTO) {
    return this.userService.create(data)
  }

  @Roles(Role.Admin)
  @Get()
  async list() {
    return this.userService.list()
  }

  @Get(':id')
  async show(@ParamId() id: number) {
    return this.userService.show(id)
  }

  @Put(':id')
  async update(@Body() data: UpdatePutUserDTO, @ParamId() id: number) {
    return this.userService.update(id, data)
  }

  @Patch(':id')
  async updatePartial(@Body() data: UpdatePatchUserDTO, @ParamId() id: number) {
    return this.userService.updatePartial(id, data)
  }

  @Delete(':id')
  async delete(@ParamId() id: number) {
    return this.userService.delete(id)
  }
}
