import { Card, Text } from '@nextui-org/react'
import { FC } from 'react'
import { dateFunctions } from '../../utils'

interface Props {
  title: string
  message: string
  date: string | Date
  name: string
}

export const CardMessage: FC<Props> = ({ date, message, name, title }) => {
  return (
    <Card isHoverable css={{
      backgroundColor: '#fff',
      padding: '0.5rem',
    }}>
      <Card.Body>
        <Text size={16} b color='#000'>{title}</Text>
        <Text size={14} color='#000'>{message}</Text>
        <div className="flex justify-between w-full mt-2">
          <Text size={12} color='#6a6a6a'>{dateFunctions.formatDate(date, 'LLL')}</Text>
          <Text size={14} color='#000' weight='extrabold'>{name}</Text>
        </div>
      </Card.Body>
    </Card>
  )
}
