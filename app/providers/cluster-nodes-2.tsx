'use client';

import * as Cache from '@providers/cache';
import { useCluster } from '@providers/cluster';
import { Connection } from '@solana/web3.js';
import type { ContactInfo } from '@solana/web3.js';
import { Cluster } from '@utils/cluster';
import React from 'react';

import { EpochSchedule, getFirstSlotInEpoch, getLastSlotInEpoch } from '../utils/epoch-schedule';

export enum FetchStatus {
    Fetching,
    FetchFailed,
    Fetched,
}

export enum ActionType {
    Update,
    Clear,
}

type Epoch = {
    firstBlock: number;
    firstTimestamp: number | null;
    lastBlock?: number;
    lastTimestamp: number | null;
};

type State = Cache.State<Epoch>;
type Dispatch = Cache.Dispatch<Epoch>;

const StateContext = React.createContext<State | undefined>(undefined);
const DispatchContext = React.createContext<Dispatch | undefined>(undefined);

type ClusterNodesProviderProps = { children: React.ReactNode };

export function ClusterNodesProvider({ children }: ClusterNodesProviderProps) {
    const { url } = useCluster();
    const [state, dispatch] = Cache.useReducer<Epoch>(url);

    React.useEffect(() => {
        dispatch({ type: ActionType.Clear, url });
    }, [dispatch, url]);

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
        </StateContext.Provider>
    );
}

export function useClusterNodes(key: number): Cache.CacheEntry<Epoch> | undefined {
    const context = React.useContext(StateContext);

    if (!context) {
        throw new Error(`useClusterNodes must be used within a EpochProvider`);
    }

    return context.entries[key];
}

export async function fetchClusterNodes(
    dispatch: Dispatch,
    url: string,
    cluster: Cluster,
    epochSchedule: EpochSchedule,
    currentEpoch: bigint,
    epoch: number
) {
    dispatch({
        key: epoch,
        status: FetchStatus.Fetching,
        type: ActionType.Update,
        url,
    });

    let status: FetchStatus;
    let data: Epoch | undefined = undefined;

    try {
        const connection = new Connection(url, 'confirmed');

        const nodes: Array<ContactInfo> = await connection.getClusterNodes() || [];

        data = {
            nodes,
        };
        status = FetchStatus.Fetched;
    } catch (err) {
        status = FetchStatus.FetchFailed;
        if (cluster !== Cluster.Custom) {
            console.error(err, { epoch: epoch.toString() });
        }
    }

    dispatch({
        data,
        key: epoch,
        status,
        type: ActionType.Update,
        url,
    });
}

export function useFetchClusterNodes() {
    const dispatch = React.useContext(DispatchContext);
    if (!dispatch) {
        throw new Error(`useFetchClusterNodes must be used within a EpochProvider`);
    }

    const { cluster, url } = useCluster();
    return React.useCallback(
        (key: number, currentEpoch: bigint, epochSchedule: EpochSchedule) =>
            fetchClusterNodes(dispatch, url, cluster, epochSchedule, currentEpoch, key),
        [dispatch, cluster, url]
    );
}
