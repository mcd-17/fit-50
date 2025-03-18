'use client';
import React, { useState } from 'react';
import { Pagination } from 'antd';
import BasicBar from '../../../../components/common/basic-bar';
import ShopCard from '../../../../components/home1/shopCard';
import { useFetch } from '../../../helpers/hooks';
import { allProductCategory, allProducts } from '../../../helpers/backend';
import { columnFormatter } from '../../../helpers/utils';
import { useI18n } from '../../../providers/i18n';
import Image from 'next/image';
import { motion } from 'framer-motion';


const Shop = () => {
    const [allproducts, getAllProducts, { loading }] = useFetch(allProducts, { limit: 8 });
    const [category] = useFetch(allProductCategory);
    const i18n = useI18n();
    let { langCode } = useI18n();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);

    const onPageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
        getAllProducts({ page, limit: pageSize });
    };

    const slideVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };


    const searchBarVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <section className=''>
            <BasicBar heading={i18n?.t('Shop')} subHeading={i18n?.t('Shop')} />
            <div className='container lg:my-[120px] md:my-20 my-10'>
                <motion.div
                    variants={searchBarVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="bg-white rounded gap-4 flex md:flex-row flex-col-reverse items-center w-full md:px-4 shadow-sm md:border border-gray-200">
                    <div className='flex justify-between w-full border md:border-none px-3 md:px-0 '>
                        <button className="outline-none focus:outline-none  ">
                            <Image src={'/searchicon.png'} width={24} height={24} alt="search" className='
                       min-w-6 '/>
                        </button>
                        <input
                            type="search"
                            placeholder={i18n?.t("Search all brand and product")}
                            className="w-full pl-3 py-4 text-[#534C4C] text-sm outline-none  focus:outline-none bg-transparent"
                            onChange={e => {
                                if (e.target.value.length === 0) {
                                    getAllProducts({ langCode: langCode })
                                } else {
                                    getAllProducts({ search: e.target.value, langCode: langCode })
                                }
                            }}
                        />
                    </div>
                    <div className="md:block hidden border-s h-full md:py-3 pr-3 py-2 w-full md:w-fit">
                        <select
                            onChange={e => { getAllProducts({ category: e.target.value, langCode: langCode }) }}
                            defaultValue=""
                            className="text-base w-full md:w-fit pl-4 pr-8 py-2 outline-none rounded-md !bg-transparent transition-all duration-300"
                        >
                            <option value="">{i18n?.t('All Categories')}</option>
                            {
                                category?.docs?.map(category => (
                                    <option key={category?._id} value={columnFormatter(category?.name)}>
                                        {columnFormatter(category?.name)}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                    <div className=" md:hidden border h-full md:py-3 pr-3 py-2 w-full md:w-fit">
                        <select
                            onChange={e => { getAllProducts({ category: e.target.value, langCode: langCode }) }}
                            defaultValue=""
                            className="text-base w-full md:w-fit pl-4 pr-8 py-2 outline-none rounded-md  transition-all duration-300 !bg-transparent"
                        >
                            <option value="">{i18n?.t('All Categories')}</option>
                            {
                                category?.docs?.map(category => (
                                    <option key={category?._id} value={columnFormatter(category?.name)}>
                                        {columnFormatter(category?.name)}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                </motion.div>

                <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 md:gap-6 gap-2 mt-14'>
                    {allproducts?.docs?.length ? (
                        allproducts?.docs?.map(product => (
                            <motion.div
                                variants={slideVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: false, amount: 0.3 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            >
                                <ShopCard key={product._id} data={product} getData={getAllProducts} />
                            </motion.div>

                        ))
                    ) : (
                        <div className='col-span-full text-center'>{i18n?.t('No products found')}</div>
                    )}
                </div>
                <Pagination
                    align="center"
                    className="!mt-[50px]"
                    current={currentPage}
                    pageSize={pageSize}
                    total={allproducts?.totalDocs}
                    onChange={onPageChange}
                />

            </div>
        </section>
    );
};

export default Shop;
