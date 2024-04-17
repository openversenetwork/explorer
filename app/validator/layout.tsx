import { ClusterNodesProvider } from '@providers/cluster-nodes';
import { SupplyProvider } from '@providers/supply';
import { PropsWithChildren } from 'react';

export default function SupplyLayout({ children }: PropsWithChildren<Record<string, never>>) {
    return (
        <SupplyProvider>
            <ClusterNodesProvider>{children}</ClusterNodesProvider>
        </SupplyProvider>
    );
}
