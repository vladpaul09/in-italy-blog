import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";

import PostScope from "../../entries/postScope.entry";
import { User } from "./user.model";
import { Category } from "./category.model";
import { Municipality } from "./municipality.model";
import { PodcastLanguage } from "./podcastLanguage.model";
import { PodcastCategory } from "./podcastCategory.model";
import { PodcastMunicipality } from "./podcastMunicipality.model";
import { UserAlias } from "./userAlias.model";

@Entity({ name: "podcasts" })
export class Podcast {
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

  @Column({ type: "varchar" })
  slug!: string;

  @Column({ name: "user_id", type: "bigint", unsigned: true })
  userId!: number;

  @Column({ name: "user_review_id", type: "bigint", unsigned: true, nullable: true })
  userReviewId!: number | null;

  @Column({ type: "varchar", nullable: true })
  image!: string | null;

  @Column({ name: "mobile_image", type: "varchar", nullable: true })
  mobileImage!: string | null;

  @Column({ name: "youtube_link", type: "text" })
  youtubeLink!: string;

  @Column({ type: "decimal", precision: 12, scale: 7, nullable: true })
  latitude!: string | null;

  @Column({ type: "decimal", precision: 12, scale: 7, nullable: true })
  longitude!: string | null;

  @Column({ type: "enum", enum: PostScope, default: PostScope.EVERYWHERE })
  scope!: PostScope;

  @Column({ type: "boolean", default: false })
  publish!: boolean;

  @Column({ name: "author_id", type: "bigint", unsigned: true, nullable: true })
  authorId!: number | null;

  @Column({ name: "author_alias_id", type: "bigint", unsigned: true, nullable: true })
  authorAliasId!: number | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => PodcastLanguage, (podcastLanguage) => podcastLanguage.podcast, { cascade: true })
  podcastLanguages?: PodcastLanguage[];

  @ManyToOne(() => User, (user) => user.podcasts, { onDelete: "CASCADE" })
  user?: User;

  @ManyToOne(() => User, (user) => user.reviewedPodcasts, { onDelete: "SET NULL", nullable: true })
  userReview?: User | null;

  @ManyToOne(() => User, (user) => user.authoredPodcasts, { onDelete: "SET NULL", nullable: true })
  author?: User | null;

  @ManyToOne(() => UserAlias, (alias) => alias.podcasts, { onDelete: "SET NULL", nullable: true })
  authorAlias?: UserAlias | null;

  @ManyToMany(() => Category, (category) => category.podcasts)
  @JoinTable({
    name: "podcasts_categories",
    joinColumn: { name: "podcast_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "category_id", referencedColumnName: "id" },
  })
  categories?: Category[];

  @OneToMany(() => PodcastCategory, (podcastCategory) => podcastCategory.podcast)
  podcastCategories?: PodcastCategory[];

  @ManyToMany(() => Municipality, (municipality) => municipality.podcasts)
  @JoinTable({
    name: "podcasts_municipalities",
    joinColumn: { name: "podcast_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "municipality_id", referencedColumnName: "id" },
  })
  municipalities?: Municipality[];

  @OneToMany(() => PodcastMunicipality, (pm) => pm.podcast)
  podcastMunicipalities?: PodcastMunicipality[];
}

