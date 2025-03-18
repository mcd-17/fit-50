'use client';
import { Card} from 'antd';
import React from 'react';
import {
    fetchTheme,
} from '../../../../../helpers/backend';
import { useFetch } from '../../../../../helpers/hooks';
import Home1 from '../../../../../../components/admin/pagesetting/home/home1';
import Home2 from '../../../../../../components/admin/pagesetting/home/home2';
import Home3 from '../../../../../../components/admin/pagesetting/home/home3';
import Home4 from '../../../../../../components/admin/pagesetting/home/home4';

const HomePageSetting = ({ slug }) => {
    const [theme] = useFetch(fetchTheme);
    const isDefaultTheme=theme?.filter((i)=> i?.isDefault === true);
    if (theme && isDefaultTheme && isDefaultTheme[0]?.name === 'home1') {
        return (
            <Card>
                <Home1 slug={slug} />
            </Card>
        );
    }
    else if(theme && isDefaultTheme && isDefaultTheme[0]?.name === 'home2'){
        return (
            <Card>
                <Home2 slug={slug} />
            </Card>
        );
    }
    else if(theme && isDefaultTheme && isDefaultTheme[0]?.name === 'home3'){
        return (
            <Card>
                <Home3 slug={slug} />
            </Card>
        );  
    }
    else if(theme && isDefaultTheme && isDefaultTheme[0]?.name === 'home4'){
        return (
            <Card>
                <Home4 slug={slug} />
            </Card>
        );  
    }
};

export default HomePageSetting;
