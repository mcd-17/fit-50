'use client';
import { Card } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '../../../../../providers/i18n';
import Image from 'next/image';
import Button from '../../../../../../components/common/button';
import { fetchTheme, updateTheme } from '../../../../../helpers/backend';
import { useActionConfirm, useFetch } from '../../../../../helpers/hooks';
const ThemeSetting = () => {
    const i18n = useI18n();
    const [allThemes, getAllThemes] = useFetch(fetchTheme)
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const imageRefs = useRef([]);
    useEffect(() => {
        if (hoveredIndex !== null) {
            const img = imageRefs.current[hoveredIndex];
            let scrollAmount = 0;
            const scrollSpeed = 5;

            const scrollInterval = setInterval(() => {
                scrollAmount += scrollSpeed;
                if (scrollAmount >= img.scrollHeight - img.clientHeight) {
                    clearInterval(scrollInterval);
                } else {
                    img.scrollTop = scrollAmount;
                }
            }, 20);

            return () => clearInterval(scrollInterval);
        }
    }, [hoveredIndex]);

    return (
        <div className="space-y-4">
            <Card>
                <h6 className="text-secondary text-lg py-2">{i18n?.t('Theme Setting')}</h6>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {allThemes?.map((theme, index) => (
                    <div key={index} className="group relative rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-100 overflow-hidden ">
                        <div 
                            className="h-[400px] relative overflow-hidden"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <div 
                                ref={el => imageRefs.current[index] = el}
                                className="absolute inset-0 overflow-y-scroll hide-scrollbar scrollbar-hide"
                            >
                                <Image 
                                    src={theme?.name=='home1' ? '/home1.png' : theme?.name=='home2' ? '/home2.png' : theme?.name=='home3' ? '/home3.png' : theme?.name=='home4' && '/home4.png'}
                                    alt={`ThemePreview`}
                                    width={500}
                                    height={2000}
                                    className="object-cover w-full"
                                />
                            </div>
                        </div>
                        <div className="bg-white ">
                            <Button
                            type='submit'
                            className={theme?.isDefault ? 'bg-primary text-white !w-full !py-4 !border-none' : '!bg-primary/60 text-white !w-full !py-4 !border-none'}
                            onClick={() => {
                                useActionConfirm(updateTheme, {_id:theme?._id}, getAllThemes, 'Are you sure you want to activate this theme?')
                            }}
                            >{theme?.isDefault ? i18n?.t('Activated'): i18n?.t('Activate')}</Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ThemeSetting;