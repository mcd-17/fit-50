"use client"
import { useEffect, useState } from "react";
import { Form } from "antd";
import { FaArrowLeft } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useI18n } from "../../../../../providers/i18n";
import { useFetch } from "../../../../../helpers/hooks";
import { allProductCategory, singleProductAdmin } from "../../../../../helpers/backend";
import ProductForm from "../../add/productForm";

const page = ({ params }) => {
    const [form] = Form.useForm();
    const router = useRouter()
    const i18n = useI18n()
    let { languages, langCode } = useI18n();
    const [data, getData] = useFetch(singleProductAdmin, {}, false);
    const [category, getCategory] = useFetch(allProductCategory);
    const [selectedLang, setSelectedLang] = useState();
    const [isVarient, setIsVarient] = useState(false);
    const [formData, setFromData] = useState([])

    useEffect(() => {
        setSelectedLang(langCode)
    }, [langCode])

    useEffect(() => {
        getData({ _id: params?.id })
    }, [params?.id])

    useEffect(() => {
        form.setFieldsValue({
            name: data?.product?.name,
            short_description: data?.product?.short_description,
            category: data?.product?.category?._id,
            price: data?.product?.price,
            quantity: data?.product?.quantity,
            description: data?.product?.description,
            thumbnail_image: data?.product?.thumbnail_image?.length > 0
                ? [
                    {
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: data?.product?.thumbnail_image,
                    },
                ]
                : [],
            images: data?.product?.images?.map((img, index) => ({
                uid: `-${index + 1}`,
                name: img,
                status: 'done',
                url: img,
            })),
            variants: data?.product?.variants?.map(variant => ({
                name: variant.name,
                price: variant.price,
                in_stock: variant.in_stock,
            })),
            _id: data?.product?._id
        })
        if (data?.product?.variants?.length > 0) {
            setIsVarient(true)
        }
    }, [data])

    return (
        <div className="px-4 flex flex-col gap-4">
            <button className="bg-primary px-3 py-1 flex items-center gap-1 text-white rounded  w-fit"
                title="Back" onClick={() => window.history.back()}>
                <FaArrowLeft /> {i18n?.t('Back')}
            </button>
            <h1 className="text-2xl font-bold my-4">{i18n?.t('Edit Product')}</h1>
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
            <ProductForm isVarient={isVarient} setIsVarient={setIsVarient} category={category} data={data} languages={languages} langCode={langCode} selectedLang={selectedLang} setSelectedLang={setSelectedLang} form={form} formData={formData} setFromData={setFromData} i18n={i18n} router={router} productId={params.id} />
        </div>
    );
};

export default page;