import { gradientBadgeProps } from '@/constants/props';
import { PRIMARY_COLOR } from '@/constants/theme';
import {
  createStyles,
  Badge,
  Group,
  Title,
  Text,
  SimpleGrid,
  Container,
  Paper,
  Overlay,
  Box,
  Stack
} from '@mantine/core';
import { homeFeatureData } from '@/constants/static-data';
import { useMediaQuery } from '@mantine/hooks';
import { Carousel } from '@mantine/carousel';

const useStyles = createStyles((theme) => ({
  card: {
    height: 440,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    cursor: 'pointer',
    transition: 'transform 150ms ease, box-shadow 150ms ease',

    '&:hover': {
      transform: 'scale(1.05)'
    }
  },

  title: {
    fontFamily: `Greycliff CF ${theme.fontFamily}`,
    fontWeight: 900,
    color: theme.white,
    lineHeight: 1.2,
    fontSize: 32,
    marginTop: theme.spacing.xs
  },

  category: {
    color: theme.white,
    opacity: 0.7,
    fontWeight: 700,
    textTransform: 'uppercase',
    fontSize: 18
  }
}));

interface CardProps {
  image: string;
  title: string;
  category: string;
}

function Card({ image, title, category }: CardProps) {
  const { classes } = useStyles();

  return (
    <Paper
      shadow="xl"
      p="xl"
      radius="xl"
      sx={{ backgroundImage: `url(${image})` }}
      className={classes.card}>
      <Box style={{ height: 'auto', position: 'relative' }}>
        <Overlay opacity={0.4} color="#000" zIndex={1} blur={2} radius="xl" />
        <Stack spacing={0} style={{ position: 'relative', zIndex: 2 }} p="sm">
          <Text className={classes.category} size="xs">
            {category}
          </Text>
          <Title order={3} className={classes.title}>
            {title}
          </Title>
        </Stack>
      </Box>
    </Paper>
  );
}

export function HomeFeature() {
  const { classes, theme } = useStyles();
  const isTabletDown = useMediaQuery(`(max-width: ${theme.breakpoints.md + 1}px)`);
  const features = homeFeatureData.map((feature, index) => <Card {...feature} key={index} />);
  const slides = homeFeatureData.map((item) => (
    <Carousel.Slide key={item.title}>
      <Card {...item} />
    </Carousel.Slide>
  ));
  return (
    <Container size="lg">
      {!isTabletDown ? (
        <SimpleGrid cols={3} spacing="xl" mt={30} breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
          {features}
        </SimpleGrid>
      ) : (
        <Carousel slideSize="100%" align="start" mt={30} loop slideGap="xs">
          {slides}
        </Carousel>
      )}
    </Container>
  );
}
