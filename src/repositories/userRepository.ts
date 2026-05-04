import myDataSource from '../data-source';
import { User } from '../entity/User';

export const userRepository = myDataSource.getRepository(User).extend({
  findByEmail(email: string) {
    return this.findOneBy({ email });
  },
});
