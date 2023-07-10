import { createStyles } from "@mantine/core";
import {PRIMARY_COLOR} from '@/constants/theme';

export const useAccountsStyles = createStyles((theme) => ({
    divButtonAdd: {
      padding: 8,
    },
    buttonAdd: {
      padding: 8,
      backgroundColor: PRIMARY_COLOR.PRIMARY_LIGHT_GREEN
    }
}))
