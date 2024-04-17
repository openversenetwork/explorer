import { Address } from '@components/common/Address';
import { ErrorCard } from '@components/common/ErrorCard';
import { LoadingCard } from '@components/common/LoadingCard';
import { SolBalance } from '@components/common/SolBalance';
import { Status, useFetchClusterNodes, useClusterNodes } from '@providers/cluster-nodes';
import { useSupply } from '@providers/supply';
import { ContactInfo } from '@solana/web3.js';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { createRef, useMemo } from 'react';
import { ChevronDown } from 'react-feather';
import useAsyncEffect from 'use-async-effect';
import { percentage } from '../utils/math';
import { numberWithSeparator } from '@utils/index';
import multiavatar from '@multiavatar/multiavatar/esm'
import { PublicKey } from '@solana/web3.js';

export function ClusterNodesCard() {

    const richList = useClusterNodes();
    const fetchClusterNodes = useFetchClusterNodes();

    // Fetch supply on load
    React.useEffect(() => {
        if (richList === Status.Idle) fetchClusterNodes();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (richList === Status.Disconnected) {
        return <ErrorCard text="Not connected to the cluster" />;
    }

    if (richList === Status.Idle || richList === Status.Connecting) return <LoadingCard />;


    if (typeof richList === 'string') {
        return <ErrorCard text={richList} retry={fetchClusterNodes} />;
    }
    const versionDistribution = []

    const distribution = new Map<string, number>();
    for (const account of richList.nodes) {
        const version = account.version;
        distribution.set(version, (distribution.get(version) || 0) + 1);
    }
    console.log('distribution', distribution);
    // distribution Map convert list
    for (const [key, value] of distribution) {
        versionDistribution.push([key, value]);
    }


    return (
        <>
            <div className="container mt-n3">
                <div className="header">
                    <div className="header-body">
                        {/* <h6 className="header-pretitle">Details</h6> */}
                        <h2 className="header-title">Validators</h2>
                    </div>
                </div>

                <div className="row staking-card">
                    <div className="col-6 col-xl">
                        <div className="card">
                            <div className="card-body">
                                <h4>Validators</h4>
                                <h1>
                                    <em>
                                        {numberWithSeparator(String(richList.nodes?.length || 0))}
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
                                <h4>Weighted Skip Rate</h4>
                                <h1>
                                    <em>
                                        7.0%
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
                                <h4>Nominal Staking APY</h4>
                                <h1>
                                    <em>
                                        60%
                                    </em>
                                    {/* <small>%</small> */}
                                </h1>
                                <h5>

                                </h5>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-xl">
                        <div className="card">
                            <div className="card-body">
                                <h4>Node Versions</h4>
                                <h1>
                                    <em>
                                        3.18.11
                                    </em>
                                    {/* <small>AAA</small> */}

                                </h1>
                                <h5>

                                </h5>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card mt-4">
                    {richList === Status.Idle && (
                        <div className="card-body">
                            <span className="btn btn-white ms-3 d-none d-md-inline" onClick={fetchClusterNodes}>
                                Load Largest Accounts
                            </span>
                        </div>
                    )}

                    {richList.nodes && (
                        <>

                            <div className="table-responsive mb-0">
                                <table className="table table-sm table-nowrap card-table">
                                    <thead>
                                        <tr>
                                            <th className="text-muted">pubkey</th>
                                            <th className="text-muted">featureSet</th>
                                            <th className="text-muted">gossip</th>
                                            <th className="text-muted text-end">version</th>
                                            <th className="text-muted text-end">rpc port</th>
                                        </tr>
                                    </thead>
                                    <tbody className="list">
                                        {richList.nodes.map((account, index) => renderAccountRow(account, index))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

const renderAccountRow = (account: ContactInfo, index: number) => {
    let svgCode = multiavatar(account.pubkey)

    return (
        <tr key={index}>
            <td style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                {/* <Link href={`/validator/${account.pubkey}`}></Link> */}
                
                <div dangerouslySetInnerHTML={{ __html: svgCode }} style={{
                    width: '40px',
                    aspectRatio: '1/1',
                }} />
                <Address pubkey={new PublicKey(account.pubkey)} link/>
            </td>
            <td className="text-end">
                {/* gossip */}
                {account.featureSet}
            </td>
            <td className="text-end">
                {/* gossip */}
                {account.gossip?.split(':')[0]}
            </td>
            <td className="text-end">
                {/* gossip */}
                {account.version}
            </td>

            <td className="text-end">
                {/* gossip */}
                {account.rpc?.split(':')[1]}
            </td>
        </tr>
    );
};

