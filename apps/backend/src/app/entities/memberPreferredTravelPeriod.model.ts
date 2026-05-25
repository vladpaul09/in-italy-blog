import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

import { Member } from "./member.model";
import { PreferredTravelPeriod } from "./preferredTravelPeriod.model";

@Entity({ name: "member_preferred_travel_periods" })
export class MemberPreferredTravelPeriod {
  @PrimaryColumn({ name: "member_id", type: "bigint", unsigned: true })
  memberId!: number;

  @PrimaryColumn({ name: "preferred_travel_period_id", type: "int", unsigned: true })
  preferredTravelPeriodId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Member, (member) => member.memberPreferredTravelPeriods, { onDelete: "CASCADE" })
  @JoinColumn({ name: "member_id" })
  member?: Member;

  @ManyToOne(() => PreferredTravelPeriod, (ptp) => ptp.memberPreferredTravelPeriods, { onDelete: "CASCADE" })
  @JoinColumn({ name: "preferred_travel_period_id" })
  preferredTravelPeriodEntity?: PreferredTravelPeriod;
}

