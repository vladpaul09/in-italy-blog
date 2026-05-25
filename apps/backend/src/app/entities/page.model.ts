import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";

import { PageLanguage } from "./pageLanguage.model";

@Entity({ name: "pages" })
export class Page {
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

  @Column({ type: "varchar", length: 100, unique: true })
  slug!: string;

  @Column({ type: "boolean", default: false })
  publish!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => PageLanguage, (pageLanguage) => pageLanguage.page, { cascade: true })
  pageLanguages?: PageLanguage[];
}

