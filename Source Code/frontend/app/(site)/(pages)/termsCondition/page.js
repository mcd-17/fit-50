'use client';

import BasicBar from "../../../../components/common/basic-bar";
import { fetchSinglePage } from "../../../helpers/backend";
import { useFetch } from "../../../helpers/hooks";
import { columnFormatter } from "../../../helpers/utils";
import { useI18n } from "../../../providers/i18n";

const Page = () => {
  const [page , getPage, {loading}] = useFetch(fetchSinglePage, {slug:"terms_&_condition"} );
  const i18n = useI18n();
  return (
    <div>
      <BasicBar heading={i18n?.t('Terms Condition')} subHeading={i18n?.t('Terms & Condition')} />

      <div dangerouslySetInnerHTML={{ __html: columnFormatter(page?.content) }} className="container my-[60px] lg:my-[120px]"></div>
    </div>
  )
}

export default Page