import { LoginForm } from "@/components/login-form";
import ImageInfo from "@/components/ImageInfo";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-4 gap-6">
      {/* ImageInfo takes up 3/4 of the screen */}
      <div className="lg:col-span-3 relative hidden lg:block">
        <ImageInfo />
      </div>

      {/* Login form takes up 1/4 of the screen */}
      <div className="flex flex-col gap-4 p-6 md:p-10 lg:col-span-1">
        <div className="flex justify-center gap-2 md:justify-start"></div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
