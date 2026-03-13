import { apiClient } from "./client";
import { Repo } from "../types/api";

export const githubApi = {
  listRepos: (page: number = 1) =>
    apiClient.get<Repo[]>(`/github/repos?page=${page}`),
  deploy: (data: { repoOwner: string; repoName: string }) =>
    apiClient.post("/github/deploy", data),
  callback: (code: string) =>
    apiClient.post("/github/callback", { code }),
};
