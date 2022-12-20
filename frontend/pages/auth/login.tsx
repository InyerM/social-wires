import { useContext } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Button, Checkbox, Input, Spacer, Text } from '@nextui-org/react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { validations } from '../../utils'
import { AuthContext } from '../../context/auth'

interface Data {
  email: string
  password: string
}

const LoginPage = () => {
  const router = useRouter()
  const { isLoggedIn, logginUser } = useContext(AuthContext)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Data>()

  const onSubmit = async (data: Data) => {
    const login = await logginUser(data.email, data.password)

    if (!login) {
      toast.error('Invalid credentials', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      return
    }
    
    router.push('/app/messages')
  }

  if (isLoggedIn) {
    router.push('/app/messages')
  }

  return (
    <div className="w-full h-screen">
      <Head>
        <title>Wires | Login</title>
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
          onClick={() => router.push('/auth/signup')}
        >
          Sign up
        </Button>
        <Spacer y={1} />
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
        <Spacer y={0.2} />
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
          type='submit'
        >
          Sign in
        </Button>
        <Checkbox size="xs">Remember me</Checkbox>
      </form>
    </div>
  )
}

export default LoginPage
