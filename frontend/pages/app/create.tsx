import { Button, Input, Spacer, Text, Textarea } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { wiresApi } from '../../api'
import { Layout } from '../../components/layout'
import { IMessageResponse } from '../../interfaces'

interface Data {
  title: string
  message: string
}

export default function CreatePage() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Data>()
  const router = useRouter()

  const onSubmit = async (data: Data) => {
    try {   
      const token = localStorage.getItem('token')

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const { data: dataFromApi } = await wiresApi.post<IMessageResponse>('/messages', {
        title: data.title,
        text: data.message
      }, config)
  
      const { ok, message } = dataFromApi
  
      if (ok) {
        router.push('/app/messages')
        toast.success('Created successfully', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
        return 
      } 
      
      toast.error('Error creating message', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } catch (error) {
      toast.error('Error creating message', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  return (
    <Layout
      title="Create message"
      description="This is the page to create a message"
    >
      <form
        className="flex flex-col justify-center max-w-lg gap-2 px-5 mx-auto md:px-2"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Spacer y={1} />
        <Text h1 b size={30} color="primary">
          Create message
        </Text>
        <Spacer y={1} />
        <Input
          placeholder="Talk about me"
          fullWidth
          bordered
          label="Title message"
          color="primary"
          rounded
          {...register('title', { required: 'Title is required' })}
          helperColor='error'
          helperText={ errors.title?.message }
          status={ !!errors.title ? 'error' : 'default' }
        />
        <Spacer y={0.5} />
        <Textarea
          placeholder="Create a message for share with friends"
          fullWidth
          bordered
          label="Message"
          color="primary"
          {...register('message', { required: 'Message is required' })}
          helperColor='error'
          helperText={ errors.message?.message }
          status={ !!errors.message ? 'error' : 'default' }
        />
        <Spacer y={1} />
        <Button
          size="md"
          css={{
            backgroundColor: '#fff',
            color: '#000'
          }}
          rounded
          auto
          type="submit"
        >
          Share
        </Button>
      </form>
    </Layout>
  )
}
