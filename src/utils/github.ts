const github = 'https://github.com/ribbon-studios/tyria.ribbonstudios.com';

export function commit(sha: string) {
  if (sha === 'local') return github;
  return `${github}/commit/${sha}`;
}
