import { apiClient } from "./client";
import { Repo } from "../types/api";

export const githubApi = {
  listRepos: (page: number = 1, per_page: number = 10) =>
    apiClient.get<{repos: Repo[], totalPages: number}>(`/github/repos?page=${page}&per_page=${per_page}`),
  deploy: (data: { repoOwner: string; repoName: string }) =>
    apiClient.post("/github/deploy", data),
  callback: (installation_id: string) =>
    apiClient.post("/github/callback", { installation_id }),
};
