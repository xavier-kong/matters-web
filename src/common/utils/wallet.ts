import {
  InjectedConnector,
  // NoEthereumProviderError,
  // UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import {
  // UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector,
} from '@web3-react/walletconnect-connector'

import { WalletConnector } from '~/common/enums'

// const supportedChainId = [
//   1, // Mainnet
//   3, // Ropsten
//   4, // Rinkeby
//   5, // Goerli
//   137, // Polygon
//   80001, // Polygon Mumbai
//   10, // Optimistic
//   69, // Optimistic Kovan
//   42161, // Arbitrum One
//   43114, // Avalanche Mainnet
//   250, // Fantom Opera
//   56, // BSC
//   97, // BSC Testnet
// ]

export const walletConnectors = {
  [WalletConnector.MetaMask]: new InjectedConnector({}),
  [WalletConnector.WalletConnect]: new WalletConnectConnector({
    // infuraId: env.infuraId,
  }),
}
