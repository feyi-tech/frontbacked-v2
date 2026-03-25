import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { githubApi } from '@/api/github';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const GithubCallback = () => {
  const router = useRouter();
  const { installation_id, setup_action, state } = router.query;

  useEffect(() => {
    console.log("router.query", router.query)
    if (installation_id && state && setup_action === "install") {
      const savedState = sessionStorage.getItem("github_install_state");
      if (state !== savedState) {
        router.push(`/themes/create?error=${"OAuth state mismatch"}`);
        return;
      }
      githubApi.callback(installation_id as string)
      .then(() => {
        toast.success("GitHub connected successfully!");
        router.push('/themes/create');
      })
      .catch((err) => {
        router.push(`/themes/create?error=${"GitHub connection failed: " + err.message}`);
      });
    } else if(setup_action !== "install") {
      router.push(`/themes/create`);
    }
  }, [installation_id, setup_action, state, router]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center space-y-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-muted-foreground">Connecting your GitHub account...</p>
    </div>
  );
};

export default GithubCallback;
