import { Address } from '@components/common/Address';
import { ErrorCard } from '@components/common/ErrorCard';
import { LoadingCard } from '@components/common/LoadingCard';
import { SolBalance } from '@components/common/SolBalance';
import { Status, useFetchClusterNodes, useClusterNodes } from '@providers/cluster-nodes';
import { useSupply } from '@providers/supply';
import { ContactInfo } from '@solana/web3.js';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'react-feather';
import useAsyncEffect from 'use-async-effect';
import { percentage } from '../utils/math';
import { numberWithSeparator } from '@utils/index';


import {
    ClusterStatsStatus,
    useDashboardInfo,
    usePerformanceInfo,
    useStatsProvider,
} from '@providers/stats/solanaClusterStats';
import { StatsNotReady } from '@components/StatsNotReady';
import { motion, AnimatePresence } from 'framer-motion';




const Row = ({ value, isNew }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: isNew ? -20 : 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: isNew ? 20 : 0 }}
            transition={{ duration: 0.5 }}
            style={{ padding: '10px', borderBottom: '1px solid #ccc' }}
        >
            {value}
        </motion.div>
    );
};

const DynamicRowsComponent = ({ initialValue }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        // updateData(initialValue);
        // console.log('initialValue', initialValue);
    }, [initialValue]);

    const updateData = (newValue) => {
        const newData = Array.from({ length: 20 }, (_, index) => newValue - index);
        console.log('newData', newData);
        setData(newData);
    };

    const handleNewValue = (newValue) => {
        const difference = newValue - data[0];
        if (difference > 0) {
            const newData = Array.from({ length: difference > 20 ? 20 : difference }, (_, index) => newValue - index).reverse();
            setData((prevData) => [...newData, ...prevData.slice(0, 20 - difference)]);
        }
    };

    return (
        <div>
            <button onClick={() => handleNewValue(data[0] + 5)}>Add 5</button>
            {JSON.stringify(data)}
            <AnimatePresence initial={false}>
                {data.map((value) => (
                    <Row key={value} value={value} />
                ))}
            </AnimatePresence>
        </div>
    );
};


export function BlocksCard() {

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
            <label>
                Initial Value:
                <input type="number" value={initialValue} onChange={handleInputChange} />
            </label>
            <DynamicRowsComponent initialValue={1000} />

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
                                    <em className="font-monospace">
                                        <Slot slot={absoluteSlot} link />
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
                                    <em className="font-monospace">
                                        {numberWithSeparator(String(blockHeight || 0))}
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
                                <h4>Slot time (1min average)</h4>
                                <h1>
                                    <em className="font-monospace">
                                        {averageSlotTime}
                                    </em>
                                    {/* <small>AAA</small> */}
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
        </>
    );
}

