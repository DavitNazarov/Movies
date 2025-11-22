import { NameChangeForm } from "@/components/profile/NameChangeForm";

const ChangeNamePage = () => {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <NameChangeForm />
      </div>
    </div>
  );
};

export default ChangeNamePage;

