import { computed } from 'vue'
import { useStore } from 'vuex'

import bedBorderLogo from '@/assets/fundDex_icon/bed-border.png'
import dataLogo from '@/assets/fundDex_icon/data-logo.png'
import gmiLogo from '@/assets/fundDex_icon/gmilogo.png'
import iethflipLogo from '@/assets/fundDex_icon/iethfliplogo.svg'
import imaticflipLogo from '@/assets/fundDex_icon/imaticflilogo.svg'
import indexLogo from '@/assets/fundDex_icon/index-token.png'
import maticflipLogo from '@/assets/fundDex_icon/maticflilogo.svg'
import indexCoopFav from '@/assets/fundDex_icon/index-logo-black.png'
// import * as tokenAddresses from 'constants/ethContractAddresses'

export const dpiTokenImage = 'https://index-dao.s3.amazonaws.com/defi_pulse_index_set.svg'

export const indexCoopFavLogo = indexCoopFav

export const DefiPulseIndex = {
    name: 'DeFi Pulse Index',
    symbol: 'DPI',
    address: '0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b',
    image: dpiTokenImage,
    polygonAddress: '0x85955046DF4668e1DD369D2DE9f3AEB98DD2A369',
    coingeckoId: 'defipulse-index',
    tokensetsId: 'dpi',
    tokenSelector: 'dpi',
    linktype: '',
    fees: {
        streamingFee: '0.95%',
    },
}

export const IndexToken = {
    name: 'Index Token',
    symbol: 'INDEX',
    address: '0x0954906da0Bf32d5479e25f46056d22f08464cab',
    polygonAddress: '0xfBd8A3b908e764dBcD51e27992464B4432A1132b',
    image: indexLogo,
    coingeckoId: 'index-cooperative',
    tokensetsId: 'index',
    tokenSelector: 'index',
    linktype: '',
    fees: undefined,
}

export const Ethereum2xFlexibleLeverageIndex = {
    name: 'Ethereum 2x Flexible Leverage Index',
    symbol: 'ETH2x-FLI',
    address: '0xAa6E8127831c9DE45ae56bB1b0d4D4Da6e5665BD',
    polygonAddress: undefined,
    image: 'https://set-core.s3.amazonaws.com/img/portfolios/eth2x_fli.svg',
    coingeckoId: 'eth-2x-flexible-leverage-index',
    tokensetsId: 'ethfli',
    tokenSelector: 'ethfli',
    linktype: '',
    fees: {
        streamingFee: '1.95%',
    },
}

export const Ethereum2xFLIP = {
    name: 'Ethereum 2x FLI Polygon',
    symbol: 'ETH2X-FLI-P',
    address: undefined,
    polygonAddress: '0x3Ad707dA309f3845cd602059901E39C4dcd66473',
    image: 'https://set-core.s3.amazonaws.com/img/portfolios/eth2x_fli.svg',
    coingeckoId: 'index-coop-eth-2x-flexible-leverage-index',
    tokensetsId: 'eth2x-fli-p',
    tokenSelector: 'eth2x-fli-p',
    linktype: '',
    fees: {
        streamingFee: '1.95%',
        mintRedeemFee: '0.1%',
    },
}

export const MetaverseIndex = {
    name: 'Metaverse Index',
    symbol: 'MVI',
    address: '0x72e364F2ABdC788b7E918bc238B21f109Cd634D7',
    polygonAddress: '0xfe712251173A2cd5F5bE2B46Bb528328EA3565E1',
    image: 'https://set-core.s3.amazonaws.com/img/portfolios/mvi.svg',
    coingeckoId: 'metaverse-index',
    tokensetsId: 'mvi',
    tokenSelector: 'mvi',
    linktype: '',
    fees: {
        streamingFee: '0.95%',
    },
}

export const Bitcoin2xFlexibleLeverageIndex = {
    name: 'Bitcoin 2x Flexible Leverage Index',
    symbol: 'BTC2x-FLI',
    address: '0x0B498ff89709d3838a063f1dFA463091F9801c2b',
    polygonAddress: undefined,
    image: 'https://set-core.s3.amazonaws.com/img/portfolios/fli_btc.svg',
    coingeckoId: 'btc-2x-flexible-leverage-index',
    tokensetsId: 'btcfli',
    tokenSelector: 'btcfli',
    linktype: '',
    fees: {
        streamingFee: '1.95%',
    },
}

export const BedIndex = {
    name: 'Bankless BED Index',
    symbol: 'BED',
    address: '0x2aF1dF3AB0ab157e1E2Ad8F88A7D04fbea0c7dc6',
    polygonAddress: undefined,
    image: bedBorderLogo,
    coingeckoId: 'bankless-bed-index',
    tokensetsId: 'bed',
    tokenSelector: 'bed',
    linktype: '',
    fees: {
        streamingFee: '0.25%',
    },
}

export const DataIndex = {
    name: 'Data Economy Index',
    symbol: 'DATA',
    address: '0x33d63Ba1E57E54779F7dDAeaA7109349344cf5F1',
    polygonAddress: '0x1D607Faa0A51518a7728580C238d912747e71F7a',
    image: dataLogo,
    coingeckoId: 'data-economy-index',
    tokensetsId: 'data',
    tokenSelector: 'data',
    linktype: '',
    fees: {
        streamingFee: '0.95%',
    },
}

