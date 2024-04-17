import { useClusterPath } from '@utils/url';
import Link from 'next/link';
import React from 'react';

import { Copyable } from './Copyable';
import CountUp from 'react-countup'

function Count({ slot }) {
    return <CountUp end={slot} preserveValue={true} duration={0.2} separator="," />
}

type Props = {
    slot: number | bigint;
    link?: boolean;
};
export function Slot({ slot, link }: Props) {
    const slotPath = useClusterPath({ pathname: `/block/${slot}` });
    return (
        <span className="font-monospace">
            {link ? (
                <Copyable text={slot.toString()}>
                    <Link href={slotPath}>
                        {slot.toLocaleString('en-US')}
                        {/* <Count slot={slot} /> */}
                        {/* <CountUp end={slot} preserveValue={true} duration={0.2} separator="," /> */}
                    </Link>
                </Copyable>
            ) : (
                <Link href={slotPath}>
                    {slot.toLocaleString('en-US')}
                </Link>
                // <Count slot={slot} />
                // <CountUp end={slot} preserveValue={true} duration={0.2} separator="," />
            )}
        </span>
    );
}
