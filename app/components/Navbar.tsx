'use client';

import Logo from '@img/logos/logo_dark.png';
import { useClusterPath } from '@utils/url';
import Image from 'next/image';
import Link from 'next/link';
import { useSelectedLayoutSegment, useSelectedLayoutSegments } from 'next/navigation';
import React from 'react';

import { ClusterStatusButton } from './ClusterStatusButton';

export function Navbar() {
    // TODO: use `collapsing` to animate collapsible navbar
    const [collapse, setCollapse] = React.useState(false);
    const homePath = useClusterPath({ pathname: '/' });
    // const supplyPath = useClusterPath({ pathname: '/supply' });
    const validatorsPath = useClusterPath({ pathname: '/validator' });
    // const inspectorPath = useClusterPath({ pathname: '/tx/inspector' });
    const blocksPath = useClusterPath({ pathname: '/blocks' });
    const networkPath = useClusterPath({ pathname: '/network' });
    const tokensPath = useClusterPath({ pathname: '/tokens' });
    const transactionsPath = useClusterPath({ pathname: '/transactions' });
    const selectedLayoutSegment = useSelectedLayoutSegment();
    // const selectedLayoutSegments = useSelectedLayoutSegments();
    return (
        <nav className="navbar navbar-expand-md navbar-light">
            <div className="container">
                <Link href={homePath}>
                    <Image alt="Openverse Explorer" height={50} src={Logo} width={100} />
                </Link>

                <button className="navbar-toggler" type="button" onClick={() => setCollapse(value => !value)}>
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={`collapse navbar-collapse ms-auto me-4 ${collapse ? 'show' : ''}`}>
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link
                                className={`nav-link${selectedLayoutSegment === null ? ' active' : ''}`}
                                href={homePath}
                            >
                                Dashboard
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link${selectedLayoutSegment === 'validator' ? ' active' : ''}`}
                                href={validatorsPath}
                            >
                                Validators
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link${selectedLayoutSegment === 'blocks' ? ' active' : ''}`}
                                href={blocksPath}
                            >
                                Blocks
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                className={`nav-link${selectedLayoutSegment === 'transactions' ? ' active' : ''}`}
                                href={transactionsPath}
                            >
                                Transactions
                            </Link>
                        </li>
                        {/* <li className="nav-item">
                            <Link
                                className={`nav-link${selectedLayoutSegment === 'tokens' ? 'active' : ''}`}
                                href={tokensPath}
                            >
                                Tokens
                            </Link>
                        </li> */}
                        {/* <li className="nav-item">
                            <Link
                                className={`nav-link${selectedLayoutSegment === 'network' ? ' active' : ''}`}
                                href={networkPath}
                            >
                                Network Information
                            </Link>
                        </li> */}
                        {/* <li className="nav-item">
                            <Link
                                className={`nav-link${selectedLayoutSegment === 'supply' ? ' active' : ''}`}
                                href={supplyPath}
                            >
                                Supply
                            </Link>
                        </li> */}
                        {/* <li className="nav-item">
                            <Link
                                className={`nav-link${
                                    selectedLayoutSegments[0] === 'tx' && selectedLayoutSegments[1] === '(inspector)'
                                        ? ' active'
                                        : ''
                                }`}
                                href={inspectorPath}
                            >
                                Inspector
                            </Link>
                        </li> */}
                    </ul>
                </div>

                <div className="d-none d-md-block">
                    <ClusterStatusButton />
                </div>
            </div>
        </nav>
    );
}

export function Footer() {
    return (
        <footer className="footer mt-auto py-3">
            <div className="container text-center">
                <span className="text-muted">
                    Power by Openverse Team |{' '}
                    <a href="https://github.com/openversenetwork" target="_blank" rel="noopener noreferrer">
                        GitHub
                    </a>
                </span>
            </div>
        </footer>
    );
}