export const GmiIndex = {
    name: 'Bankless DeFi Innovation Index',
    symbol: 'GMI',
    address: '0x47110d43175f7f2C2425E7d15792acC5817EB44f',
    polygonAddress: '0x7fb27ee135db455de5ab1ccec66a24cbc82e712d',
    image: gmiLogo,
    coingeckoId: 'bankless-defi-innovation-index',
    tokensetsId: 'gmi',
    tokenSelector: 'gmi',
    linktype: '',
    fees: {
        streamingFee: '1.95%',
    },
}

export const Matic2xFLIP = {
    name: 'MATIC 2x Flexible Leverage Index',
    symbol: 'MATIC2x-FLI-P',
    address: undefined,
    polygonAddress: '0xf287D97B6345bad3D88856b26Fb7c0ab3F2C7976',
    image: maticflipLogo,
    coingeckoId: 'index-coop-matic-2x-flexible-leverage-index',
    tokensetsId: 'matic2x-fli-p',
    tokenSelector: 'matic2x-fli-p',
    linktype: '',
    fees: {
        streamingFee: '1.95%',
        mintRedeemFee: '0.1%',
    },
}

export const IMaticFLIP = {
    name: 'Inverse MATIC Flexible Leverage Index',
    symbol: 'iMATIC-FLI-P',
    address: undefined,
    polygonAddress: '0x340f412860dA7b7823df372a2b59Ff78b7ae6abc',
    image: imaticflipLogo,
    coingeckoId: 'index-coop-inverse-matic-flexible-leverage-index',
    tokensetsId: 'imatic-fli-p',
    tokenSelector: 'imatic-fli-p',
    linktype: '',
    fees: {
        streamingFee: '1.95%',
        mintRedeemFee: '0.1%',
    },
}

export const IEthereumFLIP = {
    name: 'Inverse ETH Flexible Leverage Index',
    symbol: 'iETH-FLI-P',
    address: undefined,
    polygonAddress: '0x4f025829C4B13dF652f38Abd2AB901185fF1e609',
    image: iethflipLogo,
    coingeckoId: 'index-coop-inverse-eth-flexible-leverage-index',
    tokensetsId: 'ieth-fli-p',
    tokenSelector: 'ieth-fli-p',
    linktype: '',
    fees: {
        streamingFee: '1.95%',
        mintRedeemFee: '0.1%',
    },
}

export const ICETH = {
    name: 'Interest Compounding ETH Index',
    symbol: 'icETH',
    address: '0x7c07f7abe10ce8e33dc6c5ad68fe033085256a84',
    polygonAddress: undefined,
    image: 'https://assets.coingecko.com/coins/images/24483/small/icETH-token-logo.png?1647826356',
    coingeckoId: 'interest-compounding-eth-index',
    tokensetsId: 'iceth',
    tokenSelector: 'iceth',
    fees: {
        streamingFee: '1.95%',
        mintRedeemFee: '0.1%',
    },
}

export const IBTCFLIP = {
    name: 'Inverse BTC Flexible Leverage Index',
    symbol: 'iBTC-FLI-P',
    address: undefined,
    polygonAddress: '0x130ce4e4f76c2265f94a961d70618562de0bb8d2',
    image: 'https://assets.coingecko.com/coins/images/24177/small/iBTC-FLI-P_pulse_red.png?1646749712',
    coingeckoId: 'inverse-btc-flexible-leverage-index',
    tokensetsId: 'ibtc-fli-p',
    tokenSelector: 'ibtc-fli-p',
    fees: {
        streamingFee: '1.95%',
        mintRedeemFee: '0.1%',
    },
}

export const JGP = {
    name: 'JPG NFT Index',
    symbol: 'JPG',
    address: '0x02e7ac540409d32c90bfb51114003a9e1ff0249c',
    polygonAddress: undefined,
    image: 'https://assets.coingecko.com/coins/images/25071/small/JPG-token-logo-01.png?1650242041',
    coingeckoId: 'jpg-nft-index',
    tokensetsId: 'jpg',
    tokenSelector: 'jpg',
    fees: {
        streamingFee: '5.95%',
        mintRedeemFee: '0.5%',
    },
}

export const productTokensBySymbolList = [
    DefiPulseIndex,
    MetaverseIndex,
    Ethereum2xFlexibleLeverageIndex,
    Ethereum2xFLIP,
    IndexToken,
    Bitcoin2xFlexibleLeverageIndex,
    BedIndex,
    DataIndex,
    GmiIndex,
    Matic2xFLIP,
    IMaticFLIP,
    IEthereumFLIP,
    JGP,
    IBTCFLIP,
    ICETH
]

export const productTokensBySymbol = {
    'DPI': DefiPulseIndex,
    'MVI': MetaverseIndex,
    'ETH2x-FLI': Ethereum2xFlexibleLeverageIndex,
    'ETH2x-FLI-P': Ethereum2xFLIP,
    'INDEX': IndexToken,
    'BTC2x-FLI': Bitcoin2xFlexibleLeverageIndex,
    'BED': BedIndex,
    'DATA': DataIndex,
    'GMI': GmiIndex,
    'M2x-FLI-P': Matic2xFLIP,
    'IM-FLI-P': IMaticFLIP,
    'IEth-FLI-P': IEthereumFLIP,
    'JGP': JGP,
    'IBTCFLIP': IBTCFLIP,
    'ICETH': ICETH
}
