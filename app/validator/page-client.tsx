'use client';
import { ClusterNodesCard } from '@components/ClusterNodesCard';
import { useCluster } from '@providers/cluster';
import { Cluster } from '@utils/cluster';
import React from 'react';

export default function NodesClient() {
    
    
    return (
        <div className="container mt-4">
            <ClusterNodesCard />
        </div>
    );
}
