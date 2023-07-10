import React, {ReactNode} from 'react';
import { Outlet } from 'react-router-dom';
import { Group, ScrollArea, Flex } from '@mantine/core';

import NavbarSimple from './NavbarSimple';
import Header from './Header';
import Footer from './Footer';
import { useLayoutStyles } from './Layout.style';



// export default function Layout({children}: {children: ReactNode}) {
export default function Layout() {
    const {classes} = useLayoutStyles();    

    return (
        <Flex
            justify="flex-start"
            align="flex-start"
            direction="row"
            bg='gray.3'
            styles={{ width:'100vw', height:'100vh' }}
            >
            <NavbarSimple />
            <Group className={classes.rightLayout}>
                <Header />
                <ScrollArea className={classes.body}>
                    <Outlet />
                    {/* {children} */}
                </ScrollArea>
                <Footer />
            </Group>
        </Flex>
    );
}