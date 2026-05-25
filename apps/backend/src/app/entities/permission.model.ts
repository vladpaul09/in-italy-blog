import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { GroupPermission } from "./groupPermission.model";

@Entity({ name: "permissions" })
export class Permission {
  @PrimaryColumn({ type: "varchar", length: 100 })
  codename!: string;

  @Column({ type: "varchar", length: 255 })
  resource!: string;

  @Column({ type: "varchar", length: 100 })
  action!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => GroupPermission, (groupPermission) => groupPermission.permission)
  groupPermissions?: GroupPermission[];
}

