import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { User } from "./user.model";
import { Municipality } from "./municipality.model";

@Entity({ name: "users_municipalities" })
export class UserMunicipality {
  @PrimaryColumn({ name: "municipality_id", type: "char", length: 10 })
  municipalityId!: string;

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

  @ManyToOne(() => Municipality, (municipality) => municipality.userMunicipalities, { onDelete: "CASCADE" })
  municipality?: Municipality;

  @ManyToOne(() => User, (user) => user.userMunicipalities, { onDelete: "CASCADE" })
  user?: User;
}

