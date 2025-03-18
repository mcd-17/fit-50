"use client";

import { Form, message, Radio, Switch } from "antd";
import { useState } from "react";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { BiLoader } from "react-icons/bi";

import FormInput, { HiddenInput } from "../../../../../components/form/input";
import Button from "../../../../../components/common/button";
import FormSelect from "../../../../../components/form/select";
import { postMultipleImage, postProduct, postSingleImage, updateProduct } from "../../../../helpers/backend";
import JodiEditor from "../../../components/form/jodiEditor";
import MultipleImageInput from "../../../../../components/form/multiImage";
import { noSelected } from "../../../../helpers/utils";

const ProductForm = ({ isVarient, setIsVarient, category, languages, selectedLang, setSelectedLang, formData, setFromData, i18n, router, form }) => {
    const [loading, setLoading] = useState(false);
    const handleFinish = async (values) => {
        setLoading(true);
        const imgArray = [];
        const preImg = [];
        try {
            if (values?.images?.length > 0) {
                for (let i = 0; i < values?.images.length; i++) {
                    if (values?.images[i]?.url) {
                        preImg.push(values?.images[i]?.url);
                    } else {
                        imgArray.push(values?.images[i].originFileObj);
                    }
                }
            }
            if (imgArray.length > 0) {
                const image = { images: imgArray, image_name: "product" };
                const { data } = await postMultipleImage(image);
                data?.map((item) => preImg.push(item));
                values.images = preImg;
            }
            if (values?.thumbnail_image?.length > 0) {
                if (values?.thumbnail_image?.[0]?.originFileObj) {
                    let image = { image: values?.thumbnail_image?.[0]?.originFileObj, image_name: "thumbnail_image" };
                    const { data } = await postSingleImage(image);
                    values.thumbnail_image = data;
                }
            }
            if (values?.images.length > 0) {
                values.images = values?.images?.map(item => item?.url ? item?.url : item)
            }
            let payload = {
                _id: values?._id || undefined,
                name: values?.name,
                short_description: values?.short_description,
                description: values?.description,
                images: values?.images,
                thumbnail_image: values?.thumbnail_image[0].url ? values?.thumbnail_image[0]?.url : values?.thumbnail_image,
                category: values?.category,
                price: parseFloat(values?.price),
                quantity: parseInt(values?.quantity),
                variants: isVarient
                    ? values?.variants.map(variant => ({
                        ...variant,
                        price: parseFloat(variant.price),
                    }))
                    : [],
                is_active: true,
            };
            if (values?._id) {
                await updateProduct(payload)
                message.success("Product updated successfully!");
                form.resetFields();
                router.push("/admin/product");
            } else {
                await postProduct(payload);
                message.success("Product added successfully!");
                form.resetFields();
                router.push("/admin/product");
            }
        } catch (error) {
            console.error("Error in handleFinish:", error);
            message.error("Something went wrong while submitting the form.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <BiLoader size={50} className="animate-spin" color={"#E67529"} />
            </div>
        );
    }

    return (
        <Form form={form} layout="vertical" onFinish={handleFinish} className="mt-2">
            {languages?.docs?.map((l, index) => (
                <div key={index} style={{ display: l.code === selectedLang ? "block" : "none" }}>
                    <HiddenInput name={'_id'} />
                    <FormInput
                        name={['name', l.code]}
                        label={'Name'}
                        required
                        onBlur={(e) => {
                            const uniqueData = formData?.filter(data => data?.lang !== selectedLang);
                            setFromData([...uniqueData, { lang: selectedLang, value: e.target.value }]);
                        }}
                        placeholder={`Enter Name`}
                    />
                    <FormInput
                        name={['short_description', l.code]}
                        label={'Short Description'}
                        placeholder={`Enter Short Description`}
                        textArea={true}
                        required
                    />
                    <div className="grid grid-cols-3 gap-3">
                        <FormSelect
                            label={'Category'}
                            name={'category'}
                            placeholder="Select Category"
                            options={category?.docs?.map((c) => ({
                                value: c?._id,
                                label: c?.name[l?.code] ?? c?.name['en'],
                            }))}
                            required
                        />
                        <FormInput placeholder={"Enter Price"} name={'price'} label={'Price(USD)'} type={"number"} required />
                        <FormInput placeholder={"Enter Quantity"} name={'quantity'} label={'Quantity'} type={"number"} required />
                    </div>
                    <div className="mb-4">
                        <p className="text-sm text-[#4A5568] font-medium">{i18n?.t('Variants')}</p>
                        <Switch
                            checked={isVarient}
                            onChange={() => setIsVarient(!isVarient)}
                            checkedChildren={<span className="text-white">{i18n?.t("On")}</span>}
                            unCheckedChildren={<span className="text-white">{i18n?.t("Off")}</span>}
                        />
                    </div>
                    {isVarient && (
                        <Form.List name={'variants'} initialValue={[{ name: '', price: 0, in_stock: true }]}>
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ name }, index) => (
                                        <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                            {languages?.docs?.map((l, langIndex) => (
                                                <div className="col-span-5" key={langIndex} style={{ display: l.code === selectedLang ? 'block' : 'none' }}>
                                                    <FormInput placeholder={`Enter Name`} name={[name, 'name', l.code]} label={'Name'} />
                                                </div>
                                            ))}
                                            <div className="col-span-4">
                                                <FormInput placeholder={"Enter Price"} type={"number"} name={[name, 'price']} label={'Price(USD)'} />
                                            </div>
                                            <div className="col-span-2">
                                                <Form.Item name={[name, 'in_stock']} label={i18n?.t("In Stock")} required>
                                                    <Radio.Group>
                                                        <Radio value={true}>{i18n?.t("Yes")}</Radio>
                                                        <Radio value={false}>{i18n?.t("No")}</Radio>
                                                    </Radio.Group>
                                                </Form.Item>
                                            </div>
                                            {fields.length > 1 && (
                                                <div>
                                                    <FaMinusCircle className="text-red-600 text-xl" onClick={() => remove(index)} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <div className="bg-slate-500 text-white flex items-center justify-start gap-2 px-3 py-2 ml-auto rounded-full w-fit cursor-pointer" onClick={() => add()}>
                                        <FaPlusCircle /> {i18n?.t("Add field")}
                                    </div>
                                </>
                            )}
                        </Form.List>
                    )}
                    <div className="mt-6">
                        <p className="text-sm text-[#4A5568] font-medium">{i18n?.t('Description')} <span className="text-primary">*</span></p>
                        <JodiEditor placeholder={i18n?.t("Description")} name={['description', l.code]} required />
                    </div>
                    <div className="flex flex-col gap-4 my-4">
                        <MultipleImageInput name={'thumbnail_image'} label={i18n?.t("Thumbnail Image")} />
                        <MultipleImageInput name={'images'} label={i18n?.t("Product Images")} max={4} />
                    </div>
                </div>
            ))}
            <Button onClick={() => noSelected({ form, setSelectedLang })} type="submit" className="mt-2.5">{i18n?.t("Submit")}</Button>
        </Form>
    );
};

export default ProductForm;