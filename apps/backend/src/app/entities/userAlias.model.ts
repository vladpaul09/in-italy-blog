import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";

import { User } from "./user.model";
import { Article } from "./article.model";
import { Event } from "./event.model";
import { Podcast } from "./podcast.model";

@Entity({ name: "users_aliases" })
export class UserAlias {
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

  @Column({ name: "user_id", type: "bigint", unsigned: true })
  userId!: number;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.aliases, { onDelete: "RESTRICT" })
  user?: User;

  @OneToMany(() => Article, (article) => article.authorAlias)
  articles?: Article[];

  @OneToMany(() => Event, (event) => event.authorAlias)
  events?: Event[];

  @OneToMany(() => Podcast, (podcast) => podcast.authorAlias)
  podcasts?: Podcast[];
}

