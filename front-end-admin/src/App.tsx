import React, { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ComingSoon from '@/pages/ComingSoon';
import {
  LOGIN,
  HOTEL,
  VILLA,
  TOWNHOUSE,
  ACCOUNTS,
  ORDERS,
  SETTING,
  DETAIL,
  NEWS,
} from '@/constants/routes';
import AccountsPage from '@/pages/Accounts';
import Home from '@/pages/Home';
import HotelDetailPage from '@/pages/HotelDetailPage';
import VillaPage from '@/pages/Villa';
import VillaDetailPage from '@/pages/VillaDetailPage';
import TownHousePage from '@/pages/Townhouse';
import TownhouseDetailPage from './pages/TownhouseDetailPage';
import DetailPage from '@/pages/Detail';
import LoginPage from './pages/Login';
import Layout from '@/components/Layout';
import { selectUser } from '@/redux/selectors';
import OrdersPage from '@/pages/Orders';
import OrderDetailPage from '@/pages/OrderDetail';
import NewsPage from "./pages/News";

function App() {
  const userSelected = useSelector(selectUser);
  const isHaveKey = localStorage.getItem('jwtKeyTreBay');
  const ProtectedRoute = ({ isAllow }: { isAllow: boolean }) => {
    return isAllow ? <Outlet /> : <Navigate to="/login" replace />;
  };
  const RestrictedRouter = ({ isDeny }: { isDeny: boolean }) => {
    return isDeny ? <Outlet /> : <Navigate to="/" replace />;
  };
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<RestrictedRouter isDeny={isHaveKey === null}></RestrictedRouter>}
          >
            <Route path={LOGIN} element={<LoginPage />} />
          </Route>
          <Route element={<Layout />}>
            <Route path="/" element={<ProtectedRoute isAllow={isHaveKey !== null} />}>
              {/* <Route path="hotel" element={<HotelDetail />} /> */}
              {/* <Route path="blogs" element={<Blogs />} />
                <Route path="contact" element={<Contact />} />
                <Route path="*" element={<NoPage />} /> */}
              {/* </Route> */}
              <Route index element={<Home />} />
              <Route path={NEWS} element={<NewsPage />} />
              <Route path={`${HOTEL}/:id`} element={<HotelDetailPage />} />
              <Route path={HOTEL} element={<Home />} />
              <Route path={VILLA} element={<VillaPage />} />
              <Route path={`${VILLA}/:id`} element={<VillaDetailPage />} />
              <Route path={TOWNHOUSE} element={<TownHousePage />} />
              <Route path={`${TOWNHOUSE}/:id`} element={<TownhouseDetailPage />} />
              <Route path={ACCOUNTS} element={<AccountsPage />} />
              <Route path={ORDERS} element={<ComingSoon />} />
              <Route path={SETTING} element={<ComingSoon />} />
              <Route path={`${ORDERS}${HOTEL}`} element={<OrdersPage assetType="hotel" />} />
              <Route path={`${ORDERS}${VILLA}`} element={<OrdersPage assetType="villa" />} />
              <Route path={`${ORDERS}${TOWNHOUSE}`} element={<OrdersPage assetType="town-house" />} />
              <Route path={`${ORDERS}${HOTEL}/:id`} element={<OrderDetailPage assetType="hotel" />} />
              <Route path={`${ORDERS}${VILLA}/:id`} element={<OrderDetailPage assetType="villa" />} />
              <Route path={`${ORDERS}${TOWNHOUSE}/:id`} element={<OrderDetailPage assetType="town-house" />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
