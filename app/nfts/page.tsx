import SupplyPageClient from './page-client';

export const metadata = {
    description: `Overview of the native token supply on Openverse`,
    title: `Supply Overview | Openverse`,
};

export default function SupplyPage() {
    return <SupplyPageClient />;
}
