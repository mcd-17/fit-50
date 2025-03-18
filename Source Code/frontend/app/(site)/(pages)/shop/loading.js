import { Skeleton } from "antd";
import BasicBar from '../../../../components/common/basic-bar';

export default function Loading() {
    return (
       <div>
        <BasicBar heading='Shop' subHeading='Home' />
         <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10 container py-16">
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
        </div>
       </div>
    );
}