import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json()

    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 })
    }

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN

    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      {
        headers: {
          Authorization: GITHUB_TOKEN ? `Bearer ${GITHUB_TOKEN}` : '',
          Accept: 'application/vnd.github.v3+json',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch repos')
    }

    const repos = await response.json()

    const repoList = repos.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      private: repo.private,
      size: repo.size,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      updated_at: repo.updated_at,
      default_branch: repo.default_branch,
    }))

    return NextResponse.json({
      success: true,
      repos: repoList,
      total: repoList.length,
    })
  } catch (error: any) {
    console.error('❌ Error fetching repos:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch repos' },
      { status: 500 }
    )
  }
}