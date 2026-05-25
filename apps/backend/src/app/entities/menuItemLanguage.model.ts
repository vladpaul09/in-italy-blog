import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { MenuItem } from "./menuItem.model";
import { Language } from "./language.model";

@Entity({ name: "menu_item_languages" })
export class MenuItemLanguage {
  @PrimaryColumn({ name: "menu_item_id", type: "int" })
  menuItemId!: number;

  @PrimaryColumn({ name: "language_id", type: "varchar", length: 10 })
  languageId!: string;

  @Column({ type: "varchar", length: 100 })
  title!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @ManyToOne(() => MenuItem, (menuItem) => menuItem.menuItemLanguages, { onDelete: "CASCADE" })
  menuItem?: MenuItem;

  @ManyToOne(() => Language, (language) => language.menuItemLanguages, { onDelete: "CASCADE" })
  language?: Language;
}

