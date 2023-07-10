import { Button, createStyles } from '@mantine/core';
import { PRIMARY_COLOR, SECONDARY_COLOR } from '@/constants/theme';

export const useTransparentButtonStyle = createStyles((theme) => ({
  mainButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '0.3125rem',
    width: 'auto',
    height: '2rem',
    border: '0.0625rem solid transparent',
    padding: '0 0.5rem',
    cursor: 'pointer',
    fontWeight: 700,
    fontFamily:
      'Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Arial,sans-serif',
    backgroundColor: 'rgba(0,0,0,.3)',
    Text: {
      padding: 5,
      fontFamily:
        'Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Arial,sans-serif',
      fontWeight: 700,
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: 'transparent'
      }
    }
  }
}));
