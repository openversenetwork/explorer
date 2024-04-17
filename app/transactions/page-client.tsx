'use client';
import Link from 'next/link';
import { useClusterPath } from '@utils/url';


import { Epoch } from '@components/common/Epoch';
import { ErrorCard } from '@components/common/ErrorCard';
import { LoadingCard } from '@components/common/LoadingCard';
import { Slot } from '@components/common/Slot';
import { TableCardBody } from '@components/common/TableCardBody';
import { TimestampToggle } from '@components/common/TimestampToggle';
import { LiveTransactionStatsCard, AnimatedTransactionCount } from '@components/LiveTransactionStatsCard';
import { StatsNotReady } from '@components/StatsNotReady';
import { useVoteAccounts } from '@providers/accounts/vote-accounts';
import { useCluster } from '@providers/cluster';
import { StatsProvider } from '@providers/stats';
import { numberWithSeparator } from '@utils/index';
import {
    ClusterStatsStatus,
    useDashboardInfo,
    usePerformanceInfo,
    useStatsProvider,
} from '@providers/stats/solanaClusterStats';
import { Status, SupplyProvider, useFetchSupply, useSupply } from '@providers/supply';
import { ClusterStatus } from '@utils/cluster';
import { abbreviatedNumber, lamportsToSol, lamportsToSolString, slotsToHumanString } from '@utils/index';

import { percentage } from '@utils/math';
import React, { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import FlipNumbers from 'react-flip-numbers';


export default function Page() {
    return (
        <StatsProvider>
            <SupplyProvider>
                <div className="container mt-4">
                    <LiveTransactionStatsCard />
                </div>
            </SupplyProvider>
        </StatsProvider>
    );
}

