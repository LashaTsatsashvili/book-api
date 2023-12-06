import { Entity, Column, OneToMany } from 'typeorm';

import { Base } from './base.entity';
import { Apartment } from './apartment.entity';
import { Key } from './key.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User extends Base {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ type: 'timestamp', nullable: true, default: null })
  verifyAt: Date | null;

  @OneToMany(() => Apartment, (apartment) => apartment.owner)
  apartments: Apartment[]; // Owned apartments

  @OneToMany(() => Key, (key) => key.user)
  keys: Key[]; // Keys to own/other aparments

  @Column({ type: 'timestamp', nullable: true, default: null })
  lastLoginAt: Date | null;

  // @BeforeInsert()
  // async hashPassword() {
  //   // TODO: hash the password
  //   this.password = 'password';
  // }
}
