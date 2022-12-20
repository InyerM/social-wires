import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { FormElement, Grid, Input, Loading, Spacer, Text } from '@nextui-org/react'

import { Layout } from '../../components/layout'
import { CardMessage } from '../../components/ui'
import { HiOutlineSearch } from 'react-icons/hi'
import { AuthContext } from '../../context/auth'
import { wiresApi } from '../../api'
import { IMessage, IMessageResponse } from '../../interfaces'
import { toast } from 'react-toastify';

const MessagesPage = () => {
  const [messages, setMessages] = useState<IMessage[]>([])
  const [search, setSearch] = useState<string>('')
  const [date, setDate] = useState<string>('')

  useEffect(() => {
    getData()
  }, [])

  const getData = async (search?: string, date?:string) => {

    let url = '/messages'

    const token = localStorage.getItem('token')
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    if (search && date) {
      url = `${url}?search=${search}&dateFilter=${date}`
    }
    else if (search) {
      url = `${url}?search=${search}`
    }
    else if (date) {
      url = `${url}?dateFilter=${date}`
    }

    try {
      const { data: dataFromApi } = await wiresApi.get<IMessageResponse>(
        url,
        config,
      )
      const { data, ok } = dataFromApi
      if (ok && data) {
        setMessages(data as IMessage[])
      }
    } catch (error) {
      toast.error('Error getting messages', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  const handleSearch = (e: React.ChangeEvent<FormElement>) => {
    const { value } = e.target
    setSearch(value)
    getData(value, date)
  }

  const handleDate = (e: React.ChangeEvent<FormElement>) => {
    const { value } = e.target
    setDate(value)
    getData(search, value)
  }

  return (
    <Layout title="All messages" description="Here you can see all messages">
      <section className="flex flex-col justify-center max-w-lg gap-2 px-5 mx-auto md:px-2">
        <Spacer y={1} />
        <Text h1 b size={30} color="primary">
          All messages
        </Text>
        <Spacer y={1} />
        <Input
          placeholder="Search"
          fullWidth
          bordered
          label="What search"
          color="primary"
          contentRight={<HiOutlineSearch />}
          clearable
          rounded
          onChange={handleSearch}
        />
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
    </Layout>
  )
}

export default MessagesPage
