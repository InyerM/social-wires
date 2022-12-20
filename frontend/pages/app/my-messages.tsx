import { useContext, useEffect, useState } from 'react'
import {
  FormElement,
  Grid,
  Input,
  Loading,
  Spacer,
  Text
} from '@nextui-org/react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'

import { Layout } from '../../components/layout'
import { CardMessage } from '../../components/ui'
import { AuthContext } from '../../context/auth'
import { IMessage, IMessageResponse } from '../../interfaces'
import { wiresApi } from '../../api'

const MyMessagesPage = () => {
  const router = useRouter()
  const { isLoggedIn } = useContext(AuthContext)
  const [messages, setMessages] = useState<IMessage[]>([])

  if (!isLoggedIn && typeof window !== 'undefined') {
    router.push('/auth/login')
  }

  useEffect(() => {
    getData()
  }, [])

  const getData = async (date?: string) => {
    let url = '/my-messages'

    const token = localStorage.getItem('token')
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    if (date) {
      url = `${url}?dateFilter=${date}`
    }

    try {
      const { data: dataFromApi } = await wiresApi.get<IMessageResponse>(
        url,
        config
      )
      const { data, ok } = dataFromApi
      if (ok && data) {
        setMessages(data as IMessage[])
      }
    } catch (error) {}
  }

  const handleDate = (e: React.ChangeEvent<FormElement>) => {
    const { value } = e.target
    getData(value)
  }

  return (
    <Layout title="My messages" description="Here you can see your messages">
      {messages.length > 0 ? (
        <>
          <section className="flex flex-col justify-center max-w-lg gap-2 px-5 mx-auto md:px-2">
            <Spacer y={1} />
            <Text h1 b size={30} color="primary">
              My messages
            </Text>
            <Spacer y={1} />

            <Input
              fullWidth
              bordered
              type="date"
              label="Date select"
              color="primary"
              rounded
              onChange={handleDate}
            />
            <Spacer y={1} />
          </section>
          <Grid.Container gap={2} className="px-5 mx-auto md:px-2">
            {messages.length === 0 ? (
              <Loading />
            ) : (
              messages.map((message, index) => (
                <Grid xs={12} sm={12} md={4} key={index}>
                  <CardMessage
                    title={message.title}
                    message={message.text}
                    date={message.createdAt}
                    name={message.user.fullName}
                  />
                </Grid>
              ))
            )}
          </Grid.Container>
        </>
      ) : (
        <Text h1 b size={30} color="primary">
          You dont have messages
        </Text>
      )}
    </Layout>
  )
}

export default MyMessagesPage
