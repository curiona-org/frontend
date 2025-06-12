export type GetProfileOutput = {
  id: number;
  method: string;
  email: string;
  name: string;
  avatar: string;
  joined_at: Date;
  statistics: {
    total_generated_roadmaps: number;
    total_in_progress_roadmaps: number;
    total_finished_roadmaps: number;
    total_bookmarked_roadmaps: number;
  };
};

export type UpdateProfileOutput = {
  name: string;
  avatar: string;
  updated_at: Date;
};
