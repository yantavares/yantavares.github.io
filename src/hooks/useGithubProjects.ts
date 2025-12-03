import { useState, useEffect } from 'react';

export interface GithubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage: string;
  language: string;
  stargazers_count: number;
  updated_at: string;
  topics: string[];
}

export const useGithubProjects = (username: string) => {
  const [projects, setProjects] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        // Filter out forks if desired, or keep them. Let's keep non-forks for a cleaner portfolio usually.
        const nonForks = data.filter((repo: any) => !repo.fork);
        
        // Sort by stars then updated
        const sorted = nonForks.sort((a: GithubRepo, b: GithubRepo) => {
            return b.stargazers_count - a.stargazers_count;
        });

        setProjects(sorted);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [username]);

  return { projects, loading, error };
};
