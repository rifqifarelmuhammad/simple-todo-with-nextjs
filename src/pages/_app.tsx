import { ChakraProvider } from '@chakra-ui/react'
import '../styles/globals.css'
import { AuthContextProvider } from '@contexts'
import { Toast } from 'compfest-silicon'
import type { AppProps } from 'next/app'
import { Navbar } from '@elements'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <AuthContextProvider>
        <Navbar />
        <div className="p-2 md:p-6 flex flex-col md:h-screen md:flex-row gap-6 bg-cyan-500 text-[#202F45] font-rFlex">
          <Component {...pageProps} />
        </div>
        <Toast />
      </AuthContextProvider>
    </ChakraProvider>
  )
}
