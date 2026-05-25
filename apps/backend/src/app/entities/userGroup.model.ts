import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { User } from "./user.model";
import { Group } from "./group.model";

@Entity({ name: "users_groups" })
export class UserGroup {
  @PrimaryColumn({
    name: "user_id",
    type: "bigint",
    unsigned: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) => (typeof value === "string" ? Number(value) : value),
    },
  })
  userId!: number;

  @PrimaryColumn({
    name: "group_id",
    type: "bigint",
    unsigned: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) => (typeof value === "string" ? Number(value) : value),
    },
  })
  groupId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.userGroups, { onDelete: "CASCADE" })
  user?: User;

  @ManyToOne(() => Group, (group) => group.userGroups, { onDelete: "CASCADE" })
  group?: Group;
}

