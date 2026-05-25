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

import { Municipality } from "./municipality.model";
import { User } from "./user.model";
import { Category } from "./category.model";
import { EventLanguage } from "./eventLanguage.model";
import { EventCategory } from "./eventCategory.model";
import { UserAlias } from "./userAlias.model";

@Entity({ name: "events" })
export class Event {
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

  @Column({ name: "start_date", type: "datetime" })
  startDate!: Date;

  @Column({ name: "end_date", type: "datetime" })
  endDate!: Date;

  @Column({ type: "decimal", precision: 12, scale: 7, nullable: true })
  latitude!: string | null;

  @Column({ type: "decimal", precision: 12, scale: 7, nullable: true })
  longitude!: string | null;

  @Column({ name: "municipality_id", type: "char", length: 10 })
  municipalityId!: string;

  @Column({ type: "boolean", default: false })
  publish!: boolean;

  @Column({ name: "author_id", type: "bigint", unsigned: true })
  authorId!: number;

  @Column({ name: "author_alias_id", type: "bigint", unsigned: true, nullable: true })
  authorAliasId!: number | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Municipality, (municipality) => municipality.events, { onDelete: "CASCADE" })
  municipality?: Municipality;

  @OneToMany(() => EventLanguage, (eventLanguage) => eventLanguage.event, { cascade: true })
  eventLanguages?: EventLanguage[];

  @ManyToOne(() => User, (user) => user.events, { onDelete: "CASCADE" })
  user?: User;

  @ManyToOne(() => User, (user) => user.reviewedEvents, { onDelete: "SET NULL", nullable: true })
  userReview?: User | null;

  @ManyToOne(() => User, (user) => user.authoredEvents, { onDelete: "CASCADE" })
  author?: User;

  @ManyToOne(() => UserAlias, (alias) => alias.events, { onDelete: "SET NULL", nullable: true })
  authorAlias?: UserAlias | null;

  @ManyToMany(() => Category, (category) => category.events)
  @JoinTable({
    name: "events_categories",
    joinColumn: { name: "event_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "category_id", referencedColumnName: "id" },
  })
  categories?: Category[];

  @OneToMany(() => EventCategory, (eventCategory) => eventCategory.event)
  eventCategories?: EventCategory[];
}

