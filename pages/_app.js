import '../styles/globals.css'

import {TokenNameProvider,TokenSymbolProvider,DecimalPointProvider,TotalSupplyProvider} from '../lib/ThemeContext'
import {VotingProvider,MembershipProvider,SafeAddProvider} from '../lib/ThemeContext'
function MyApp({ Component, pageProps }) {
  return (
    <SafeAddProvider>
    <TokenNameProvider>
    <TokenSymbolProvider>
    <DecimalPointProvider>
    <TotalSupplyProvider>
    <VotingProvider>
    <MembershipProvider>
    
      <Component {...pageProps} />
    
    </MembershipProvider>
    </VotingProvider>
    </TotalSupplyProvider>
    </DecimalPointProvider>
    </TokenSymbolProvider>
    </TokenNameProvider>
    </SafeAddProvider>
  
  )
}

export default MyApp