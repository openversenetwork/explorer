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
                    <StatsCardBody />
                </div>
            </SupplyProvider>
        </StatsProvider>
    );
}

const DynamicRowsComponent = ({ initialValue, }) => {
    const displayCount = 5;
    const initData = Array.from({ length: displayCount }, (_, index) => initialValue - index) || [];

    const [data, setData] = useState(initData);
    const [latestValue, setLatestValue] = useState(initialValue);
    // change initialValue
    useEffect(() => {
        // console.log('updateData', initialValue);
        handleNewValue(initialValue);
    }, [initialValue]);

    const handleNewValue = (newValue) => {
        const difference = newValue - latestValue;
        if (difference > 0) {
            const newData = Array.from({ length: difference > displayCount ? displayCount : difference }, (_, index) => newValue - index);
            setData((prevData) => [...newData, ...prevData.slice(0, displayCount - difference)]);
            setLatestValue(newValue);
        }
    };
    // const slotPath = useClusterPath({ pathname: `/block/${slot}` });


    return (
        <div>
            <AnimatePresence>
                {data.map((value, index) => (
                    <motion.div key={value}
                        initial={{ opacity: 0, y: 75 }} // 设置初始状态，向下移动一点点
                        animate={{ opacity: 1, y: 0 }} // 设置动画状态，回到原始位置
                        exit={{ opacity: 0 }} // 设置退出状态，向上移动一点点
                        transition={{ duration: 0.2 }}
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        <Link href={`/block/${value}`}
                            key={value} className="card" style={{
                                width: '100%',
                                aspectRatio: '1/1',
                                display: 'flex',
                                color: 'white',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: '4px',
                                cursor: 'pointer',
                            }}>
                            <u>{value}</u>
                        </Link>
                    </motion.div >
                ))}
            </AnimatePresence>
        </div>
    );
};


function displayLamports(value: number | bigint) {
    return abbreviatedNumber(lamportsToSol(value));
}

function StatsCardBody() {


    const [initialValue, setInitialValue] = useState(1000);


    const handleInputChange = (event) => {
        setInitialValue(parseInt(event.target.value));
    };

    const dashboardInfo = useDashboardInfo();
    const performanceInfo = usePerformanceInfo();
    const { setActive } = useStatsProvider();
    const { cluster } = useCluster();

    React.useEffect(() => {
        setActive(true);
        return () => setActive(false);
    }, [setActive, cluster]);

    if (performanceInfo.status !== ClusterStatsStatus.Ready || dashboardInfo.status !== ClusterStatsStatus.Ready) {
        const error =
            performanceInfo.status === ClusterStatsStatus.Error || dashboardInfo.status === ClusterStatsStatus.Error;
        return <StatsNotReady error={error} />;
    }

    const { avgSlotTime_1h, avgSlotTime_1min, epochInfo, blockTime } = dashboardInfo;
    const hourlySlotTime = Math.round(1000 * avgSlotTime_1h);
    const averageSlotTime = Math.round(1000 * avgSlotTime_1min);
    const { slotIndex, slotsInEpoch } = epochInfo;
    const epochProgress = percentage(slotIndex, slotsInEpoch, 2).toFixed(1) + '%';
    const epochTimeRemaining = slotsToHumanString(Number(slotsInEpoch - slotIndex), hourlySlotTime);
    const { blockHeight, absoluteSlot } = epochInfo;

    return (

        <>
            <div class="row">
                <div class="col-xs-12 col-sm-6 col-md-10">
                    <div className="container mt-n3">
                        <div className="header">
                            <div className="header-body">
                                <h6 className="header-pretitle">Live</h6>
                                <h2 className="header-title">Blocks</h2>
                            </div>
                        </div>

                        <div className="row staking-card">
                            <div className="col-6 col-xl">
                                <div className="card">
                                    <div className="card-body">
                                        <h4>Slot</h4>
                                        <h1>
                                            <em>
                                                <Link href={`/block/${absoluteSlot}`}>
                                                    <div className="font-monospace em" style={{ width: 'fit-content', }}>
                                                        <FlipNumbers
                                                            height={30}
                                                            width={20}
                                                            play
                                                            perspective={400}
                                                            numbers={String(absoluteSlot)}
                                                        />

                                                    </div>
                                                </Link>
                                            </em>
                                            {/* <small>AAA</small> */}
                                        </h1>
                                        <h5>
                                            {/* Validators */}
                                        </h5>
                                    </div>
                                </div>
                            </div>

                            <div className="col-6 col-xl">
                                <div className="card">
                                    <div className="card-body">
                                        <h4>Block height</h4>
                                        <h1>
                                            <em>
                                                <Link href={`/block/${absoluteSlot}`}>
                                                    <div className="font-monospace em" style={{ width: 'fit-content', }}>
                                                        <FlipNumbers
                                                            height={30}
                                                            width={20}
                                                            play
                                                            perspective={400}
                                                            numbers={String(blockHeight)}
                                                        />

                                                    </div>
                                                </Link>
                                            </em>
                                            {/* <small>%</small> */}
                                        </h1>
                                        <h5>
                                            {/* Non-weighted:<em>7.4%</em> */}
                                        </h5>
                                    </div>
                                </div>
                            </div>

                            <div className="col-6 col-xl">
                                <div className="card">
                                    <div className="card-body">
                                        <h4>Slot time</h4>
                                        <h1>
                                            <em className="font-monospace">
                                                {averageSlotTime}
                                            </em>
                                            <small>ms</small>
                                        </h1>
                                        <h5>

                                        </h5>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-xl">
                                <div className="card">
                                    <div className="card-body">
                                        <h4>Epoch progress</h4>
                                        <h1>
                                            <em className="font-monospace">
                                                {epochProgress}
                                            </em>
                                            {/* <small>%</small> */}
                                        </h1>
                                        <h5>

                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                    <TableCardBody>
                        {blockTime && (
                            <tr>
                                <td className="w-100">Cluster time</td>
                                <td className="text-lg-end font-monospace">
                                    <TimestampToggle unixTimestamp={blockTime}></TimestampToggle>
                                </td>
                            </tr>
                        )}
                        <tr>
                            <td className="w-100">Slot time (1min average)</td>
                            <td className="text-lg-end font-monospace">{averageSlotTime}ms</td>
                        </tr>
                        <tr>
                            <td className="w-100">Slot time (1hr average)</td>
                            <td className="text-lg-end font-monospace">{hourlySlotTime}ms</td>
                        </tr>
                        <tr>
                            <td className="w-100">Epoch</td>
                            <td className="text-lg-end font-monospace">
                                <Epoch epoch={epochInfo.epoch} link />
                            </td>
                        </tr>
                        <tr>
                            <td className="w-100">Epoch time remaining (approx.)</td>
                            <td className="text-lg-end font-monospace">~{epochTimeRemaining}</td>
                        </tr>
                    </TableCardBody>
                </div>
                <div class="col-xs-6 col-md-2">

                    <DynamicRowsComponent initialValue={Number(absoluteSlot)} />

                </div>
            </div>
        </>
    );
}
