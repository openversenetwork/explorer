import { Metadata } from 'next/types';
import React from 'react';

type Props = Readonly<{
    children: React.ReactNode;
    params: Readonly<{
        signature: string;
    }>;
}>;

export async function generateMetadata({ params: { signature } }: Props): Promise<Metadata> {
    if (signature) {
        return {
            description: `Interactively inspect the Openverse transaction with signature ${signature}`,
            title: `Transaction Inspector | ${signature} | Openverse`,
        };
    } else {
        return {
            description: `Interactively inspect Openverse transactions`,
            title: `Transaction Inspector | Openverse`,
        };
    }
}

export default function TransactionInspectorLayout({ children }: Props) {
    return children;
}
