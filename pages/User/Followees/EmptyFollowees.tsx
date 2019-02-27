import { Empty, Icon, Translate } from '~/components'

import ICON_EMPTY_WARNING from '~/static/icons/empty-warning.svg?sprite'

const EmptyFollowers = () => (
  <Empty
    icon={
      <Icon
        id={ICON_EMPTY_WARNING.id}
        viewBox={ICON_EMPTY_WARNING.viewBox}
        size={'xxlarge'}
      />
    }
    description={
      <Translate zh_hant="還沒有追蹤任何人" zh_hans="还没有追踪任何人" />
    }
  />
)

export default EmptyFollowers