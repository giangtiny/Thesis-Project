import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useToggle } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Anchor,
  Stack
} from '@mantine/core';
import { IconGoogle } from '@/icons/index';

export default function AuthenticationForm(props: PaperProps) {
  const [type, toggle] = useToggle(['login', 'register']);
  const router = useRouter();
  const { mode } = router.query;
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      rePassword: ''
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Email không hợp lệ'),
      password: (val) => (val.length <= 8 ? 'Mật khẩu cần chứa ít nhất 8 kí tự' : null),
      rePassword: (val, form) => (val === form.password ? null : 'Mật khẩu không trùng khớp')
    }
  });

  useEffect(() => {
    mode === 'register' ? toggle('register') : toggle('login');
  }, [mode, toggle]);

  return (
    <Paper radius="md" p="xl" withBorder {...props} shadow="sm">
      <Button
        variant="default"
        color="gray"
        fullWidth
        radius="xl"
        leftIcon={<IconGoogle style={{ width: 20 }} />}>
        {type === 'login' ? 'Đăng nhập' : 'Đăng ký'} với google
      </Button>

      <Divider label="Hoặc tiếp tục với email" labelPosition="center" my="lg" />
      <form onSubmit={form.onSubmit(() => {})}>
        <Stack>
          <TextInput
            required
            label="Email"
            placeholder="abc@gmail.com"
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email && 'Email không hợp lệ'}
          />

          <PasswordInput
            required
            label="Mật khẩu"
            placeholder="Mật khẩu của bạn"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'Mật khẩu cần chứa ít nhất 8 kí tự'}
          />
          {type === 'register' && (
            <PasswordInput
              required
              label="Nhập lại mật khẩu"
              placeholder="Mật khẩu của bạn"
              value={form.values.rePassword}
              onChange={(event) => form.setFieldValue('rePassword', event.currentTarget.value)}
              error={form.errors.rePassword && 'Mật khẩu không trùng khớp'}
            />
          )}
        </Stack>

        <Group position="apart" mt="xl">
          <Anchor
            component="button"
            type="button"
            color="dimmed"
            onClick={() => toggle()}
            size="sm">
            {type === 'register'
              ? 'Đã có tài khoản? Đăng nhập ngay'
              : 'Chưa có tài khoản? Đăng ký ngay'}
          </Anchor>
          <Button type="submit" color="teal">
            {type === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
