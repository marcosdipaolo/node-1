import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

export type UserRole = 'user' | 'admin';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Index({ unique: true })
  @Column('varchar', { name: 'email' })
  email!: string;

  @Column('varchar', { name: 'name' })
  name!: string;

  @Column('varchar', { name: 'password' })
  password!: string;

  @Column('enum', {
    name: 'role',
    enum: ['user', 'admin'],
    default: 'user',
  })
  role!: UserRole;
}
