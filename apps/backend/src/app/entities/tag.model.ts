import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";

import { TagLanguage } from "./tagLanguage.model";
import { Category } from "./category.model";
import { CategoryTag } from "./categoryTag.model";
import { Member } from "./member.model";
import { MemberTag } from "./memberTag.model";

@Entity({ name: "tags" })
export class Tag {
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

  @Column({ type: "varchar", unique: true })
  slug!: string;

  @Column({ name: "map_marker_image", type: "varchar", nullable: true })
  mapMarkerImage!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => TagLanguage, (tagLanguage) => tagLanguage.tag, { cascade: true })
  tagLanguages?: TagLanguage[];

  @ManyToMany(() => Category, (category) => category.tags)
  @JoinTable({
    name: "categories_tags",
    joinColumn: { name: "tag_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "category_id", referencedColumnName: "id" },
  })
  categories?: Category[];

  @OneToMany(() => CategoryTag, (categoryTag) => categoryTag.tag)
  categoryTags?: CategoryTag[];

  @ManyToMany(() => Member, (member) => member.tags)
  members?: Member[];

  @OneToMany(() => MemberTag, (memberTag) => memberTag.tag)
  memberTags?: MemberTag[];
}

