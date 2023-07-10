import { createStyles } from '@mantine/core';

export const UseHomeSectionTitleStyle = createStyles((theme) => ({
  title: {
    fontSize: 30,
    fontWeight: 900,
    [theme.fn.smallerThan('sm')]: {
      fontSize: 24
    }
  }
}));
