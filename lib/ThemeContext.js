import React, { useContext, useState } from 'react'

export const themes = "0x"


export const ThemeContext = React.createContext({
  theme: "0x",
  setTheme: async (themes) => null,
})

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes)

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}



export const Votings = "0x"


export const VotingContext = React.createContext({
  Voting: "0x",
  setVoting: async (Votings) => null,
})

export const useVoting = () => useContext(VotingContext)

export const VotingProvider = ({ children }) => {
  const [Voting, setVoting] = useState(Votings)

  return <VotingContext.Provider value={{ Voting, setVoting }}>{children}</VotingContext.Provider>
}


export const Memberships = "0x"

export const MembershipContext = React.createContext({
  Membership: "0x",
  setMembership: async (Memberships) => null,
})

export const useMembership = () => useContext(MembershipContext)

export const MembershipProvider = ({ children }) => {
  const [Membership, setMembership] = useState(Memberships)

  return <MembershipContext.Provider value={{ Membership, setMembership }}>{children}</MembershipContext.Provider>
}


export const SafeAdds = "0x"

export const SafeAddContext = React.createContext({
  SafeAdd: "0x",
  setSafeAdd: async (SafeAdds) => null,
})

export const useSafeAdd = () => useContext(SafeAddContext)

export const SafeAddProvider = ({ children }) => {
  const [SafeAdd, setSafeAdd] = useState(SafeAdds)

  return <SafeAddContext.Provider value={{ SafeAdd, setSafeAdd }}>{children}</SafeAddContext.Provider>
}




export const TokenNames = "0x"

export const TokenNameContext = React.createContext({
  TokenName: "0x",
  setTokenName: async (TokenNames) => null,
})

export const useTokenName = () => useContext(TokenNameContext)

export const TokenNameProvider = ({ children }) => {
  const [TokenName, setTokenName] = useState(TokenNames)

  return <TokenNameContext.Provider value={{ TokenName, setTokenName }}>{children}</TokenNameContext.Provider>
}

export const TokenSymbols = "0x"

export const TokenSymbolContext = React.createContext({
  TokenSymbol: "0x",
  setTokenSymbol: async (TokenSymbols) => null,
})

export const useTokenSymbol = () => useContext(TokenSymbolContext)

export const TokenSymbolProvider = ({ children }) => {
  const [TokenSymbol, setTokenSymbol] = useState(TokenSymbols)

  return <TokenSymbolContext.Provider value={{ TokenSymbol, setTokenSymbol }}>{children}</TokenSymbolContext.Provider>
}

export const TotalSupplys = "0x"

export const TotalSupplyContext = React.createContext({
  TotalSupply: "0x",
  setTotalSupply: async (TotalSupplys) => null,
})

export const useTotalSupply = () => useContext(TotalSupplyContext)

export const TotalSupplyProvider = ({ children }) => {
  const [TotalSupply, setTotalSupply] = useState(TotalSupplys)

  return <TotalSupplyContext.Provider value={{ TotalSupply, setTotalSupply }}>{children}</TotalSupplyContext.Provider>
}


export const DecimalPoints = "0x"

export const DecimalPointContext = React.createContext({
  DecimalPoint: "0x",
  setDecimalPoint: async (DecimalPoints) => null,
})

export const useDecimalPoint = () => useContext(DecimalPointContext)

export const DecimalPointProvider = ({ children }) => {
  const [DecimalPoint, setDecimalPoint] = useState(DecimalPoints)

  return <DecimalPointContext.Provider value={{ DecimalPoint, setDecimalPoint }}>{children}</DecimalPointContext.Provider>
}