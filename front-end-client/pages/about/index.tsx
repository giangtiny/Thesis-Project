import FullAbout from '@/components/FullAbout';
import { AppShell } from '@/components/Layout';
import { HEADER_HEIGHT } from '@/constants/theme';
function About() {
  return (
    <AppShell
      headerSize="xl"
      styles={{ main: { padding: `${HEADER_HEIGHT}px 0px 0px 0px !important` } }}>
      <FullAbout></FullAbout>
    </AppShell>
  );
}

export default About;
