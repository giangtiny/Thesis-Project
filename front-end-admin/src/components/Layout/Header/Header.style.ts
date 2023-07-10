import {createStyles} from '@mantine/core';

export const useHeaderStyles = createStyles((theme) => ({
    header: {
        height: 50,
        display: 'flex',
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
        justifyContent: 'space-between',
        backgroundColor: 'white'
    },
    search: {
        padding: 8,
        paddingLeft: 0,
        width: '30vw'
    }
}))