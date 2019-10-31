import classNames from 'classnames'
import gql from 'graphql-tag'
import Link from 'next/link'
import { MouseEventHandler } from 'react'

import { Title } from '~/components'
import { Icon } from '~/components/Icon'
import { Translate } from '~/components/Language'
import { Tooltip } from '~/components/Popper'
import { UserDigest } from '~/components/UserDigest'

import { TEXT } from '~/common/enums'
import { toPath } from '~/common/utils'
import ICON_ARROW_UP_RIGHT from '~/static/icons/arrow-up-right.svg?sprite'

import { DropdownDigestArticle } from './__generated__/DropdownDigestArticle'
import styles from './styles.css'

interface DropdownDigestProps {
  article: DropdownDigestArticle
  hasArrow?: boolean
  disabled?: boolean
}

const fragments = {
  article: gql`
    fragment DropdownDigestArticle on Article {
      id
      title
      state
      slug
      author {
        id
        userName
        ...UserDigestMiniUser
      }
      mediaHash
    }
    ${UserDigest.Mini.fragments.user}
  `
}

const DropdownDigest = ({
  article,
  hasArrow,
  disabled,
  onClick
}: DropdownDigestProps & { onClick?: MouseEventHandler }) => {
  const { author, slug, mediaHash, title, state } = article

  if (!author || !author.userName || !slug || !mediaHash) {
    return null
  }

  const path = toPath({
    page: 'articleDetail',
    userName: author.userName,
    slug,
    mediaHash
  })
  const conatinerClass = classNames({
    container: true,
    'has-arrow': hasArrow
  })
  const contentClass = classNames({
    content: true,
    inactive: state !== 'active',
    disabled
  })

  return (
    <section className={conatinerClass}>
      <div className={contentClass} onClick={onClick}>
        <Link {...path}>
          <a>
            <Title type="sidebar" is="h2">
              {title}
            </Title>
          </a>
        </Link>

        <UserDigest.Mini
          user={author}
          avatarSize="xxxsmall"
          textSize="xsmall"
        />

        {hasArrow && (
          <Link {...path}>
            <a className="arrow" target="_blank">
              <Icon
                id={ICON_ARROW_UP_RIGHT.id}
                viewBox={ICON_ARROW_UP_RIGHT.viewBox}
                size="small"
              />
            </a>
          </Link>
        )}
      </div>

      <style jsx>{styles}</style>
    </section>
  )
}

const DropdownDigestWrapper = ({
  hasArchivedTooltip,
  article,
  onClick,
  ...props
}: {
  hasArchivedTooltip?: boolean
  onClick?: MouseEventHandler
} & DropdownDigestProps) => {
  const isInactive = article.state !== 'active'

  if (hasArchivedTooltip && isInactive) {
    return (
      <Tooltip
        content={
          <Translate
            zh_hant={TEXT.zh_hant.articleArchived}
            zh_hans={TEXT.zh_hans.articleArchived}
          />
        }
      >
        <div>
          <DropdownDigest article={article} {...props} />
        </div>
      </Tooltip>
    )
  }

  return <DropdownDigest article={article} onClick={onClick} {...props} />
}

DropdownDigestWrapper.fragments = fragments

export default DropdownDigestWrapper