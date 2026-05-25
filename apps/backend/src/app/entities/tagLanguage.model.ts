import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { Tag } from "./tag.model";
import { Language } from "./language.model";

@Entity({ name: "tags_languages" })
export class TagLanguage {
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

  @ManyToOne(() => Tag, (tag) => tag.tagLanguages, { onDelete: "CASCADE" })
  tag?: Tag;

  @ManyToOne(() => Language, (language) => language.tagLanguages, { onDelete: "CASCADE" })
  language?: Language;
}

