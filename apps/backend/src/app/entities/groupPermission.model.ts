import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { Group } from "./group.model";
import { Permission } from "./permission.model";

@Entity({ name: "groups_permissions" })
export class GroupPermission {
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

  @PrimaryColumn({ name: "permission_codename", type: "varchar", length: 100 })
  permissionCodename!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Group, (group) => group.groupPermissions, { onDelete: "CASCADE" })
  group?: Group;

  @ManyToOne(() => Permission, (permission) => permission.groupPermissions, { onDelete: "CASCADE" })
  permission?: Permission;
}

