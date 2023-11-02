import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './models/user.entity';
import { AbstractService } from 'src/common/abstract.service';
import { PaginatedResult } from 'src/common/paginated-result.interface';

@Injectable()
export class UserService extends AbstractService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  //paginate
  async paginate(page = 1): Promise<PaginatedResult> {
    const { data, meta } = await super.paginate(page);

    const take = 15;

    return {
      data: data.map((user) => {
        const { password, ...data } = user;
        return data;
      }),
      meta,
    };
  }
}
