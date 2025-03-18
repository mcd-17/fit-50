'use client'
import '../styles/global.scss';
import I18nProvider from './providers/i18n';
import Providers from './providers/userProvider';
import SiteProvider from './contexts/site';
import { useFetch } from './helpers/hooks';
import { fetchAdminSettings } from './helpers/backend';

export default function RootLayout({ children }) {
    const [setting] = useFetch(fetchAdminSettings);
    const metadata = {
        title:`${setting?.title || 'Gymstick'}`,
        description: "Manage your gym with Gymstick",
    };

    return (
        <html lang='en' suppressHydrationWarning>
            <head>
                <title>{metadata.title}</title>
                <meta name="description" content={metadata.description} />
            </head>
            <I18nProvider>
                <SiteProvider>
                    <Providers>
                        <body>{children}</body>
                    </Providers>
                </SiteProvider>
            </I18nProvider>
        </html>
    );
}
