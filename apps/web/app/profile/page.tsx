import { getProfile } from "@/lib/actios/proflie";

const ProfilePage = async () => {
  const res = await getProfile();
  return (
    <div>
      Profile
      <p>{JSON.stringify(res)}</p>
    </div>
  );
};
export default ProfilePage;
