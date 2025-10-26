
import { Button } from "@/components/ui/button"
import { GitHubRepo } from "./github-verifier-types"

interface RepositorySelectorProps {
  repos: GitHubRepo[]
  selectedRepo: string | null
  onSelectRepo: (repoName: string) => void
  onBackup: () => void
  backingUp: boolean
  loadingRepos: boolean
}

export function RepositorySelector({
  repos,
  selectedRepo,
  onSelectRepo,
  onBackup,
  backingUp,
  loadingRepos
}: RepositorySelectorProps) {
  if (repos.length === 0) return null

  return (
    <div className="border rounded-lg p-6 bg-slate-50 dark:bg-slate-950/20">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Step 3: Backup Repositories
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          Encrypt & store on Lighthouse • Earn 30 GIT per backup
        </p>
      </div>

      {loadingRepos ? (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Loading repositories...
        </p>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              Found {repos.length} repositories
            </p>
          </div>

          <select
            value={selectedRepo || ''}
            onChange={(e) => onSelectRepo(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="">Select a repository to backup...</option>
            {repos.map((repo) => (
              <option key={repo.id} value={repo.full_name}>
                {repo.name}
                {repo.language && ` • ${repo.language}`}
                {' • '}
                {repo.stars} stars • {(repo.size / 1024).toFixed(1)}MB
              </option>
            ))}
          </select>

          <Button
            onClick={onBackup}
            disabled={!selectedRepo || backingUp}
            size="lg"
            className="w-full bg-slate-700 hover:bg-slate-800 text-white"
          >
            {backingUp ? "Encrypting & Uploading..." : "Backup Repository & Earn 30 GIT"}
          </Button>

          {selectedRepo && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
              Your code will be encrypted with AES-256 and stored on IPFS
            </p>
          )}
        </>
      )}
    </div>
  )
}
