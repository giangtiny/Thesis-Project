import { createStyles } from "@mantine/core";

export const useLayoutStyles = createStyles ((theme) => ({
    rightLayout: {
        color: theme.colors.dark[9],
        position: 'fixed',
        right: 0,
        top: 0,
        display: 'block',
        width: '80vw',
        backgroundColor: theme.colors.gray[3]
    },
    body: {
        height: 'calc(100vh - 90px)'
    }
})) 