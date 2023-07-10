import { upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  Title,
  Button,
  Flex,
  Stack,
  Container,
} from '@mantine/core';
import { useLoginStyles } from './Login.Styles';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/redux/store';
import { userActions } from '@/redux/slices';
import { selectUser } from '@/redux/selectors';
import { login } from '@/api/login';
//@ts-ignore
import { ReactComponent as Logo } from './../../assets/logo.svg';

export default function Login() {
  const { classes, cx } = useLoginStyles();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {setUser} = userActions;
  const userSelected = useSelector(selectUser);

  const form = useForm({
    initialValues: {
      username: '',
      password: ''
    },

    validate: {
      username: (value) => (/^[a-zA-Z0-9_]{6,}$/.test(value) ? null : 'invalid' ),
      password: (value) => (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/.test(value) ? null : 'invalid')
    },
  });

  const handleLogin = async (account:{username: string, password: string}) => {
    await login(account)
      .then((response) =>{
        //@ts-ignore
        if (response.statusText='OK'){
          //@ts-ignore
          dispatch(setUser({logged: true, jwtKey: response.data}))
          //@ts-ignore
          localStorage.setItem("jwtKeyTreBay", response.data);
          navigate('/hotel');
        }
      })
      .catch(() => {
        console.log('login fail')
      })
  }

  return (
    <Flex
      justify="center"
      align="center"
      direction="column"
      gap='lg'
      className={classes.background}
    >
      <Logo style={{ width: 200 }} />
      <Paper radius="md" shadow="xl" p="xl" withBorder className={classes.formLogin} >
        <Text size="xl" weight={500} ta="center" mb='md'>
          ĐĂNG NHẬP
        </Text>
        <form onSubmit={form.onSubmit(() => {
          handleLogin(form.values)
         })}>
          <Stack>
            <TextInput
              required
              label="Tên đăng nhập"
              placeholder="Tên đăng nhập"
              value={form.values.username}
              onChange={(event) => form.setFieldValue('username', event.currentTarget.value)}
              error={form.errors.username && 'Tên đăng nhập yêu cầu tối thiểu 6 ký tự bao gồm các ký tự từ a-z, A-Z, 0-9 và dấu _'}
            />

            <PasswordInput
              required
              label="Mật khẩu"
              placeholder="Mật khẩu"
              value={form.values.password}
              onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
              error={form.errors.password && 'Mật khẩu yêu cầu dài từ 8 đến 25 ký tự, phải ba gồm ký tự thường, ký tự hoa và chữ số.'}
            />
          </Stack>

          <Group position="center" mt="xl">
            <Button color="teal" type="submit">Đăng nhập</Button>
          </Group>
        </form>
      </Paper>
    </Flex>
  );
}