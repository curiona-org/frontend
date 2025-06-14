import { Account } from "./account";
import { FilteredList } from "./filtered-list";
import {
  PersonalizationOptions,
  SkillLevel,
  TimeUnit,
} from "./personalization-options";
import { Roadmap } from "./roadmap";
import { Topic } from "./topic";

export type Creator = Pick<Account, "id" | "name" | "avatar">;

// (1) definisikan tipe untuk progression summary
export interface RoadmapProgressionSummary {
  total_topics: number;
  finished_topics: number;
  completion_percentage: number;
  is_finished: boolean;
  finished_at: string;
  created_at: string;
  updated_at: string;
}

// (2) bangun tipe summary yang persis sesuai response `/profile/roadmaps`
export type RoadmapSummary = Roadmap & {
  is_bookmarked: boolean;
  progression: RoadmapProgressionSummary;
  personalization_options: PersonalizationOptions;
};

// (3) ganti ListRoadmapsOutput jadi list of RoadmapSummary
export type ListRoadmapsOutput = FilteredList<RoadmapSummary>;

export type GetRoadmapOutput = Roadmap & {
  creator: Creator;
  personalization_options: PersonalizationOptions;
  is_bookmarked: boolean;
  progression: RoadmapProgressionSummary;
  topics: Topic[];
  rating: {
    is_rated: boolean;
    roadmap_id: number;
    progression_total_topics: number;
    progression_total_finished_topics: number;
    rating: number;
    comment: string;
    created_at: string;
    updated_at: string;
  };
};

export type GenerateRoadmapInput = {
  topic: string;
  personalization_options: {
    daily_time_availability: {
      value: number;
      unit: TimeUnit;
    };
    total_duration: {
      value: number;
      unit: TimeUnit;
    };
    skill_level: SkillLevel;
  };
};

export type RegenerateRoadmapInput = {
  reason: string;
  personalization_options: {
    daily_time_availability: {
      value: number;
      unit: TimeUnit;
    };
    total_duration: {
      value: number;
      unit: TimeUnit;
    };
    skill_level: SkillLevel;
  };
};

export type GenerateRoadmapOutput = { slug: string } & RoadmapModerationOuput;

export type RoadmapModerationOuput = {
  flagged: boolean;
  reason: string;
};
