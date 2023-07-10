import React from 'react';

import { useAppDispatch } from '@redux/store';

import { LandingHeader } from '@/components/Layout';
import SearchBar from '@/components/Searchbar';

export default function MainHomePage() {
  const dispatch = useAppDispatch();

  return (
    <div>
      <div className="hero-section" data-v-24aa0de2 data-v-66a31625>
        <LandingHeader></LandingHeader>
        <div className="hero-image" data-v-24aa0de2>
          <div className="hero-message" data-v-24aa0de2>
            <h1 className="large-title" data-v-24aa0de2 style={{ color: 'white' }}>
              Du lịch khắp thế giới !
            </h1>
            <p className="title-4-bld" data-v-24aa0de2 style={{ fontFamily: 'inherit' }}>
              Chọn một điểm đến và chúng tôi sẽ cho bạn những lựa chọn tốt nhất!
            </p>
          </div>
          <img
            src="https://a.hwstatic.com/image/upload/f_auto,q_auto/v1676289347/pwa/arrow.svg"
            alt="Start searching arrow"
            className="header-arrow"
            data-v-24aa0de2
          />
          <img
            src="../a.hwstatic.com/image/upload/f_auto%2cq_auto%2ch_205/v1676289347/pwa/hero.chats.png"
            alt="Users avatars"
            className="header-avatars"
            data-v-24aa0de2
          />
        </div>
        <SearchBar />
        <div className="free-cancellation body-2-reg" data-v-24aa0de2>
          <div data-v-24aa0de2>
            <b>Đa dạng điểm đến</b> & <b>Đặt phòng linh hoạt</b>
          </div>
        </div>
      </div>
    </div>
  );
}
