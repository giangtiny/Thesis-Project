import React, { useEffect, useState } from 'react';
import { useHeaderStyles } from './Header.style';
import SearchBar from '@/components/Searchbar';
import AccountHeader from '@/components/AccountHeader';
import { getUserInfo } from '@/api/user';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/redux/store';
import { userActions } from '@/redux/slices';
import { selectUser } from '@/redux/selectors';
import { ASSET_ROLE } from '@/constants/asset';

export default function Header() {
  const [account, setAccount] = useState({
    image: "abc",
    name: "Nguyễn Thị Bưởi",
    role: "Quản trị viên"
  })
  const dispatch = useAppDispatch();
  const { setUserInfo } = userActions;
  // const userSelected = useSelector(selectUser);
  const { classes } = useHeaderStyles();
  useEffect(() => {
    const handleGetUserInfo = async () => {
      await getUserInfo()
        .then((response) => {
          if (!ASSET_ROLE.includes(response?.data.role)) {
            window.location.pathname = '/login';
          }
          setAccount({ ...account, name: response?.data.user[0].name })
          // dispatch(setUserInfo({data: response?.data}));
        })
        .catch(() => {
          console.log('get user\'s information fail')
        })
    }
    if (localStorage.getItem('jwtKeyTreBay') !== null) {
      handleGetUserInfo();
    }
  }, [])
  return (
    <div className={classes.header}>
      <SearchBar className={classes.search} />
      <AccountHeader {...account} />
    </div>
  )
}