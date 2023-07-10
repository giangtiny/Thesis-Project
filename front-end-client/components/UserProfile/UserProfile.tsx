import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
  NumberInput
} from '@mantine/core';

export function UserProfile() {
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
      phone: ''
    },

    validate: {
      //  email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length >= 6 ? null : 'Mật khẩu phải có ít nhất 6 ký tự'),
      name: (val) => (val.length >= 1 ? null : 'Tên không được để trống'),
      phone: (val) =>
        /^(0?)(3[2-9]|5[689]|7[06-9]|8[0-689]|9[0-46-9])[0-9]{7}$/.test(val)
          ? null
          : 'Số điện thoại không đúng định dạng'
    }
  });

  return (
    <Paper radius="md" p="xl" withBorder>
      <Text size="lg" weight={500}>
        Thông tin tài khoản của bạn:
      </Text>

      <Divider labelPosition="center" my="lg" />

      <form
        onSubmit={form.onSubmit(() => {
          console.log(form.values);
        })}>
        <Stack>
          <TextInput
            label="Email"
            placeholder="hello@mantine.dev"
            value={form.values.email || 'hello@mantine.dev'}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email && 'Invalid email'}
            radius="md"
            disabled
          />
          <TextInput
            label="Họ và tên"
            placeholder="Thay đổi họ và tên"
            value={form.values.name}
            onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
            radius="md"
          />
          <TextInput
            type="number"
            label="Số điện thoại"
            placeholder="Thay đổi số điện thoại"
            value={form.values.phone}
            onChange={(event) => form.setFieldValue('phone', event.currentTarget.value)}
            radius="md"
            error={form.errors.phone}
          />

          <PasswordInput
            label="Password"
            placeholder="Thay đổi mật khẩu"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'Password should include at least 6 characters'}
            radius="md"
          />
        </Stack>

        <Group position="apart" mt="xl">
          <Anchor component="button" type="button" color="dimmed" size="xs"></Anchor>
          <Button type="submit" radius="xl">
            Lưu
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
