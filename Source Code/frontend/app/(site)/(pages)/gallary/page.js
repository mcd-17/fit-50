'use client'
import Gallery from "../(home-3)/components/gallery"
import BasicBar from "../../../../components/common/basic-bar"
import { useI18n } from "../../../providers/i18n";

const Page = () => {
  const i18n = useI18n();
  return (
    <div>
        <BasicBar heading={i18n?.t('Gallary')} subHeading={i18n?.t('Gallary')}/>
        <div className="container lg:py-[140px] sm:py-[100px] py-[50px]">
        <Gallery />
        </div>
    </div>
  )
}

export default Page