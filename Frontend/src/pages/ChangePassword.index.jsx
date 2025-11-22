import { PasswordChangeForm } from "@/components/profile/PasswordChangeForm";

const ChangePasswordPage = () => {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <PasswordChangeForm />
      </div>
    </div>
  );
};

export default ChangePasswordPage;

