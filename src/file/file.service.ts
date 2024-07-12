import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { writeFile } from 'fs'

@Injectable()
export class FileService {
  async upload(file: Express.Multer.File, path: string) {
    writeFile(path, file.buffer, (err) => {
      if (err) {
        throw new InternalServerErrorException(err)
      }
    })

    return { success: true }
  }
}
