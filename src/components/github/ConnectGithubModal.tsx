import React, { useState } from 'react';
import { githubApi } from '@/api/github';
import { themesApi } from '@/api/themes';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Github, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Repo } from '@/types/api';

interface ConnectGithubModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  themeId: string | null;
  onSuccess: () => void;
}

export const ConnectGithubModal = ({ open, onOpenChange, themeId, onSuccess }: ConnectGithubModalProps) => {
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [connected, setConnected] = useState(false);
  const [page, setPage] = useState(1);

  const handleConnect = () => {
    const clientId = "Ov23liwlcly035s7yOx2"; // From previous code
    const redirectUri = window.location.origin + "/github/callback";
    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=repo`;
    window.location.href = url;
  };

  // This would be called if we already have a token
  const fetchRepos = async (p: number) => {
    setLoading(true);
    try {
      const data = await githubApi.listRepos(p);
      setRepos(data);
      setConnected(true);
    } catch (error: any) {
      // toast.error("Failed to fetch repos: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRepo = async (repo: Repo) => {
    if (!themeId) return;
    setLoading(true);
    try {
      await themesApi.connectRepo(themeId, {
        repoOwner: repo.owner.login,
        repoName: repo.name,
      });
      await githubApi.deploy({
        repoOwner: repo.owner.login,
        repoName: repo.name,
      });
      toast.success("GitHub repository connected and deployed!");
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error("Deployment failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Connect GitHub Repository</DialogTitle>
        </DialogHeader>

        {!connected ? (
          <div className="py-12 text-center space-y-6">
            <Github className="h-16 w-16 mx-auto text-muted-foreground" />
            <div className="space-y-2">
              <p className="font-medium text-lg">Connect your GitHub account</p>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Select a repository to automatically deploy your theme from.
              </p>
            </div>
            <Button onClick={handleConnect} size="lg" className="bg-[#24292e] hover:bg-[#1c2022] text-white">
              <Github className="mr-2 h-5 w-5" />
              Connect with GitHub
            </Button>
            <Button variant="ghost" onClick={() => fetchRepos(1)}>Already connected? Refresh</Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <h3 className="font-medium">Select a Repository</h3>
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                    {repos.map(repo => (
                        <div key={repo.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                            <div className="flex-1 min-w-0 mr-4">
                                <p className="font-medium truncate">{repo.full_name}</p>
                                <p className="text-xs text-muted-foreground truncate">{repo.description || "No description"}</p>
                            </div>
                            <Button size="sm" onClick={() => handleSelectRepo(repo)}>Select</Button>
                        </div>
                    ))}
                </div>
            )}
            <div className="flex justify-between items-center pt-4">
                <Button variant="outline" size="sm" onClick={() => { setPage(p => Math.max(1, p-1)); fetchRepos(page-1); }} disabled={page === 1 || loading}>
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <span className="text-sm text-muted-foreground">Page {page}</span>
                <Button variant="outline" size="sm" onClick={() => { setPage(p => p+1); fetchRepos(page+1); }} disabled={loading}>
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
