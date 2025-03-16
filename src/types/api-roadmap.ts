import { Account } from "./account";
import { FilteredList } from "./filtered-list";
import { PersonalizationOptions } from "./personalization-options";
import { Roadmap } from "./roadmap";
import { Topic } from "./topic";

export type Creator = Pick<Account, "id" | "name" | "avatar">;

export type GetRoadmapOutput = Roadmap & {
  creator: Creator;
  personalization_options: PersonalizationOptions;
  topics: Topic[];
};

export type ListRoadmapsOutput = FilteredList<
  Roadmap & {
    personalization_options: PersonalizationOptions;
  }
>;
