import {Text} from '@mantine/core'
import { openModal } from '@mantine/modals';
import AccountInfo from '@/components/AccountInfo';
import { UseFormReturnType } from '@mantine/form';
import { UserProps } from '@/utils/types';

export const accountInfoModal = (type: string, updated: boolean, setUpdated: React.Dispatch<React.SetStateAction<boolean>>, account?: UserProps) => {  
  return (
    openModal({
      title: <Text  fw={600} fz='lg'>Thông tin tài khoản</Text>,
      children: <AccountInfo type={type} account={account} setUpdated={setUpdated} updated={updated} />,
      size : 'lg'
    })
  )
} 