import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { Category } from "./category.model";
import { Language } from "./language.model";

@Entity({ name: "categories_languages" })
export class CategoryLanguage {
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

  @PrimaryColumn({ name: "language_id", type: "varchar", length: 10 })
  languageId!: string;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "text" })
  description!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Category, (category) => category.categoryLanguages, { onDelete: "CASCADE" })
  category?: Category;

  @ManyToOne(() => Language, (language) => language.categoryLanguages, { onDelete: "CASCADE" })
  language?: Language;
}

