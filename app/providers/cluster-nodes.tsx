'use client';

import { useCluster } from '@providers/cluster';
import { Connection, ContactInfo } from '@solana/web3.js';
import { Cluster, ClusterStatus } from '@utils/cluster';
import React from 'react';

export enum Status {
    Idle,
    Disconnected,
    Connecting,
}

type Nodes = {
    nodes: ContactInfo[];
};

type State = Nodes | Status | string;

type Dispatch = React.Dispatch<React.SetStateAction<State>>;
const StateContext = React.createContext<State | undefined>(undefined);
const DispatchContext = React.createContext<Dispatch | undefined>(undefined);

type Props = { children: React.ReactNode };
export function ClusterNodesProvider({ children }: Props) {
    const [state, setState] = React.useState<State>(Status.Idle);
    const { status: clusterStatus, cluster, url } = useCluster();
    React.useEffect(() => {
        console.log('ClusterNodesProvider state', clusterStatus);
        if (state !== Status.Idle) {
            switch (clusterStatus) {
                case ClusterStatus.Connecting: {
                    setState(Status.Disconnected);
                    break;
                }
                case ClusterStatus.Connected: {
                    fetch(setState, cluster, url);
                    break;
                }
            }
        }
    }, [clusterStatus, cluster, url]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={setState}>{children}</DispatchContext.Provider>
        </StateContext.Provider>
    );
}

async function fetch(dispatch: Dispatch, cluster: Cluster, url: string) {
    dispatch(Status.Connecting);

    try {
        const connection = new Connection(url, 'confirmed');


        const [nodes] = (
            await Promise.all([
                connection.getClusterNodes(),
            ])
        ).map(response => response);
        
        // Update state if still connecting
        dispatch(state => {
            if (state !== Status.Connecting) return state;
            return { nodes };
        });
    } catch (err) {
        if (cluster !== Cluster.Custom) {
            console.error(err, { url });
        }
        dispatch('Failed to fetch top accounts');
    }
}

export function useClusterNodes() {
    const state = React.useContext(StateContext);
    if (state === undefined) {
        throw new Error(`useClusterNodes must be used within a ClusterNodesProvider`);
    }
    return state;
}

export function useFetchClusterNodes() {
    const dispatch = React.useContext(DispatchContext);
    if (!dispatch) {
        throw new Error(`useFetchClusterNodes must be used within a ClusterNodesProvider`);
    }

    const { cluster, url } = useCluster();
    return React.useCallback(() => {
        fetch(dispatch, cluster, url);
    }, [dispatch, cluster, url]);
}
