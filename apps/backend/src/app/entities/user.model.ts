import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";

import { UserGroup } from "./userGroup.model";
import { UserRegion } from "./userRegion.model";
import { UserProvince } from "./userProvince.model";
import { UserMunicipality } from "./userMunicipality.model";
import { UserAlias } from "./userAlias.model";
import { Article } from "./article.model";
import { Event } from "./event.model";
import { Podcast } from "./podcast.model";
import { Category } from "./category.model";

@Entity({ name: "users" })
export class User {
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

  @Column({ name: "first_name", type: "varchar", length: 100 })
  firstName!: string;

  @Column({ name: "last_name", type: "varchar", length: 100 })
  lastName!: string;

  @Column({ type: "varchar", length: 100 })
  password!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  @Column({ name: "is_super_user", type: "boolean", default: false })
  isSuperUser!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => UserAlias, (alias) => alias.user, { cascade: true })
  aliases?: UserAlias[];

  @OneToMany(() => UserGroup, (userGroup) => userGroup.user)
  userGroups?: UserGroup[];

  @OneToMany(() => UserRegion, (userRegion) => userRegion.user)
  userRegions?: UserRegion[];

  @OneToMany(() => UserProvince, (userProvince) => userProvince.user)
  userProvinces?: UserProvince[];

  @OneToMany(() => UserMunicipality, (userMunicipality) => userMunicipality.user)
  userMunicipalities?: UserMunicipality[];

  @OneToMany(() => Article, (article) => article.user)
  articles?: Article[];

  @OneToMany(() => Article, (article) => article.userReview)
  reviewedArticles?: Article[];

  @OneToMany(() => Article, (article) => article.author)
  authoredArticles?: Article[];

  @OneToMany(() => Event, (event) => event.user)
  events?: Event[];

  @OneToMany(() => Event, (event) => event.userReview)
  reviewedEvents?: Event[];

  @OneToMany(() => Event, (event) => event.author)
  authoredEvents?: Event[];

  @OneToMany(() => Podcast, (podcast) => podcast.user)
  podcasts?: Podcast[];

  @OneToMany(() => Podcast, (podcast) => podcast.userReview)
  reviewedPodcasts?: Podcast[];

  @OneToMany(() => Podcast, (podcast) => podcast.author)
  authoredPodcasts?: Podcast[];

  @OneToMany(() => Category, (category) => category.user)
  categories?: Category[];
}

