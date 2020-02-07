import classNames from 'classnames'
import gql from 'graphql-tag'

import DropdownActions from '~/components/ArticleDigest/DropdownActions'
import { BookmarkButton } from '~/components/Button/Bookmark'
import ShareButton from '~/components/Button/Share'

import AppreciationButton from './AppreciationButton'
import Appreciators from './Appreciators'
import ResponseButton from './ResponseButton'
import styles from './styles.css'

import { ToolbarArticle } from './__generated__/ToolbarArticle'

const fragments = {
  article: gql`
    fragment ToolbarArticle on Article {
      id
      ...AppreciationArticleDetail
      ...AppreciatorsArticle
      ...BookmarkArticle
      ...ResponseButtonArticle
      ...DropdownActionsArticle
    }
    ${AppreciationButton.fragments.article}
    ${Appreciators.fragments.article}
    ${BookmarkButton.fragments.article}
    ${ResponseButton.fragments.article}
    ${DropdownActions.fragments.article}
  `
}

const Toolbar = ({
  article,
  placement,
  fixed,
  mobile
}: {
  article: ToolbarArticle
  placement: 'bottom' | 'left'
  fixed?: boolean
  mobile?: boolean
}) => {
  if (placement === 'left') {
    return (
      <section className="toolbar-left">
        <div className="container">
          <AppreciationButton article={article} />
          <ResponseButton article={article} textPlacement="bottom" />
          <BookmarkButton article={article} size="md-s" />
          <ShareButton size="md-s" />
        </div>
        <style jsx>{styles}</style>
      </section>
    )
  }

  const bottomToolbarClass = classNames({
    'toolbar-bottom': true,
    fixed
  })

  return (
    <section className={bottomToolbarClass}>
      <section className="left">
        <AppreciationButton article={article} />
        <Appreciators article={article} />
      </section>

      <section className="right">
        {mobile && fixed && (
          <AppreciationButton article={article} inFixedToolbar />
        )}
        <ResponseButton article={article} />
        <BookmarkButton article={article} size="md-s" />
        <ShareButton size="md-s" />
        {!fixed && (
          <DropdownActions article={article} color="black" size="md-s" />
        )}
      </section>

      <style jsx>{styles}</style>
    </section>
  )
}

Toolbar.fragments = fragments

export default Toolbar
