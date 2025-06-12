import { getProfile } from "@/app/profile/actions";
import ProfileDetails from "@/components/profile/profile-details";
import { notFound } from "next/navigation";

export default async function ProfilePage() {
  const result = await getProfile();

  if (!result.success || !result.data) {
    notFound();
  }

  return <ProfileDetails profile={result.data} />;
}
