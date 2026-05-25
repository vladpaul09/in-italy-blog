import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { MenuItemType } from "../../entries/menuTypes.entry";
import { MenuItemLanguage } from "./menuItemLanguage.model";
import { Category } from "./category.model";

@Entity({ name: "menu_items" })
export class MenuItem {
  @PrimaryGeneratedColumn({ type: "int" })
  id!: number;

  @Column({ name: "parent_id", type: "bigint", unsigned: true, nullable: true })
  parentId!: number | null;

  @Column({ name: "category_id", type: "bigint", unsigned: true, nullable: true })
  categoryId!: number | null;

  @Column({ type: "varchar", length: 500, nullable: true })
  url!: string | null;

  @Column({ type: "varchar", length: 100, nullable: true })
  icon!: string | null;

  @Column({ type: "enum", enum: MenuItemType })
  type!: MenuItemType;

  @Column({ name: "is_visible", type: "boolean", default: true })
  isVisible!: boolean;

  @Column({ type: "int", default: 0 })
  position!: number;

  @Column({ name: "max_items", type: "int", unsigned: true, default: 3 })
  maxItems!: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @ManyToOne(() => MenuItem, (menuItem) => menuItem.childMenuItems, { onDelete: "SET NULL" })
  parentMenuItem?: MenuItem | null;

  @OneToMany(() => MenuItem, (menuItem) => menuItem.parentMenuItem)
  childMenuItems?: MenuItem[];

  @OneToMany(() => MenuItemLanguage, (menuItemLanguage) => menuItemLanguage.menuItem, { cascade: true })
  menuItemLanguages?: MenuItemLanguage[];

  @ManyToOne(() => Category, (category) => category.menuItems, { onDelete: "SET NULL" })
  category?: Category | null;
}

