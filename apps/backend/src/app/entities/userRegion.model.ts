import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { User } from "./user.model";
import { Region } from "./region.model";

@Entity({ name: "users_regions" })
export class UserRegion {
  @PrimaryColumn({ name: "region_id", type: "char", length: 2 })
  regionId!: string;

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

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Region, (region) => region.userRegions, { onDelete: "CASCADE" })
  region?: Region;

  @ManyToOne(() => User, (user) => user.userRegions, { onDelete: "CASCADE" })
  user?: User;
}

