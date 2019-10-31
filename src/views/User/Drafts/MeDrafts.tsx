import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'

import { DraftDigest, InfiniteScroll, Placeholder } from '~/components'
import EmptyDraft from '~/components/Empty/EmptyDraft'
import { QueryError } from '~/components/GQL'

import { mergeConnections } from '~/common/utils'

import { MeDraftFeed } from './__generated__/MeDraftFeed'

const ME_DRAFTS_FEED = gql`
  query MeDraftFeed($after: String) {
    viewer {
      id
      drafts(input: { first: 10, after: $after })
        @connection(key: "viewerDrafts") {
        pageInfo {
          startCursor
          endCursor
          hasNextPage
        }
        edges {
          cursor
          node {
            ...FeedDigestDraft
          }
        }
      }
    }
  }
  ${DraftDigest.Feed.fragments.draft}
`

const MeDrafts = () => {
  const { data, loading, error, fetchMore } = useQuery<MeDraftFeed>(
    ME_DRAFTS_FEED
  )

  if (loading) {
    return <Placeholder.ArticleDigestList />
  }

  if (error) {
    return <QueryError error={error} />
  }

  const connectionPath = 'viewer.drafts'
  const { edges, pageInfo } = (data && data.viewer && data.viewer.drafts) || {}

  if (!edges || edges.length <= 0 || !pageInfo) {
    return <EmptyDraft />
  }

  const loadMore = () =>
    fetchMore({
      variables: {
        after: pageInfo.endCursor
      },
      updateQuery: (previousResult, { fetchMoreResult }) =>
        mergeConnections({
          oldData: previousResult,
          newData: fetchMoreResult,
          path: connectionPath
        })
    })

  return (
    <InfiniteScroll hasNextPage={pageInfo.hasNextPage} loadMore={loadMore}>
      <ul>
        {edges.map(({ node, cursor }) => (
          <li key={cursor}>
            <DraftDigest.Feed draft={node} />
          </li>
        ))}
      </ul>
    </InfiniteScroll>
  )
}

export default MeDrafts