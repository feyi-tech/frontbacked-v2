import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { githubApi } from '@/api/github';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const GithubCallback = () => {
  const router = useRouter();
  const { code } = router.query;

  useEffect(() => {
    if (code) {
      githubApi.callback(code as string)
        .then(() => {
          toast.success("GitHub connected successfully!");
          router.push('/themes/create');
        })
        .catch((err) => {
          toast.error("GitHub connection failed: " + err.message);
          router.push('/themes/create');
        });
    }
  }, [code, router]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center space-y-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-muted-foreground">Connecting your GitHub account...</p>
    </div>
  );
};

export default GithubCallback;
