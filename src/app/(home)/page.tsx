import {
  listCommunityRoadmaps,
  listUserRoadmaps,
} from "@/app/roadmap/[slug]/actions";
import { auth } from "@/lib/auth";
import HomeAuthenticated from "@/screens/home/authenticated";
import HomeGuest from "@/screens/home/guest";

export default async function HomePage() {
  const session = await auth();
  const communityRoadmaps = await listCommunityRoadmaps({
    orderBy: "newest",
  });

  if (!session) {
    return <HomeGuest communityRoadmaps={communityRoadmaps.data} />;
  }

  const userRoadmaps = await listUserRoadmaps({
    orderBy: "newest",
  });

  return (
    <HomeAuthenticated
      communityRoadmaps={communityRoadmaps.data}
      userRoadmaps={userRoadmaps.data}
    />
  );
}
