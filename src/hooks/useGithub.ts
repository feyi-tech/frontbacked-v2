import { useCallback } from "react";
import { GITHUB_APP_NAME } from "../app-config";
import { randomUUID } from "../utils";

export default function useGithub() {

  const connect = useCallback(() => {

    // CSRF protection (still useful)
    const state = randomUUID();
    sessionStorage.setItem("github_install_state", state);

    // Optional: where GitHub redirects AFTER install
    const redirectUri = encodeURIComponent(
      `${window.location.origin}/github/install/success?state=${state}`
    );

    // GitHub App installation URL
    const githubUrl =
      `https://github.com/apps/${GITHUB_APP_NAME}/installations/new` +
      `?state=${state}` +
      `&redirect_uri=${redirectUri}`;

    window.location.href = githubUrl;

  }, []);

  return { connect };

}