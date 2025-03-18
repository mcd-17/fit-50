import { Card, Form } from 'antd';
import { useRouter } from 'next/navigation';
import FormInput, { HiddenInput } from '../../../../../components/form/input';
import { postLanguage } from '../../../../helpers/backend';
import { useAction } from '../../../../helpers/hooks';
import FormSelect from '../../../../../components/form/select';
import Button from '../../../../../components/common/button';
import { useI18n } from '../../../../providers/i18n';

const LanguageForm = ({ title, form }) => {
    const i18n = useI18n();
    const { push } = useRouter()
    return (
        <>
            <Card>
                <h6 className="mb-4 text-xl">{i18n?.t('Language Information')}</h6>
                <div className="body">
                    <Form form={form} layout="vertical" onFinish={(values) => {
                        return useAction(
                            values?._id ? postLanguage : postLanguage,
                            values, () => {
                                push('/admin/languages')
                            })
                    }}>
                        {
                            title !== "Add Languages" && <HiddenInput name="_id" />
                        }
                        <div className="md:w-1/2">
                            <FormInput placeholder={("Enter Name")} name="name" label={("Name")} />
                        </div>
                        <div className="md:w-1/2">
                            <FormInput placeholder={("Enter Code")} name="code" label={("Code")} required />
                        </div>
                        <div className="md:w-1/2">
                            <FormInput placeholder={("Enter Flag")} name="flag" label={("Flag")} required />
                        </div>
                        <div className="md:w-1/2 multi">
                            <FormSelect placeholder={("Select Direction")} name="rtl" label={("Rtl Support")}
                                options={[
                                    { label: i18n?.t("Yes"), value: true },
                                    { label: i18n?.t("No"), value: false }
                                ]}
                            />
                        </div>
                        <div className="md:w-1/2 multi">
                            <FormSelect placeholder={("Select Status")} name="status" label={"Status"}
                                options={[
                                    { label: i18n?.t("Yes"), value: true },
                                    { label: i18n?.t("No"), value: false }
                                ]}
                            />
                        </div>
                        <Button type='submit'>
                            {i18n?.t(title === "Add Languages" ? "Submit" : "Update")}
                        </Button>
                    </Form>
                </div>
            </Card>
        </>
    );
}

export default LanguageForm