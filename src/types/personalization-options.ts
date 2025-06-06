export type PersonalizationOptions = {
  daily_time_availability: DailyTimeAvailability;
  total_duration: DailyTimeAvailability;
  skill_level: SkillLevel;
  additional_info: string;
};

export type TimeUnit = "months" | "weeks" | "days" | "hours" | "minutes";
export type SkillLevel = "beginner" | "intermediate" | "advanced";

export type DailyTimeAvailability = {
  value: number;
  unit: TimeUnit;
};

export default PersonalizationOptions;
