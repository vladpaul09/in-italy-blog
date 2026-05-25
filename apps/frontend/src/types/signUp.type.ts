import {
  AgeRangeEnum,
  AverageBudgetEnum,
  PreferredTravelPeriodEnum,
  AverageStayDurationEnum,
  TravelFrequencyEnum,
  TravelCompanionEnum,
  FamilySituationEnum,
  GenderEnum,
  CountryEnum,
} from "@/entries/memberEnums.entry";

type municipalityValueType = { id: string; name: string; url: string };

export type signUpForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  country: CountryEnum | string;
  municipality?: municipalityValueType;
  gender?: GenderEnum;
  ageRange?: AgeRangeEnum;
  familySituation?: FamilySituationEnum;
  travelCompanion?: TravelCompanionEnum;
  travelFrequency?: TravelFrequencyEnum;
  travelInterests: Array<number>;
  articleInterests: Array<number>;
  eventsInterests: Array<number>;
  averageStay?: AverageStayDurationEnum;
  preferredTravelPeriod?: PreferredTravelPeriodEnum[];
  averageBudget?: AverageBudgetEnum;
  privacyConsent: boolean;
};
