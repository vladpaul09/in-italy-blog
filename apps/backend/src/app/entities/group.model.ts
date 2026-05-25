import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";

import { GroupPermission } from "./groupPermission.model";
import { UserGroup } from "./userGroup.model";

@Entity({ name: "groups" })
export class Group {
  @Column({
    type: "bigint",
    unsigned: true,
    primary: true,
    generated: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) => (typeof value === "string" ? Number(value) : value),
    },
  })
  id!: number;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => GroupPermission, (groupPermission) => groupPermission.group)
  groupPermissions?: GroupPermission[];

  @OneToMany(() => UserGroup, (userGroup) => userGroup.group)
  userGroups?: UserGroup[];
}

