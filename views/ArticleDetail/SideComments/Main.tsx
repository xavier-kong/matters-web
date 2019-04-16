import gql from 'graphql-tag'
import _get from 'lodash/get'
import _merge from 'lodash/merge'
import { withRouter, WithRouterProps } from 'next/router'
import { useEffect } from 'react'
import { QueryResult } from 'react-apollo'

import { InfiniteScroll, Spinner, Translate } from '~/components'
import { CommentDigest } from '~/components/CommentDigest'
import EmptyComment from '~/components/Empty/EmptyComment'
import CommentForm from '~/components/Form/CommentForm'
import { Query } from '~/components/GQL'
import { ArticleDetailComments } from '~/components/GQL/fragments/article'
import { ArticleComments as ArticleCommentsType } from '~/components/GQL/queries/__generated__/ArticleComments'
import ARTICLE_COMMENTS from '~/components/GQL/queries/articleComments'

import { filterComments, getQuery, mergeConnections } from '~/common/utils'

import styles from './styles.css'

const SUBSCRIBE_COMMENTS = gql`
  subscription ArticleCommentAdded(
    $id: ID!
    $first: Int!
    $cursor: String
    $hasDescendantComments: Boolean = true
  ) {
    nodeEdited(input: { id: $id }) {
      id
      ... on Article {
        id
        ...ArticleDetailComments
      }
    }
  }
  ${ArticleDetailComments}
`

const Main: React.FC<WithRouterProps> = ({ router }) => {
  const mediaHash = getQuery({ router, key: 'mediaHash' })
  const uuid = getQuery({ router, key: 'post' })

  if (!mediaHash && !uuid) {
    return <EmptyComment />
  }

  return (
    <Query query={ARTICLE_COMMENTS} variables={{ mediaHash, uuid }}>
      {({
        data,
        loading,
        fetchMore,
        subscribeToMore
      }: QueryResult & { data: ArticleCommentsType }) => {
        if (loading) {
          return <Spinner />
        }

        const pinnedComments = _get(data, 'article.pinnedComments', [])
        const connectionPath = 'article.comments'
        const { edges, pageInfo } = _get(data, connectionPath, {})
        const loadMore = () =>
          fetchMore({
            variables: {
              cursor: pageInfo.endCursor
            },
            updateQuery: (previousResult, { fetchMoreResult }) =>
              mergeConnections({
                oldData: previousResult,
                newData: fetchMoreResult,
                path: connectionPath
              })
          })

        const filteredPinnedComments = filterComments(pinnedComments)
        const filteredAllComments = filterComments(
          (edges || []).map(({ node }: { node: any }) => node),
          { pinned: true }
        )

        useEffect(() => {
          if (data.article.live) {
            subscribeToMore({
              document: SUBSCRIBE_COMMENTS,
              variables: { id: data.article.id, first: edges.length },
              updateQuery: (prev, { subscriptionData }) =>
                _merge(prev, {
                  article: subscriptionData.data.nodeEdited
                })
            })
          }
        })

        return (
          <>
            <section>
              <CommentForm
                articleId={data.article.id}
                articleMediaHash={data.article.mediaHash}
                refetch
              />
            </section>
            {filteredPinnedComments && filteredPinnedComments.length > 0 && (
              <section className="pinned-comments">
                <h3>
                  <Translate zh_hant="置頂評論" zh_hans="置顶评论" />
                </h3>
                <ul>
                  {filteredPinnedComments.map((comment: any) => (
                    <li key={comment.id}>
                      <CommentDigest.Feed
                        comment={comment}
                        hasComment
                        inArticle
                      />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="all-comments">
              <h3>
                <Translate zh_hant="全部評論" zh_hans="全部评论" />
              </h3>

              {!filteredAllComments ||
                (filteredAllComments.length <= 0 && <EmptyComment />)}

              <InfiniteScroll
                hasNextPage={pageInfo.hasNextPage}
                loadMore={loadMore}
              >
                <ul>
                  {filteredAllComments.map(comment => (
                    <li key={comment.id}>
                      <CommentDigest.Feed
                        comment={comment}
                        hasComment
                        inArticle
                      />
                    </li>
                  ))}
                </ul>
              </InfiniteScroll>
            </section>

            <style jsx>{styles}</style>
          </>
        )
      }}
    </Query>
  )
}

export default withRouter(Main)