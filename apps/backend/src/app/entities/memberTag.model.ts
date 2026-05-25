import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { Member } from "./member.model";
import { Tag } from "./tag.model";

@Entity({ name: "member_tags" })
export class MemberTag {
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

  @ManyToOne(() => Member, (member) => member.memberTags, { onDelete: "CASCADE" })
  member?: Member;

  @ManyToOne(() => Tag, (tag) => tag.memberTags, { onDelete: "CASCADE" })
  tag?: Tag;
}

