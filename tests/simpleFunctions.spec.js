const { prettyDate, extractReposAndOwners } = require('../lib/requests')

test('prettyDate() makes a date look more readable.', () => {
  expect(prettyDate('2018-05-22T05:58:14Z')).toBe('May 21st 2018, 10:58:14 PM')
})

test('getReposAndOwners() cleans up an array of info', () => {
  const input = [
    {
      starred_at: '2018-08-17T18:21:04Z',
      repo: {
        id: 95876775,
        node_id: 'MDEwOlJlcG9zaXRvcnk5NTg3Njc3NQ==',
        name: 'project-guidelines',
        full_name: 'elsewhencode/project-guidelines',
        owner: {
          login: 'elsewhencode',
          id: 7815827,
          node_id: 'MDEyOk9yZ2FuaXphdGlvbjc4MTU4Mjc=',
          avatar_url: 'https://avatars3.githubusercontent.com/u/7815827?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/elsewhencode',
          html_url: 'https://github.com/elsewhencode',
          followers_url: 'https://api.github.com/users/elsewhencode/followers',
          following_url:
            'https://api.github.com/users/elsewhencode/following{/other_user}',
          gists_url:
            'https://api.github.com/users/elsewhencode/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/elsewhencode/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/elsewhencode/subscriptions',
          organizations_url: 'https://api.github.com/users/elsewhencode/orgs',
          repos_url: 'https://api.github.com/users/elsewhencode/repos',
          events_url:
            'https://api.github.com/users/elsewhencode/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/elsewhencode/received_events',
          type: 'Organization',
          site_admin: false
        },
        private: false,
        html_url: 'https://github.com/elsewhencode/project-guidelines',
        description: 'A set of best practices for JavaScript projects',
        fork: false,
        url: 'https://api.github.com/repos/elsewhencode/project-guidelines',
        forks_url:
          'https://api.github.com/repos/elsewhencode/project-guidelines/forks',
        keys_url:
          'https://api.github.com/repos/elsewhencode/project-guidelines/keys{/key_id}',
        collaborators_url:
          'https://api.github.com/repos/elsewhencode/project-guidelines/collaborators{/collaborator}',
        teams_url:
          'https://api.github.com/repos/elsewhencode/project-guidelines/teams',
        hooks_url:
          'https://api.github.com/repos/elsewhencode/project-guidelines/hooks',
        issue_events_url:
          'https://api.github.com/repos/elsewhencode/project-guidelines/issues/events{/number}',
        events_url:
          'https://api.github.com/repos/elsewhencode/project-guidelines/events',
        assignees_url:
          'https://api.github.com/repos/elsewhencode/project-guidelines/assignees{/user}',
        branches_url:
          'https://api.github.com/repos/elsewhencode/project-guidelines/branches{/branch}',
        tags_url:
          'https://api.github.com/repos/elsewhencode/project-guidelines/tags',
        blobs_url:
          'https://api.github.com/repos/elsewhencode/project-guidelines/git/blobs{/sha}',
        git_tags_url:
          'https://api.github.com/repos/elsewhencode/project-guidelines/git/tags{/sha}',
        git_refs_url:
          'https://api.github.com/repos/elsewhencode/project-guidelines/git/refs{/sha}',
        trees_url:
          'https://api.github.com/repos/elsewhencode/project-guidelines/git/trees{/sha}',
        statuses_url:
          'https://api.github.com/repos/elsewhencode/project-guidelines/statuses/{sha}',
        languages_url:
          'https://api.github.com/repos/elsewhencode/project-guidelines/languages',
        stargazers_url:
          'https://api.github.com/repos/elsewhencode/project-guidelines/stargazers',
        contributors_url:
          'https://api.github.com/repos/elsewhencode/project-guidelines/contributors',
        subscribers_url:
          'https://api.github.com/repos/elsewhencode/project-guidelines/subscribers',
        subscription_url:
          'https://api.github.com/repos/elsewhencode/project-guidelines/subscription',
        commits_url:
          'https://api.github.com/repos/elsewhencode/project-guidelines/commits{/sha}',
        git_commits_url:
          'https://api.github.com/repos/elsewhencode/project-guidelines/git/commits{/sha}',
        comments_url:
          'https://api.github.com/repos/elsewhencode/project-guidelines/comments{/number}',
        issue_comment_url:
          'https://api.github.com/repos/elsewhencode/project-guidelines/issues/comments{/number}',
        contents_url:
          'https://api.github.com/repos/elsewhencode/project-guidelines/contents/{+path}',
        compare_url:
          'https://api.github.com/repos/elsewhencode/project-guidelines/compare/{base}...{head}',
        merges_url:
          'https://api.github.com/repos/elsewhencode/project-guidelines/merges',
        archive_url:
          'https://api.github.com/repos/elsewhencode/project-guidelines/{archive_format}{/ref}',
        downloads_url:
          'https://api.github.com/repos/elsewhencode/project-guidelines/downloads',
        issues_url:
          'https://api.github.com/repos/elsewhencode/project-guidelines/issues{/number}',
        pulls_url:
          'https://api.github.com/repos/elsewhencode/project-guidelines/pulls{/number}',
        milestones_url:
          'https://api.github.com/repos/elsewhencode/project-guidelines/milestones{/number}',
        notifications_url:
          'https://api.github.com/repos/elsewhencode/project-guidelines/notifications{?since,all,participating}',
        labels_url:
          'https://api.github.com/repos/elsewhencode/project-guidelines/labels{/name}',
        releases_url:
          'https://api.github.com/repos/elsewhencode/project-guidelines/releases{/id}',
        deployments_url:
          'https://api.github.com/repos/elsewhencode/project-guidelines/deployments',
        created_at: '2017-06-30T10:17:55Z',
        updated_at: '2018-08-29T15:20:39Z',
        pushed_at: '2018-08-21T11:54:32Z',
        git_url: 'git://github.com/elsewhencode/project-guidelines.git',
        ssh_url: 'git@github.com:elsewhencode/project-guidelines.git',
        clone_url: 'https://github.com/elsewhencode/project-guidelines.git',
        svn_url: 'https://github.com/elsewhencode/project-guidelines',
        homepage: '',
        size: 323,
        stargazers_count: 17839,
        watchers_count: 17839,
        language: 'JavaScript',
        has_issues: true,
        has_projects: true,
        has_downloads: true,
        has_wiki: true,
        has_pages: false,
        forks_count: 1661,
        mirror_url: null,
        archived: false,
        open_issues_count: 11,
        license: {
          key: 'mit',
          name: 'MIT License',
          spdx_id: 'MIT',
          url: 'https://api.github.com/licenses/mit',
          node_id: 'MDc6TGljZW5zZTEz'
        },
        forks: 1661,
        open_issues: 11,
        watchers: 17839,
        default_branch: 'master',
        permissions: {
          admin: false,
          push: false,
          pull: true
        }
      }
    },
    {
      starred_at: '2018-08-17T18:15:59Z',
      repo: {
        id: 29891188,
        node_id: 'MDEwOlJlcG9zaXRvcnkyOTg5MTE4OA==',
        name: 'standard',
        full_name: 'standard/standard',
        owner: {
          login: 'standard',
          id: 29208316,
          node_id: 'MDEyOk9yZ2FuaXphdGlvbjI5MjA4MzE2',
          avatar_url: 'https://avatars2.githubusercontent.com/u/29208316?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/standard',
          html_url: 'https://github.com/standard',
          followers_url: 'https://api.github.com/users/standard/followers',
          following_url:
            'https://api.github.com/users/standard/following{/other_user}',
          gists_url: 'https://api.github.com/users/standard/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/standard/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/standard/subscriptions',
          organizations_url: 'https://api.github.com/users/standard/orgs',
          repos_url: 'https://api.github.com/users/standard/repos',
          events_url: 'https://api.github.com/users/standard/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/standard/received_events',
          type: 'Organization',
          site_admin: false
        },
        private: false,
        html_url: 'https://github.com/standard/standard',
        description:
          '🌟 JavaScript Style Guide, with linter & automatic code fixer',
        fork: false,
        url: 'https://api.github.com/repos/standard/standard',
        forks_url: 'https://api.github.com/repos/standard/standard/forks',
        keys_url:
          'https://api.github.com/repos/standard/standard/keys{/key_id}',
        collaborators_url:
          'https://api.github.com/repos/standard/standard/collaborators{/collaborator}',
        teams_url: 'https://api.github.com/repos/standard/standard/teams',
        hooks_url: 'https://api.github.com/repos/standard/standard/hooks',
        issue_events_url:
          'https://api.github.com/repos/standard/standard/issues/events{/number}',
        events_url: 'https://api.github.com/repos/standard/standard/events',
        assignees_url:
          'https://api.github.com/repos/standard/standard/assignees{/user}',
        branches_url:
          'https://api.github.com/repos/standard/standard/branches{/branch}',
        tags_url: 'https://api.github.com/repos/standard/standard/tags',
        blobs_url:
          'https://api.github.com/repos/standard/standard/git/blobs{/sha}',
        git_tags_url:
          'https://api.github.com/repos/standard/standard/git/tags{/sha}',
        git_refs_url:
          'https://api.github.com/repos/standard/standard/git/refs{/sha}',
        trees_url:
          'https://api.github.com/repos/standard/standard/git/trees{/sha}',
        statuses_url:
          'https://api.github.com/repos/standard/standard/statuses/{sha}',
        languages_url:
          'https://api.github.com/repos/standard/standard/languages',
        stargazers_url:
          'https://api.github.com/repos/standard/standard/stargazers',
        contributors_url:
          'https://api.github.com/repos/standard/standard/contributors',
        subscribers_url:
          'https://api.github.com/repos/standard/standard/subscribers',
        subscription_url:
          'https://api.github.com/repos/standard/standard/subscription',
        commits_url:
          'https://api.github.com/repos/standard/standard/commits{/sha}',
        git_commits_url:
          'https://api.github.com/repos/standard/standard/git/commits{/sha}',
        comments_url:
          'https://api.github.com/repos/standard/standard/comments{/number}',
        issue_comment_url:
          'https://api.github.com/repos/standard/standard/issues/comments{/number}',
        contents_url:
          'https://api.github.com/repos/standard/standard/contents/{+path}',
        compare_url:
          'https://api.github.com/repos/standard/standard/compare/{base}...{head}',
        merges_url: 'https://api.github.com/repos/standard/standard/merges',
        archive_url:
          'https://api.github.com/repos/standard/standard/{archive_format}{/ref}',
        downloads_url:
          'https://api.github.com/repos/standard/standard/downloads',
        issues_url:
          'https://api.github.com/repos/standard/standard/issues{/number}',
        pulls_url:
          'https://api.github.com/repos/standard/standard/pulls{/number}',
        milestones_url:
          'https://api.github.com/repos/standard/standard/milestones{/number}',
        notifications_url:
          'https://api.github.com/repos/standard/standard/notifications{?since,all,participating}',
        labels_url:
          'https://api.github.com/repos/standard/standard/labels{/name}',
        releases_url:
          'https://api.github.com/repos/standard/standard/releases{/id}',
        deployments_url:
          'https://api.github.com/repos/standard/standard/deployments',
        created_at: '2015-01-27T01:23:31Z',
        updated_at: '2018-08-29T12:44:55Z',
        pushed_at: '2018-08-29T10:47:02Z',
        git_url: 'git://github.com/standard/standard.git',
        ssh_url: 'git@github.com:standard/standard.git',
        clone_url: 'https://github.com/standard/standard.git',
        svn_url: 'https://github.com/standard/standard',
        homepage: 'https://standardjs.com',
        size: 1922,
        stargazers_count: 18941,
        watchers_count: 18941,
        language: 'JavaScript',
        has_issues: true,
        has_projects: false,
        has_downloads: true,
        has_wiki: false,
        has_pages: false,
        forks_count: 1413,
        mirror_url: null,
        archived: false,
        open_issues_count: 79,
        license: {
          key: 'mit',
          name: 'MIT License',
          spdx_id: 'MIT',
          url: 'https://api.github.com/licenses/mit',
          node_id: 'MDc6TGljZW5zZTEz'
        },
        forks: 1413,
        open_issues: 79,
        watchers: 18941,
        default_branch: 'master',
        permissions: {
          admin: false,
          push: false,
          pull: true
        }
      }
    },
    {
      starred_at: '2018-08-06T02:59:02Z',
      repo: {
        id: 138976952,
        node_id: 'MDEwOlJlcG9zaXRvcnkxMzg5NzY5NTI=',
        name: 'okta-express-login-portal',
        full_name: 'rdegges/okta-express-login-portal',
        owner: {
          login: 'rdegges',
          id: 90247,
          node_id: 'MDQ6VXNlcjkwMjQ3',
          avatar_url: 'https://avatars2.githubusercontent.com/u/90247?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/rdegges',
          html_url: 'https://github.com/rdegges',
          followers_url: 'https://api.github.com/users/rdegges/followers',
          following_url:
            'https://api.github.com/users/rdegges/following{/other_user}',
          gists_url: 'https://api.github.com/users/rdegges/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/rdegges/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/rdegges/subscriptions',
          organizations_url: 'https://api.github.com/users/rdegges/orgs',
          repos_url: 'https://api.github.com/users/rdegges/repos',
          events_url: 'https://api.github.com/users/rdegges/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/rdegges/received_events',
          type: 'User',
          site_admin: false
        },
        private: false,
        html_url: 'https://github.com/rdegges/okta-express-login-portal',
        description:
          'A simple Node.js websites that showcases how to handle user login and registration.',
        fork: false,
        url: 'https://api.github.com/repos/rdegges/okta-express-login-portal',
        forks_url:
          'https://api.github.com/repos/rdegges/okta-express-login-portal/forks',
        keys_url:
          'https://api.github.com/repos/rdegges/okta-express-login-portal/keys{/key_id}',
        collaborators_url:
          'https://api.github.com/repos/rdegges/okta-express-login-portal/collaborators{/collaborator}',
        teams_url:
          'https://api.github.com/repos/rdegges/okta-express-login-portal/teams',
        hooks_url:
          'https://api.github.com/repos/rdegges/okta-express-login-portal/hooks',
        issue_events_url:
          'https://api.github.com/repos/rdegges/okta-express-login-portal/issues/events{/number}',
        events_url:
          'https://api.github.com/repos/rdegges/okta-express-login-portal/events',
        assignees_url:
          'https://api.github.com/repos/rdegges/okta-express-login-portal/assignees{/user}',
        branches_url:
          'https://api.github.com/repos/rdegges/okta-express-login-portal/branches{/branch}',
        tags_url:
          'https://api.github.com/repos/rdegges/okta-express-login-portal/tags',
        blobs_url:
          'https://api.github.com/repos/rdegges/okta-express-login-portal/git/blobs{/sha}',
        git_tags_url:
          'https://api.github.com/repos/rdegges/okta-express-login-portal/git/tags{/sha}',
        git_refs_url:
          'https://api.github.com/repos/rdegges/okta-express-login-portal/git/refs{/sha}',
        trees_url:
          'https://api.github.com/repos/rdegges/okta-express-login-portal/git/trees{/sha}',
        statuses_url:
          'https://api.github.com/repos/rdegges/okta-express-login-portal/statuses/{sha}',
        languages_url:
          'https://api.github.com/repos/rdegges/okta-express-login-portal/languages',
        stargazers_url:
          'https://api.github.com/repos/rdegges/okta-express-login-portal/stargazers',
        contributors_url:
          'https://api.github.com/repos/rdegges/okta-express-login-portal/contributors',
        subscribers_url:
          'https://api.github.com/repos/rdegges/okta-express-login-portal/subscribers',
        subscription_url:
          'https://api.github.com/repos/rdegges/okta-express-login-portal/subscription',
        commits_url:
          'https://api.github.com/repos/rdegges/okta-express-login-portal/commits{/sha}',
        git_commits_url:
          'https://api.github.com/repos/rdegges/okta-express-login-portal/git/commits{/sha}',
        comments_url:
          'https://api.github.com/repos/rdegges/okta-express-login-portal/comments{/number}',
        issue_comment_url:
          'https://api.github.com/repos/rdegges/okta-express-login-portal/issues/comments{/number}',
        contents_url:
          'https://api.github.com/repos/rdegges/okta-express-login-portal/contents/{+path}',
        compare_url:
          'https://api.github.com/repos/rdegges/okta-express-login-portal/compare/{base}...{head}',
        merges_url:
          'https://api.github.com/repos/rdegges/okta-express-login-portal/merges',
        archive_url:
          'https://api.github.com/repos/rdegges/okta-express-login-portal/{archive_format}{/ref}',
        downloads_url:
          'https://api.github.com/repos/rdegges/okta-express-login-portal/downloads',
        issues_url:
          'https://api.github.com/repos/rdegges/okta-express-login-portal/issues{/number}',
        pulls_url:
          'https://api.github.com/repos/rdegges/okta-express-login-portal/pulls{/number}',
        milestones_url:
          'https://api.github.com/repos/rdegges/okta-express-login-portal/milestones{/number}',
        notifications_url:
          'https://api.github.com/repos/rdegges/okta-express-login-portal/notifications{?since,all,participating}',
        labels_url:
          'https://api.github.com/repos/rdegges/okta-express-login-portal/labels{/name}',
        releases_url:
          'https://api.github.com/repos/rdegges/okta-express-login-portal/releases{/id}',
        deployments_url:
          'https://api.github.com/repos/rdegges/okta-express-login-portal/deployments',
        created_at: '2018-06-28T06:39:06Z',
        updated_at: '2018-08-24T17:23:33Z',
        pushed_at: '2018-06-28T18:04:47Z',
        git_url: 'git://github.com/rdegges/okta-express-login-portal.git',
        ssh_url: 'git@github.com:rdegges/okta-express-login-portal.git',
        clone_url: 'https://github.com/rdegges/okta-express-login-portal.git',
        svn_url: 'https://github.com/rdegges/okta-express-login-portal',
        homepage: null,
        size: 628,
        stargazers_count: 6,
        watchers_count: 6,
        language: 'JavaScript',
        has_issues: true,
        has_projects: true,
        has_downloads: true,
        has_wiki: true,
        has_pages: false,
        forks_count: 6,
        mirror_url: null,
        archived: false,
        open_issues_count: 1,
        license: null,
        forks: 6,
        open_issues: 1,
        watchers: 6,
        default_branch: 'master',
        permissions: {
          admin: false,
          push: false,
          pull: true
        }
      }
    }
  ]

  const output = [
    {
      repo: 'project-guidelines',
      owner: 'elsewhencode'
    },
    {
      repo: 'standard',
      owner: 'standard'
    },
    {
      repo: 'okta-express-login-portal',
      owner: 'rdegges'
    }
  ]

  expect(extractReposAndOwners(input)).toBe(output)
})
