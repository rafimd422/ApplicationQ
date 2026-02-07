import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { LoginForm, SignupForm } from "@/schemas/auth.schema";
import { useToast } from "@/components/ui";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { addToast } = useToast();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: (data: LoginForm) => authApi.login(data),
    onSuccess: (response) => {
      setAuth(response.data.user, response.data.token);
      addToast("success", "Welcome back!");
      router.push("/dashboard");
    },
    onError: (error: any) => {
      addToast("error", error.response?.data?.error || "Login failed");
    },
  });

  const signupMutation = useMutation({
    mutationFn: (data: SignupForm) => authApi.signup(data),
    onSuccess: (response) => {
      setAuth(response.data.user, response.data.token);
      addToast("success", "Account created successfully!");
      router.push("/dashboard");
    },
    onError: (error: any) => {
      addToast("error", error.response?.data?.error || "Signup failed");
    },
  });

  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authApi.getMe(),
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
    retry: false,
  });

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    signup: signupMutation.mutate,
    isSigningUp: signupMutation.isPending,
    user: meQuery.data?.data.user,
    isLoadingMe: meQuery.isLoading,
  };
};
