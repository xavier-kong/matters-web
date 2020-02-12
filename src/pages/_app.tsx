import { ApolloProvider, useQuery } from '@apollo/react-hooks'
import * as Sentry from '@sentry/browser'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import gql from 'graphql-tag'
import App from 'next/app'
import getConfig from 'next/config'
import React from 'react'

import {
  AnalyticsListener,
  AnalyticsProvider,
  Error,
  ErrorBoundary,
  Head,
  LanguageProvider,
  Toast,
  ViewerFragments,
  ViewerProvider
} from '~/components'
import { GlobalAlertDialogs } from '~/components/GlobalAlertDialogs'
import { GlobalHeader } from '~/components/GlobalHeader'
import { HeaderContextProvider } from '~/components/GlobalHeader/Context'
import { GlobalStyles } from '~/components/GlobalStyles'
import { QueryError } from '~/components/GQL'
import { ProgressBar } from '~/components/ProgressBar'
import PushInitializer from '~/components/PushInitializer'

import withApollo from '~/common/utils/withApollo'

import { RootQuery } from './__generated__/RootQuery'

const ROOT_QUERY = gql`
  query RootQuery {
    viewer {
      id
      ...ViewerUser
      ...GlobalHeaderUser
      ...AnalyticsUser
    }
  }
  ${ViewerFragments.user}
  ${GlobalHeader.fragments.user}
  ${AnalyticsListener.fragments.user}
`

/**
 * Initialize
 */
const {
  publicRuntimeConfig: { SENTRY_DSN }
} = getConfig()

// Sentry
Sentry.init({ dsn: SENTRY_DSN || '' })

/**
 * `<Root>` contains components that depend on viewer
 *
 */
const Root = ({
  client,
  children
}: {
  client: ApolloClient<InMemoryCache>
  children: React.ReactNode
}) => {
  const { loading, data, error } = useQuery<RootQuery>(ROOT_QUERY)
  const viewer = data?.viewer

  if (loading) {
    return null
  }

  if (error) {
    return <QueryError error={error} />
  }

  if (!viewer) {
    return <Error />
  }

  return (
    <ViewerProvider viewer={viewer}>
      <LanguageProvider>
        <HeaderContextProvider>
          <Head />
          <GlobalHeader user={viewer} />

          {children}

          <GlobalAlertDialogs />
          <Toast.Container />
          <ProgressBar />

          <AnalyticsListener user={viewer || {}} />
          <PushInitializer client={client} />
        </HeaderContextProvider>
      </LanguageProvider>
    </ViewerProvider>
  )
}

class MattersApp extends App<{ apollo: ApolloClient<InMemoryCache> }> {
  render() {
    const { Component, pageProps, apollo } = this.props

    return (
      <ErrorBoundary>
        <ApolloProvider client={apollo}>
          <GlobalStyles />
          <AnalyticsProvider />

          <Root client={apollo}>
            <Component {...pageProps} />
          </Root>
        </ApolloProvider>
      </ErrorBoundary>
    )
  }
}

export default withApollo(MattersApp)
