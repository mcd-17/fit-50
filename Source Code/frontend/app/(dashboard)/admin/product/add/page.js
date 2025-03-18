"use client"
import { Form } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { useI18n } from "../../../../providers/i18n";
import { useFetch } from "../../../../helpers/hooks";
import { allProductCategory } from "../../../../helpers/backend";
import ProductForm from "./productForm";
const page = () => {
    const [form] = Form.useForm();
    const router = useRouter()
    const i18n = useI18n()
    let { languages, langCode } = useI18n();
    const [data, getData] = useFetch(allProductCategory);
    const [selectedLang, setSelectedLang] = useState();
    const [formData, setFromData] = useState([])
    const [isVarient, setIsVarient] = useState(false);

    useEffect(() => {
        setSelectedLang(langCode)
    }, [langCode])

    return (
        <div className="px-4 flex flex-col gap-4">
            <button className="bg-primary px-3 py-1 flex items-center gap-1 text-white rounded w-fit"
                title="Back" onClick={() => window.history.back()}>
                <FaArrowLeft /> {i18n?.t("Back")}
            </button>
            <h1 className="text-2xl font-bold my-4">{i18n?.t("Add Product")}</h1>
            <div className="flex justify-start flex-wrap gap-3">
                {languages?.docs?.map((l, index) => (
                    <button
                        onClick={() => setSelectedLang(l.code)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${l.code === selectedLang
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        key={index}
                    >
                        {l.name}
                    </button>
                ))}
            </div>
            <ProductForm category={data} isVarient={isVarient} setIsVarient={setIsVarient} data={data} languages={languages} langCode={langCode} selectedLang={selectedLang} setSelectedLang={setSelectedLang} form={form} formData={formData} setFromData={setFromData} i18n={i18n} router={router} />
        </div>
    );
};

export default page;