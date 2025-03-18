'use client';
import BasicBar from "../../../../components/common/basic-bar";
import NewsCard from "../../../../components/home1/newsCard";
import { blogCategoryList, fetchBlogsListUser } from "../../../helpers/backend";
import { useFetch } from "../../../helpers/hooks";
import { Empty, Pagination, Skeleton } from "antd";
import { useI18n } from "../../../providers/i18n";
import { motion } from 'framer-motion';
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { columnFormatter } from "../../../helpers/utils";

const Page = () => {
  const param = useSearchParams();
  const category = param.get('category');
  const [categories, getCategory] = useFetch(blogCategoryList);
  const [data, getData, { loading }] = useFetch(fetchBlogsListUser, { limit: 6 }, false);
  const i18n = useI18n();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [selectedCategory, setSelectedCategory] = useState(category || "");

  const onPageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    getData({ page, limit: pageSize, category: selectedCategory });
  };

  useEffect(() => {
    getData({ category: selectedCategory, page: currentPage, limit: pageSize });
  }, [selectedCategory, currentPage, pageSize]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); 
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
      <BasicBar heading={i18n?.t('Blog')} subHeading={i18n?.t('Blog')} />
      <div className="container lg:mt-[140px] sm:mt-[100px] mt-[50px] w-full">
        <div className="flex items-center justify-between">
          <motion.h1
            variants={titleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="shop-heading">{i18n?.t('our latest news')}</motion.h1>
          <motion.select
            onChange={handleCategoryChange}
            value={selectedCategory}
            className="text-base cursor-pointer w-full h-fit md:w-fit pl-4 pr-8 py-2 outline-none rounded-md appearance-none outline-primary transition-all duration-300"
          >
            <option value="">{i18n?.t('All Categories')}</option>
            {categories?.docs?.map(category => (
              <option key={category?._id} value={category?._id}>
                {columnFormatter(category?.name)}
              </option>
            ))}
          </motion.select>
        </div>

        {data?.docs?.length <= 0 && !loading && (
          <div className="flex items-center justify-center h-[50vh] w-full">
            <Empty description={i18n?.t('No blogs found')} />
          </div>
        )}
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:mt-[50px] mt-[30px] w-full'>
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} active />
            ))
          ) : (
            data?.docs?.map((news) => (
              <motion.div
                key={news._id}
                variants={slideVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <NewsCard data={news} />
              </motion.div>
            ))
          )}
        </div>
        {data?.totalDocs > 0 && (
          <Pagination
            align="center"
            className="!mt-[50px]"
            current={currentPage}
            pageSize={pageSize}
            total={data?.totalDocs}
            onChange={onPageChange}
          />
        )}
      </div>
    </div>
  )
};

export default Page;
