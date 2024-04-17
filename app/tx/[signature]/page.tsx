import { SignatureProps } from '@utils/index';
import { Metadata } from 'next/types';
import React from 'react';

import TransactionDetailsPageClient from './page-client';

type Props = Readonly<{
    params: SignatureProps;
}>;

export async function generateMetadata({ params: { signature } }: Props): Promise<Metadata> {
    return {
        description: `Details of the Openverse transaction with signature ${signature}`,
        title: `Transaction | ${signature} | Openverse`,
    };
}

export default function TransactionDetailsPage(props: Props) {
    return <TransactionDetailsPageClient {...props} />;
}
