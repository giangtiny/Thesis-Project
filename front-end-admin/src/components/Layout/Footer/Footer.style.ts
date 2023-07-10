import { createStyles } from '@mantine/core';

export const useFooterStyles =  createStyles((theme) => ({
    footer: {
        padding: 10,
        position: 'fixed',
        bottom: 0,
        width: '100%',
        backgroundColor: 'white',
        color: 'black',
        height: 40
    },
    content: {
        display: 'flex'
    },
    teamName: {
        color: theme.colors.blue[5]
    }
}))