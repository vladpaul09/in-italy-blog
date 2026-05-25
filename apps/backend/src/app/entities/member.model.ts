import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";

import {
  AgeRangeEnum,
  AverageBudgetEnum,
  AverageStayDurationEnum,
  CountryEnum,
  FamilySituationEnum,
  GenderEnum,
  PreferredTravelPeriodEnum,
  TravelCompanionEnum,
  TravelFrequencyEnum,
} from "../../entries/memberEnums.entry";
import { Region } from "./region.model";
import { Municipality } from "./municipality.model";
import { Category } from "./category.model";
import { Tag } from "./tag.model";
import { MemberCategory } from "./memberCategory.model";
import { MemberTag } from "./memberTag.model";
import { MemberPreferredTravelPeriod } from "./memberPreferredTravelPeriod.model";
import { PreferredTravelPeriod } from "./preferredTravelPeriod.model";

@Entity({ name: "members" })
export class Member {
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

  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 100 })
  password!: string;

  @Column({ type: "enum", enum: CountryEnum })
  country!: CountryEnum;

  @Column({ name: "region_id", type: "char", length: 2, nullable: true })
  regionId!: string | null;

  @Column({ name: "municipality_id", type: "char", length: 10, nullable: true })
  municipalityId!: string | null;

  @Column({ type: "varchar", length: 20, nullable: true })
  phone!: string | null;

  @Column({ type: "enum", enum: GenderEnum, nullable: true })
  gender!: GenderEnum | null;

  @Column({ name: "age_range", type: "enum", enum: AgeRangeEnum, nullable: true })
  ageRange!: AgeRangeEnum | null;

  @Column({ name: "family_situation", type: "enum", enum: FamilySituationEnum, nullable: true })
  familySituation!: FamilySituationEnum | null;

  @Column({ name: "travel_companion", type: "enum", enum: TravelCompanionEnum, nullable: true })
  travelCompanion!: TravelCompanionEnum | null;

  @Column({ name: "travel_frequency", type: "enum", enum: TravelFrequencyEnum, nullable: true })
  travelFrequency!: TravelFrequencyEnum | null;

  @Column({ name: "average_stay_duration", type: "enum", enum: AverageStayDurationEnum, nullable: true })
  averageStayDuration!: AverageStayDurationEnum | null;

  @Column({ name: "average_budget", type: "enum", enum: AverageBudgetEnum, nullable: true })
  averageBudget!: AverageBudgetEnum | null;

  @Column({ name: "personalized_content_consent", type: "boolean", default: false })
  personalizedContentConsent!: boolean;

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive!: boolean;

  @Column({ name: "email_confirmation_token", type: "varchar", length: 255, nullable: true })
  emailConfirmationToken!: string | null;

  @Column({ name: "password_reset_token", type: "varchar", length: 255, nullable: true })
  passwordResetToken!: string | null;

  @Column({ name: "password_reset_token_expires_at", type: "datetime", nullable: true })
  passwordResetTokenExpiresAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Region, (region) => region.members, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "region_id" })
  region?: Region | null;

  @ManyToOne(() => Municipality, (municipality) => municipality.members, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "municipality_id" })
  municipality?: Municipality | null;

  @ManyToMany(() => Category, (category) => category.members)
  @JoinTable({
    name: "member_categories",
    joinColumn: { name: "member_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "category_id", referencedColumnName: "id" },
  })
  categories?: Category[];

  @OneToMany(() => MemberCategory, (memberCategory) => memberCategory.member)
  memberCategories?: MemberCategory[];

  @ManyToMany(() => Tag, (tag) => tag.members)
  @JoinTable({
    name: "member_tags",
    joinColumn: { name: "member_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "tag_id", referencedColumnName: "id" },
  })
  tags?: Tag[];

  @OneToMany(() => MemberTag, (memberTag) => memberTag.member)
  memberTags?: MemberTag[];

  @OneToMany(() => MemberPreferredTravelPeriod, (mptp) => mptp.member)
  memberPreferredTravelPeriods?: MemberPreferredTravelPeriod[];

  @ManyToMany(() => PreferredTravelPeriod, (ptp) => ptp.memberPreferredTravelPeriods)
  @JoinTable({
    name: "member_preferred_travel_periods",
    joinColumn: { name: "member_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "preferred_travel_period_id", referencedColumnName: "id" },
  })
  preferredTravelPeriods?: PreferredTravelPeriod[];
}

