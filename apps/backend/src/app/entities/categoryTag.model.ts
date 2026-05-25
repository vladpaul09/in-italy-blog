import {
  Entity,
  ManyToOne,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { Category } from "./category.model";
import { Tag } from "./tag.model";

@Entity({ name: "categories_tags" })
export class CategoryTag {
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

  @PrimaryColumn({
    name: "tag_id",
    type: "bigint",
    unsigned: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) => (typeof value === "string" ? Number(value) : value),
    },
  })
  tagId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Category, (category) => category.categoryTags, { onDelete: "CASCADE" })
  category?: Category;

  @ManyToOne(() => Tag, (tag) => tag.categoryTags, { onDelete: "CASCADE" })
  tag?: Tag;
}

