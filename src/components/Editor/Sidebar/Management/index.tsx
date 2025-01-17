import { IconSettings24 } from '~/components'

import { SetPublishISCNProps } from '../..'
import ToggleAccess, { ToggleAccessProps } from '../../ToggleAccess'
import Box from '../Box'
import styles from './styles.css'

export type SidebarManagementProps = ToggleAccessProps & SetPublishISCNProps

const SidebarManagement: React.FC<SidebarManagementProps> = (props) => {
  return (
    <Box icon={<IconSettings24 size="md" />} title="articleManagement">
      <section className="container">
        <ToggleAccess {...props} inSidebar />

        <style jsx>{styles}</style>
      </section>
    </Box>
  )
}

export default SidebarManagement
