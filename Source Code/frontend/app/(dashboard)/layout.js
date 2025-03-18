import I18nProvider from "../providers/i18n";
import Providers from "../providers/userProvider"
import "./styles/app.scss"

const RootLayout = ({ children }) => {
    return (
        <>
            <I18nProvider>
                <Providers>
                    {children}
                </Providers>
            </I18nProvider>
        </>
    )
}


export default RootLayout