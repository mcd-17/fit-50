"use client";
import React, { useState } from "react";
import ServiceCard from "../(home-2)/components/serviceCard";
import { fetchServices } from "../../../helpers/backend";
import { useFetch } from "../../../helpers/hooks";
import { useI18n } from "../../../providers/i18n";
import { motion } from 'framer-motion';
import { Pagination } from "antd";

const Services = () => {
    const [data, getData, { loading }] = useFetch(fetchServices, { limit: 6 });
    const i18n = useI18n();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const slideVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };
    const titleVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 },
    };
    const onPageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
        getData({ page, limit: pageSize });
    };
    return (
        <div className="container lg:my-[140px] my-[50px] pb-7">
             <motion.h2
                className="shop-heading lg:mb-[60px] md:mb-10 mb-6"
                variants={titleVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false }} 
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                {i18n?.t("Services We're Offering")}
            </motion.h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6 lg:mt-[56px] mt-10'>
                {
                    data?.docs?.map(service =>
                        <motion.div
                            variants={slideVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.3 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <ServiceCard key={service._id} data={service} />
                        </motion.div>
                    )
                }

            </div>
             <Pagination
                    align="center"
                    className="!mt-[50px]"
                    current={currentPage}
                    pageSize={pageSize}
                    total={data?.totalDocs}
                    onChange={onPageChange}
                />
        </div>
    );
};

export default Services;