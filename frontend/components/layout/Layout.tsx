import { FC, useContext } from 'react'
import Head from 'next/head'

import { NavBar } from './'
import { AuthContext } from '../../context/auth'
import { useRouter } from 'next/router'

interface Props {
  title?: string
  description?: string
  children?: React.ReactNode
}

export const Layout: FC<Props> = ({ title, description, children }) => {
  const router = useRouter()
  const { isLoggedIn } = useContext(AuthContext)

  if (!isLoggedIn && typeof window !== 'undefined') {
    router.push('/auth/login')
  }
  
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <div
        className='max-w-full'
      >
        <NavBar />
        <main className='mx-auto my-5 max-w-7xl'>
          {children}
        </main>
      </div>
    </>
  )
}