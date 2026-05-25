import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { User } from "./user.model";
import { Province } from "./province.model";

@Entity({ name: "users_provinces" })
export class UserProvince {
  @PrimaryColumn({ name: "province_id", type: "char", length: 4 })
  provinceId!: string;

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

  @ManyToOne(() => Province, (province) => province.userProvinces, { onDelete: "CASCADE" })
  province?: Province;

  @ManyToOne(() => User, (user) => user.userProvinces, { onDelete: "CASCADE" })
  user?: User;
}

