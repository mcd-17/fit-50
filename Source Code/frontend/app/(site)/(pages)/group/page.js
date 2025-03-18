'use client';
import BasicBar from "../../../../components/common/basic-bar";
import { fetchGroupList } from "../../../helpers/backend";
import { useFetch } from "../../../helpers/hooks";
import { Pagination, Skeleton } from "antd";
import { useI18n } from "../../../providers/i18n";
import GroupCard from "../../../../components/home1/groupCard";
import { motion } from "framer-motion";
import { useState } from "react";

const Page = () => {
    const [data, getData, { loading }] = useFetch(fetchGroupList, { limit: 8 });
    const i18n = useI18n();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const onPageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
        getTrainers({ page, limit: pageSize });
    };
    const fadeUpVariant = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 1 } },
    };
    const imageFadeInVariantLeft = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 1 } },
    };
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };
    return (
        <div>
            <BasicBar heading={i18n?.t('Groups')} subHeading={i18n?.t('Groups')} />
            <div className="container lg:mt-[140px] sm:mt-[100px] mt-[50px]">
                <motion.h1
                    initial="hidden"
                    whileInView="visible"
                    variants={imageFadeInVariantLeft}
                    viewport={{ once: false, amount: 0.3 }}
                    className="shop-heading">{i18n?.t('All Groups List')}</motion.h1>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:mt-[50px] mt-[30px] pb-2'>
                    {loading ? (
                        Array.from({ length: 6 }).map((_, index) => (
                            <Skeleton key={index} active />
                        ))
                    ) : (
                        data?.docs?.map((group, index) => (
                            <motion.div
                                key={index}
                                initial="hidden"
                                whileInView="visible"
                                variants={cardVariants}
                                viewport={{ once: false, amount: 0.3 }}
                            >
                                <GroupCard index={index} key={group._id} group={group} />
                            </motion.div>

                        ))
                    )}
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
        </div>
    )
}

export default Page;