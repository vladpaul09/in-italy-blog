import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { Member } from "./member.model";
import { Category } from "./category.model";

@Entity({ name: "member_categories" })
export class MemberCategory {
  @PrimaryColumn({
    name: "member_id",
    type: "bigint",
    unsigned: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) => (typeof value === "string" ? Number(value) : value),
    },
  })
  memberId!: number;

  @PrimaryColumn({
    name: "category_id",
    type: "bigint",
    unsigned: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) => (typeof value === "string" ? Number(value) : value),
    },
  })
  categoryId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Member, (member) => member.memberCategories, { onDelete: "CASCADE" })
  member?: Member;

  @ManyToOne(() => Category, (category) => category.memberCategories, { onDelete: "CASCADE" })
  category?: Category;
}

