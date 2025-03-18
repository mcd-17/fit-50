"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Skeleton } from "antd";
import Button from "../../../../components/common/button";
import { useI18n } from "../../../providers/i18n";
import { columnFormatter } from "../../../helpers/utils";
import { useUser } from "../../../contexts/user";
import { useRouter } from "next/navigation";
import { motion } from 'framer-motion';

const Hero = ({ data, loading }) => {
    const [activeSection, setActiveSection] = useState("Mission");
    const { user, getUser } = useUser();
    const i18n = useI18n();
    const { push } = useRouter();

    const sectionContent = {
        Mission: {
            text: columnFormatter(data?.mission?.text),
            image1: data?.mission?.mission_image1[0].url ? data?.mission?.mission_image1[0].url : data?.mission?.mission_image1,
            image2: data?.mission?.mission_image2[0].url ? data?.mission?.mission_image2[0].url : data?.mission?.mission_image2
        },
        Vision: {
            text: columnFormatter(data?.vision?.text),
            image1: data?.vision?.vision_image1[0].url ? data?.vision?.vision_image1[0].url : data?.vision?.vision_image1,
            image2: data?.vision?.vision_image2[0].url ? data?.vision?.vision_image2[0].url : data?.vision?.vision_image2,
        },
        Values: {
            text: columnFormatter(data?.values?.text),
            image1: data?.values?.values_image1[0].url ? data?.values?.values_image1[0].url : data?.values?.values_image1,
            image2: data?.values?.values_image2[0].url ? data?.values?.values_image2[0].url : data?.values?.values_image2,
        },
    };

    const leftToRightVariant = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 },
    };

    const rightToLeftVariant = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 },
    };
    const { text, image1, image2 } = sectionContent[activeSection];

    return (
        <div className="container lg:my-[120px] my-[60px] pb-7 overflow-hidden">
            <div className="flex w-full flex-col xl:flex-row gap-6">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ amount: 0.3 }}
                    variants={leftToRightVariant}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="xl:w-2/5 w-full">
                    {loading ? (
                        <Skeleton active paragraph={{ rows: 1 }} />
                    ) : (
                        <h2 className="heading text-textMain">{columnFormatter(data?.heading)}</h2>
                    )}
                    {loading ? (
                        <Skeleton active paragraph={{ rows: 3 }} />
                    ) : (
                        <p className="description md:mt-10 mt-5 !text-textBody">
                            {columnFormatter(data?.description)}
                        </p>
                    )}
                    <div className="flex text-lg font-semibold md:gap-[56px] gap-8 md:my-10 my-5">
                        {loading ? (
                            <Skeleton.Button active />
                        ) : (
                            <button
                                className={`${activeSection === "Mission"
                                    ? "text-primary font-poppins underline font-bold"
                                    : "text-textMain font-poppins hover:text-primary"
                                    }`}
                                onClick={() => setActiveSection("Mission")}
                            >
                                {i18n?.t("Mission")}
                            </button>
                        )}
                        {loading ? (
                            <Skeleton.Button active />
                        ) : (
                            <button
                                className={`${activeSection === "Vision"
                                    ? "text-primary font-poppins underline font-bold"
                                    : "text-textMain font-poppins hover:text-primary"
                                    }`}
                                onClick={() => setActiveSection("Vision")}
                            >
                                {i18n?.t("Vision")}
                            </button>
                        )}
                        {loading ? (
                            <Skeleton.Button active />
                        ) : (
                            <button
                                className={`${activeSection === "Values"
                                    ? "text-primary font-poppins underline font-bold"
                                    : "text-textMain font-poppins hover:text-primary"
                                    }`}
                                onClick={() => setActiveSection("Values")}
                            >
                                {i18n?.t("Values")}
                            </button>
                        )}
                    </div>
                    {loading ? (
                        <Skeleton active paragraph={{ rows: 3 }} />
                    ) : (
                        <p className="description mb-10 !text-textBody">{text}</p>
                    )}
                    <Button skipDemo={true} onClick={() => {
                        if (user?._id) {
                            if (user?.role === 'user') {
                                push(user?.activeSubscription?._id ? '/services' : '/pricing-plan');
                            } else if (user?.role === 'admin' || user?.role === 'trainer') {
                                push('/services');
                            } else {
                                push('/signin');
                            }
                        } else {
                            push('/signin');
                        }
                    }}>{i18n?.t("start your journey")}</Button>
                </motion.div>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ amount: 0.3 }}
                    variants={rightToLeftVariant}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="xl:w-3/5 w-full flex gap-6">
                    <div className="w-full h-full flex sm:gap-6 gap-3overflow-hidden">
                        {loading ? (
                            <Skeleton.Image active />
                        ) : (
                            <Image src={image1} height={500} width={400} alt="about" className="lg:h-[508px] sm:h-[350px] h-[200px] object-center xl:w-full w-[50%] rounded-[8px] relative lg:top-[230px] sm:top-[170px] top-[70px]" />
                        )}
                        {loading ? (
                            <Skeleton.Image active />
                        ) : (
                            <Image src={image2} height={500} width={500} alt="about" className="lg:h-[707px] sm:h-[500px] h-[250px] relative object-center xl:w-full w-[50%] rounded-[8px]" />
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;