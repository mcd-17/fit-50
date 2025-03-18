'use client';

import { Skeleton } from "antd";
import BasicBar from "../../../../components/common/basic-bar";
import { fetchSinglePage } from "../../../helpers/backend";
import { useFetch } from "../../../helpers/hooks";
import { columnFormatter } from "../../../helpers/utils";

const Page = () => {
  const [page , getPage, {loading}] = useFetch(fetchSinglePage, {slug:"privacy_policy"} );

  return (
    <>
      <BasicBar heading={'Privacy Policy'} subHeading={'Privacy Policy'}/>
      {
        loading ? <Skeleton active paragraph={{ rows: 6 }} /> : (
          <div dangerouslySetInnerHTML={{ __html: columnFormatter(page?.content) }} className=" container lg:my-[120px] my-16"></div>
        )
      }
    </>
  )
}

export default Page
