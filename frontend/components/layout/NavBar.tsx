import { useContext, useState, useEffect } from 'react';
import { Navbar, Text } from '@nextui-org/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Menu } from '@headlessui/react'
import {
  menu,
  create,
  send,
  chatBubbles,
  logInSharp,
  chatbox
} from '../../public/icons'
import { CustomDropdown } from '../ui'
import { AuthContext } from '../../context/auth'
import { IMessage, IMessageResponse } from '../../interfaces'
import { wiresApi } from '../../api';
import { toast } from 'react-toastify';

const options = [
  {
    label: 'Create Messages',
    icon: <Image src={create} alt="create" width={20} height={20} />,
    value: 'create',
    href: '/app/create'
  },
  {
    label: 'My Messages',
    icon: <Image src={send} alt="send" width={20} height={20} />,
    value: 'send',
    href: '/app/my-messages'
  },
  {
    label: 'See all messages',
    icon: <Image src={chatBubbles} alt="chatBubbles" width={20} height={20} />,
    value: 'chatBubbles',
    href: '/app/messages'
  },
]

export const NavBar = () => {
  const { logout } = useContext(AuthContext)
  const router = useRouter()

  const [messages, setMessages] = useState<IMessage[]>([])


  useEffect(() => {
    getData()
  }, [])

  const getData = async (date?:string) => {
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
        config,
      )
      const { data, ok } = dataFromApi
      if (ok && data) {
        setMessages(data as IMessage[])
      }
    } catch (error) {
    }
  }
  
  return (
    <Navbar variant='floating'>
      <Navbar.Brand>
        <Text b color="primary" size={45} weight="normal">
          Wires
        </Text>
      </Navbar.Brand>
      <Navbar.Content>
        <CustomDropdown
          button={
            <Image
              src={chatbox}
              alt="menu"
              width={25}
              height={25}
              className="cursor-pointer"
            />
          }
        >
          <div className="px-3 py-6">
            <Menu.Item>
              {
                messages.length > 0 ? (
                  <div>
                    <Text b size={16} weight="bold" color="#16202a">
                      Recent posts
                    </Text>
                    {
                      messages.map((message, index) => (
                        <div key={index} className='flex flex-col my-2'>
                          <Text b size={12} weight="bold" color="#16202a" className='overflow-hidden text-ellipsis'>
                            {message.title}
                          </Text>
                          <Text b size={12} weight="normal" color="#16202a" className='overflow-hidden text-ellipsis'>
                            {message.text}
                          </Text>
                        </div>
                      ))
                    }
                  </div>
                ) : (
                  <Text b size={16} weight="normal" color="#16202a">
                    No messages
                  </Text>
                )
              }
              {/* <Text b size={16} weight="normal" color="#16202a">
                recent posts
              </Text> */}
            </Menu.Item>
          </div>
        </CustomDropdown>
        <CustomDropdown
          button={
            <Image
              src={menu}
              alt="menu"
              width={30}
              height={30}
              className="cursor-pointer"
            />
          }
        >
          <div className="p-2">
            <Menu.Item>
              <div className='px-2 py-4'>
                <Text b size={20} weight="normal" color="#16202a">
                  InyerM
                </Text>
              </div>
            </Menu.Item>
            {options.map((option, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-primary' : ''
                    } group flex w-full items-center rounded-md p-2 text-sm text-secondary`}
                    onClick={() => router.push(option.href)}
                  >
                    {option.icon}
                    <span className="ml-3">{option.label}</span>
                  </button>
                )}
              </Menu.Item>
            ))}
            <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-primary' : ''
                    } group flex w-full items-center rounded-md p-2 text-sm text-secondary`}
                    onClick={() => logout()}
                  >
                    <Image src={logInSharp } alt="logInSharp" width={20} height={20} />
                    <span className="ml-3">Log out</span>
                  </button>
                )}
              </Menu.Item>
          </div>
        </CustomDropdown>
      </Navbar.Content>
    </Navbar>
  )
}
