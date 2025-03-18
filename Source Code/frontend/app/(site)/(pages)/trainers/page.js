'use client';
import { useState } from "react";
import BasicBar from "../../../../components/common/basic-bar";
import TeamCard from "../../../../components/home1/teamCard";
import { fetchTrainerList } from "../../../helpers/backend";
import { useFetch } from "../../../helpers/hooks";
import { useI18n } from "../../../providers/i18n";
import { Pagination } from "antd";
import { motion } from 'framer-motion';

const Page = () => {
    const [trainers, getTrainers, { loading }] = useFetch(fetchTrainerList, { limit: 6 });
    const i18n = useI18n();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);

    const onPageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
        getTrainers({ page, limit: pageSize });
    };


    const slideVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };
    const titleVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 },
    };

    return (
        <div>
            <BasicBar title={i18n?.t('Trainers')} heading={i18n?.t('Trainers')} subHeading={i18n?.t('Trainers')} />
            <div className="container lg:py-[140px] sm:py-[100px] py-[50px]">
                <motion.p
                    variants={titleVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className='shop-heading'>{i18n?.t('meet the pros')}</motion.p>
                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:mt-[50px] mt-[30px]'>
                    {trainers?.docs?.map((trainer) => (
                        <motion.div
                            variants={slideVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.3 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <TeamCard
                                key={trainer._id}
                                team={trainer}
                            />
                        </motion.div>

                    ))}
                </div>
                <Pagination
                    align="center"
                    className="!mt-[50px]"
                    current={currentPage}
                    pageSize={pageSize}
                    total={trainers?.totalDocs}
                    onChange={onPageChange}
                />
            </div>
        </div>
    );
}

export default Page;
