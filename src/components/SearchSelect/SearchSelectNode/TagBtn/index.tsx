import classNames from 'classnames'

import { Tag } from '~/components'

import styles from '../styles.css'

import { DigestTag } from '~/components/Tag/__generated__/DigestTag'

interface TagBtnProps {
  tag: DigestTag
  selected?: boolean
  onClick: (tag: DigestTag) => void
  inStagingArea?: boolean
}

const TagBtn: React.FC<TagBtnProps> = ({
  tag,
  selected,
  onClick,
  inStagingArea,
}) => {
  const nodeClass = classNames({
    node: true,
    inline: true,
    selectable: false,
  })

  return (
    <>
      {selected && (
        <section className={nodeClass} onClick={() => onClick(tag)}>
          <Tag tag={tag} type="inline" disabled hasClear />
        </section>
      )}
      <style jsx>{styles}</style>
    </>
  )
}

export default TagBtn
