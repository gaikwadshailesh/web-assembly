export interface GithubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
}

export async function fetchGithubUsers(): Promise<GithubUser[]> {
  const response = await fetch("https://api.github.com/users");
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
}
