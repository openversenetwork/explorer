import { Metadata } from 'next/types';

import EpochDetailsPageClient from './page-client';

type Props = Readonly<{
    params: {
        epoch: string;
    };
}>;

export async function generateMetadata({ params: { epoch } }: Props): Promise<Metadata> {
    return {
        description: `Summary of ${epoch} on Openverse`,
        title: `Epoch | ${epoch} | Openverse`,
    };
}

export default function EpochDetailsPage(props: Props) {
    return <EpochDetailsPageClient {...props} />;
}
