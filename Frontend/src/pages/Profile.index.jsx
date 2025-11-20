import { NameChangeForm } from "@/components/profile/NameChangeForm";
import { AdRequestForm } from "@/components/profile/AdRequestForm";

const ProfilePage = () => {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl space-y-6">
        <NameChangeForm />
        <AdRequestForm />
      </div>
    </div>
  );
};

export default ProfilePage;
