import { PRIMARY_COLOR } from '@/constants/theme';
import {
  Center,
  CloseButton,
  Container,
  Input,
  InputVariant,
  MultiSelect,
  Select,
  Stack
} from '@mantine/core';
import { IconLocation, IconMapPin, IconCalendarEvent, IconUsers } from '@tabler/icons';
import React, { useRef, useState } from 'react';
import { provinces } from './data';
import { DatePicker, DayModifiers } from '@mantine/dates';
import { dateActions } from '@redux/slices';
import { selectBookedDate } from '@redux/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchBarStyles } from './SearchBar.style';
import { Popover, ActionIcon, Group, Text } from '@mantine/core';
import { IconMinus, IconPlus, IconChevronDown, IconChevronRight } from '@tabler/icons';

import { selectCountGuest, selectGuest } from '@redux/selectors';
import { guestActions } from '@redux/slices';
import { GUEST_SELECT_INFO } from '@/constants/static-data';
export function SearchBar() {
  const { classes, cx } = useSearchBarStyles();
  const [destination, setDestination] = useState('');
  const [data, setData] = useState(provinces);
  const dispatch = useDispatch();
  const [checkinDate, checkoutDate] = useSelector(selectBookedDate);
  const { setBookedDate } = dateActions;

  const dayClassNames = (date: Date, modifiers: DayModifiers) => {
    return cx({
      [classes.selected]: modifiers.selected
    });
  };

  const datePickerProps = {
    placeholder: 'Chọn ngày',
    variant: 'unstyled' as InputVariant,
    locale: 'vi',
    inputFormat: 'DD/MM/YYYY',
    clearable: false,
    allowLevelChange: false,
    minDate: checkinDate || new Date(),
    className: classes.datePicker,
    dayClassName: dayClassNames
  };

  const onChangeCheckin = (date: Date) => dispatch(setBookedDate([date, null]));

  const onChangeCheckout = (date: Date) => dispatch(setBookedDate([checkinDate, date]));

  const handleResetDate = () => dispatch(setBookedDate([null, null]));
  const handleResetCheckout = () => dispatch(setBookedDate([checkinDate, null]));

  const { elder, children } = useSelector(selectGuest);
  const guestCount = useSelector(selectCountGuest);

  const [openedGuestBox, setOpenedGuestBox] = useState<boolean>(false);

  const handleSearchHotel = () => {
    const searchData = {
      address: destination,
      checkIn: checkinDate,
      checkOut: checkoutDate,
      maxGuest: Number(guestCount)
    };
  };

  const handleGuestActions = (action: string, type: number) => {
    switch (type) {
      case 1:
        action === 'add'
          ? dispatch(guestActions.addElderGuest())
          : dispatch(guestActions.removeElderGuest());
        break;
      case 2:
        action === 'add'
          ? dispatch(guestActions.addChildrenGuest())
          : dispatch(guestActions.removeChildrenGuest());
        break;
      default:
        break;
    }
  };

  const renderCount = (type: number): number | undefined => {
    switch (type) {
      case 1:
        return elder;
      case 2:
        return children;
      default:
        break;
    }
  };

  const renderMenuItem = (guestInfo: any) => {
    return (
      <Group position="apart" mt={5}>
        <Stack spacing={5}>
          <Text>{guestInfo.title}</Text>
          <Text color="dimmed" size="sm">
            {guestInfo.content}
          </Text>
        </Stack>
        <Group>
          <ActionIcon
            onClick={() => handleGuestActions('remove', guestInfo.type)}
            disabled={renderCount(guestInfo.type) === 0}
            variant="outline">
            <IconMinus />
          </ActionIcon>
          <Text>{renderCount(guestInfo.type)}</Text>
          <ActionIcon onClick={() => handleGuestActions('add', guestInfo.type)} variant="outline">
            <IconPlus />
          </ActionIcon>
        </Group>
      </Group>
    );
  };
  return (
    <div className="search-form-container" data-v-24aa0de2>
      <div className="search-form-wrapper inline-large" data-v-28413f6c data-v-24aa0de2>
        <div className="inline-wrapper" data-v-7757c285 data-v-28413f6c>
          <div className="inline-form large" data-v-7757c285>
            <div className="destination-container" data-v-7757c285>
              <div className="input input-strip" data-v-48d388e0 data-v-7757c285>
                <div className="input-inner" data-v-48d388e0>
                  <div className="input-wrapper" data-v-48d388e0>
                    <Select
                      onChange={(event: any) => setDestination(event)}
                      data={data}
                      placeholder="Bạn muốn đi đâu ?"
                      variant="unstyled"
                      searchable
                      rightSection={<IconMapPin size={'15'}></IconMapPin>}
                      style={{ padding: '1rem' }}
                      // creatable
                      // getCreateLabel={(query) => `Tìm kiếm cho:  ${query}`}
                      // onCreate={(query) => {
                      //   const item = { value: query, label: query };
                      //   setData((current: any) => [...current, item]);
                      //   return item;
                      // }}
                    />
                  </div>
                  <div className="input-suffix" data-v-48d388e0></div>
                </div>
              </div>
            </div>
            <div className="v-divider" data-v-7757c285></div>
            <div tabIndex={0} className="dates" data-v-7757c285>
              <div className="checkin-checkout" data-v-7757c285>
                <div className="input input-readonly input-strip" data-v-48d388e0 data-v-7757c285>
                  <div className="input-inner" data-v-48d388e0>
                    <div className="icon-container input-prefix" data-v-48d388e0 data-v-c14fdf00>
                      <IconCalendarEvent size={'15'}></IconCalendarEvent>
                    </div>
                    <div className="input-wrapper" data-v-48d388e0>
                      <DatePicker
                        label={'Check-in'}
                        size="xs"
                        {...datePickerProps}
                        value={checkinDate}
                        onChange={onChangeCheckin}
                      />
                    </div>

                    <div className="input-suffix" data-v-48d388e0></div>
                  </div>
                </div>
                <CloseButton size={'sm'} onClick={handleResetDate}></CloseButton>
                <div className="v-divider" data-v-7757c285></div>
                <div className="input input-readonly input-strip" data-v-48d388e0 data-v-7757c285>
                  <div className="input-inner" data-v-48d388e0>
                    <div className="icon-container input-prefix" data-v-48d388e0 data-v-c14fdf00>
                      <IconCalendarEvent size={'15'}></IconCalendarEvent>
                    </div>
                    <div className="input-wrapper" data-v-48d388e0>
                      <DatePicker
                        label={'Checkout'}
                        {...datePickerProps}
                        value={checkoutDate}
                        onChange={onChangeCheckout}
                        disabled={!checkinDate}
                        size="xs"
                      />
                    </div>
                    <div className="input-suffix" data-v-48d388e0></div>
                  </div>
                </div>
                <CloseButton size={'sm'} onClick={handleResetCheckout}></CloseButton>
              </div>
            </div>
            <div className="v-divider" data-v-7757c285></div>
            <div className="guests-submit-wrapper" data-v-7757c285>
              <div tabIndex={0} className="guests" data-v-7757c285>
                <Popover
                  opened={openedGuestBox}
                  onChange={setOpenedGuestBox}
                  width="target"
                  position="bottom"
                  shadow="sm">
                  <Popover.Target>
                    <div
                      className="input input-readonly input-strip"
                      data-v-48d388e0
                      data-v-7757c285
                      onClick={() => setOpenedGuestBox((o) => !o)}>
                      <div className="input-inner" data-v-48d388e0>
                        <div
                          className="icon-container input-prefix"
                          data-v-48d388e0
                          data-v-c14fdf00>
                          <IconUsers size={'15'}></IconUsers>
                        </div>
                        <div className="input-wrapper" data-v-48d388e0>
                          <label className="input-label input-label-filled" data-v-48d388e0>
                            Guests
                          </label>
                          <input
                            readOnly={true}
                            type="number"
                            value={guestCount}
                            className="native-input body-1-reg"
                            data-v-48d388e0
                          />
                        </div>
                        <div className="input-suffix" data-v-48d388e0></div>
                      </div>
                    </div>
                  </Popover.Target>
                  <Popover.Dropdown w={'120%!important'}>
                    {GUEST_SELECT_INFO.map((info) => renderMenuItem(info))}
                  </Popover.Dropdown>
                </Popover>
              </div>
              <button
                type="button"
                className="btn-content large-button"
                data-v-958b1496
                data-v-7757c285
                style={{
                  backgroundColor: PRIMARY_COLOR.PRIMARY_LIGHT_GREEN,
                  background: PRIMARY_COLOR.PRIMARY_LIGHT_GREEN
                }}
                onClick={handleSearchHotel}>
                Let's go!
                <div className="icon-container icon-end" data-v-958b1496 data-v-c14fdf00>
                  <IconLocation size={'15'}></IconLocation>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
