import React from 'react';
import {Text, Center} from '@mantine/core'
import { useFooterStyles } from './Footer.style';

export default function Footer() {
    const {classes} = useFooterStyles();

    return (
        <div className={classes.footer}>
            <Center style={{height: '100%', width: '80vw'}}>
            <Text className={classes.content} align="center" c='dark.9'>
                &copy; Make by &nbsp;
                <Text className={classes.teamName}>HCMUT/E team</Text>
            </Text>
            </Center>
        </div>
        
    )
}