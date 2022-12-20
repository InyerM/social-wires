import { useContext } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Button, Checkbox, Input, Spacer, Text } from '@nextui-org/react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { AuthContext } from '../../context/auth'
import { validations } from '../../utils'

interface Data {
  email: string
  password: string
  username: string
  fullName: string
}

const SignUpPage = () => {
  const router = useRouter()
  const { isLoggedIn, registerUser } = useContext(AuthContext)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Data>()

  const onSubmit = async (data: Data) => {
    const { hasError, message } = await registerUser(
      data.fullName,
      data.email,
      data.password,
      data.username
    )

    if (hasError) {
      toast.error(message, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }

    router.push('/app/messages')
  }

  if (isLoggedIn) {
    router.push('/app/messages')
  }

  return (
    <div className="w-full h-screen">
      <Head>
        <title>Wires | Signup</title>
      </Head>
      <form
        className="flex flex-col justify-center h-full max-w-md gap-2 px-2 mx-auto"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Text h1 b size={30} className="text-center">
          Welcome to Wires
        </Text>
        <Button
          bordered
          rounded
          css={{
            width: '100%'
          }}
          onClick={() => router.push('/auth/login')}
        >
          Sign in
        </Button>
        <Spacer y={1} />
        <Input
          placeholder="Nickname"
          fullWidth
          bordered
          label="Nickname"
          color="primary"
          rounded
          {
            ...register('username', {
              required: 'Nickname is required',
            })
          }
          helperColor='error'
          helperText={ errors.username?.message }
          status={ !!errors.username ? 'error' : 'default' }
        />
        <Spacer y={0.5} />
        <Input
          placeholder="Full name"
          fullWidth
          bordered
          label="Name"
          color="primary"
          rounded
          {
            ...register('fullName', {
              required: 'Name is required',
            })
          }
          helperColor='error'
          helperText={ errors.fullName?.message }
          status={ !!errors.fullName ? 'error' : 'default' }
        />
        <Spacer y={0.5} />
        <Input
          placeholder="example@gmail.com"
          fullWidth
          bordered
          label="Email address"
          color="primary"
          rounded
          {
            ...register('email', {
              required: 'Email is required',
              validate: validations.isEmail
            })
          }
          helperColor='error'
          helperText={ errors.email?.message }
          status={ !!errors.email ? 'error' : 'default' }
        />
        <Spacer y={0.5} />
        <Input.Password
          placeholder="********"
          fullWidth
          bordered
          label="Password"
          color="primary"
          rounded
          {
            ...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must have at least 6 characters'
              }
            })
          }
          helperColor='error'
          helperText={ errors.password?.message }
          status={ !!errors.password ? 'error' : 'default' }
        />
        <Spacer y={1} />
        <Button
          css={{
            backgroundColor: '#fff',
            color: '#000',
            width: '100%'
          }}
          rounded
          type="submit"
        >
          Create
        </Button>
      </form>
    </div>
  )
}

export default SignUpPage
