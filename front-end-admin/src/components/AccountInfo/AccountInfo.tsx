import { useEffect, useState } from "react";
import { TextInput, Group, Button, PasswordInput, Select, Alert, Text } from '@mantine/core';
import { useForm, UseFormReturnType } from "@mantine/form";
import { UserProps, HotelProps } from "@/utils/types";
import { api } from '@/api/axios';
import { addUserInfo, updateUserInfo } from "@/api/user";
import { getAllHotel } from "@/api/hotel";
import { accountFormInputProps } from "@/constants/forms";
import { closeAllModals } from "@mantine/modals";

interface FormValues {
  ID?: string,
  name: string,
  phoneNumber: string,
  username: string,
  password: string,
  avatar: string,
  email: string,
  address: string,
  role: string,
  staffHotel: string
}

interface HotelOfStaff {
  label: string;
  value: string;
}

export default function AccountInfo({ type, account, setUpdated, updated }: { type: string, account?: UserProps, setUpdated: React.Dispatch<React.SetStateAction<boolean>>, updated: boolean }) {
  const dataRole = []
  const [isStaff, setIsStaff] = useState(false);
  const [listHotel, setListHotel] = useState<HotelOfStaff[]>([]);
  for (let role in accountFormInputProps) {
    //@ts-ignore
    dataRole.push({ value: role, label: accountFormInputProps[role] })
  }

  const addUser = async () => {
    const dataAddUser = changeFields();
    //@ts-ignore
    const dataUser: UserProps = { role: 'ROLE_USER', ...dataAddUser };
    const response = addUserInfo(dataUser);
    response.then(() => {
      setUpdated(!updated);
      closeAllModals();
    })
      .catch((error) => {
        console.log(error);
      })
  }
  const updateUser = async () => {
    const dataUpdateUser = { ID: account?.ID, ...changeFields() }
    //@ts-ignore
    const response = updateUserInfo(dataUpdateUser);
    response.then(() => {
      setUpdated(!updated);
      closeAllModals();
    })
      .catch((error) => {
        console.log(error);
      })
  }
  //@ts-ignore
  const form = useForm<FormValues>({
    initialValues: {
      ID: '',
      name: '',
      phoneNumber: '',
      username: '',
      password: '',
      avatar: '',
      email: '',
      address: '',
      role: 'ROLE_USER',
      staffHotel: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email không đúng định dạng'),
      phoneNumber: (value) => (!(/^(84|0)[3|5|7|8|9]([0-9]{8})$/.test(value)) && form.isDirty('phoneNumber') ?
        'Số điện thoại không đúng định dạng' : null),
      password: (value) => ((/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/.test(value) ||
        (type === 'update' && !form.isDirty('password'))) ?
        null : 'Mật khẩu yêu cầu dài từ 8 đến 25 ký tự, phải ba gồm ký tự thường, ký tự hoa và chữ số.'),
      username: (value) => (/^[a-zA-Z0-9_]{6,}$/.test(value)) ?
        null : 'Tên đăng nhập yêu cầu tối thiểu 6 ký tự bao gồm các ký tự từ a-z, A-Z, 0-9 và dấu _',
      staffHotel: (value: string) => (value === '' && isStaff) ? 'Vui lòng chọn khách sạn cho nhân viên đối tác' : null
    },
  });

  const changeFields = () => {
    const dataChange = {}
    if (form.isDirty('password')) {
      //@ts-ignore
      dataChange['password'] = form.getInputProps('password').value;
    }
    if (form.isDirty('name')) {
      //@ts-ignore
      dataChange['name'] = form.getInputProps('name').value;
    }
    if (form.isDirty('email')) {
      //@ts-ignore
      dataChange['email'] = form.getInputProps('email').value;
    }
    if (form.isDirty('address')) {
      //@ts-ignore
      dataChange['address'] = form.getInputProps('address').value;
    }
    if (form.isDirty('username')) {
      //@ts-ignore
      dataChange['username'] = form.getInputProps('username').value;
    }
    if (form.isDirty('role')) {
      //@ts-ignore
      dataChange['role'] = form.getInputProps('role').value;
    }
    if (form.isDirty('phoneNumber')) {
      //@ts-ignore
      dataChange['phoneNumber'] = form.getInputProps('phoneNumber').value;
    }
    return dataChange;
  }

  useEffect(() => {
    if (type === 'update' && account) {
      form.setValues({ ID: account.ID, name: account.name, phoneNumber: account.phoneNumber, username: account.username, email: account.email, address: account.address, role: account.role });
    };
    const response = getAllHotel();
    response.then((result) => {
      console.log(result);
      if (Array.isArray(result)) {
        setListHotel(result.map((item : HotelProps) => {
          return {label: item.name, value: item.id}
        }))
      }
    })
  }, [])

  return (
    <>
      <form
        onSubmit={form.onSubmit(type === 'add' ? addUser : updateUser)}
      >
        <TextInput
          label="Tên đăng nhập"
          placeholder="Nhập tên đăng nhập"
          {...form.getInputProps('username')}
        />
        <PasswordInput
          label="Mật khẩu"
          placeholder="Nhập mật khẩu"
          {...form.getInputProps('password')}
        />
        <TextInput
          label="Email"
          placeholder="Nhập email"
          {...form.getInputProps('email')}
        />
        <TextInput
          label="Tên"
          placeholder="Nhập tên khách hàng"
          {...form.getInputProps('name')}
        />
        <TextInput
          label="Số điện thoại"
          placeholder="Nhập số điện thoại"
          {...form.getInputProps('phoneNumber')}
        />
        <TextInput
          label="Địa chỉ"
          placeholder="Nhập địa chỉ"
          {...form.getInputProps('address')}
        />
        <Select label="Quyền"
          {...form.getInputProps('role')}
          data={dataRole}
          onChange={(value) => {
            form.setFieldValue('role', value);
            if (value === 'ROLE_STAFF_COLLABORATOR') {
              setIsStaff(true);
            }
            else {
              setIsStaff(false);
            }
          }}
          required
        />
        {isStaff && <Select label="Khách sạn"
          {...form.getInputProps('staffHotel')}
          data={listHotel}
          required
        />}
        <Group position="right" mt="md">
          <Button variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button color='teal' type="submit">Submit</Button>
        </Group>
      </form>
    </>
  )
}