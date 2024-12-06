export interface GithubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  type: 'User' | 'Organization';
  followers: number;
}

export async function fetchGithubUsers(): Promise<GithubUser[]> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json'
    };

    // Add authorization header if token is available
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    const response = await fetch("https://api.github.com/users", { headers });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch users: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching GitHub users:', error);
    throw error;
  }
}
