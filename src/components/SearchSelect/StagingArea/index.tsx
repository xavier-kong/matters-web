import dynamic from 'next/dynamic'

import { Spinner, Translate } from '~/components'

import { TextId } from '~/common/enums'

import { SelectNode } from '../SearchingArea'
import SearchSelectNode from '../SearchSelectNode'
import areaStyles from '../styles.css'
import styles from './styles.css'

/**
 * This is a sub-component of search-and-select. It's a container
 * of selected nodes from <SearchingArea>. All nodes in it will be
 * submitted.
 */
export interface StagingNode {
  node: SelectNode
  selected: boolean
}

interface StagingAreaProps {
  nodes: StagingNode[]
  setNodes: (nodes: StagingNode[]) => void

  hint: TextId
  inStagingArea: boolean
  draggable?: boolean
}

const DynamicDraggableNodes = dynamic(() => import('./DraggableNodes'), {
  loading: Spinner,
})

const StagingArea: React.FC<StagingAreaProps> = ({
  nodes,
  setNodes,

  hint,
  inStagingArea,
  draggable,
}) => {
  const toggleSelectNode = (node: SelectNode) => {
    const newNodes = nodes.map(({ node: n, selected: s }) => {
      if (n.id === node.id) {
        return { node, selected: !s }
      }
      return { node: n, selected: s }
    })
    setNodes(newNodes)
  }

  if (!inStagingArea) {
    return null
  }

  return (
    <section className="area">
      {nodes.length > 0 && (
        <section className="selected">
          {/* draggable */}
          {draggable && (
            <DynamicDraggableNodes
              nodes={nodes}
              toggleSelectNode={toggleSelectNode}
              setNodes={setNodes}
            />
          )}

          {/* undraggable */}
          {!draggable && (
            <>
              {nodes.map(({ node, selected }) => (
                <>
                  <SearchSelectNode
                    node={node}
                    selected={selected}
                    onClick={toggleSelectNode}
                    inStagingArea
                  />
                </>
              ))}
            </>
          )}
        </section>
      )}
      <section className="recommend">
        <section className="hint">
          <Translate id={hint} />
        </section>
      </section>
      <style jsx>{styles}</style>
      <style jsx>{areaStyles}</style>
    </section>
  )
}

export default StagingArea
