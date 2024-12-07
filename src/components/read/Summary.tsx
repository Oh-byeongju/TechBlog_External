'use client';

import { useState } from 'react';

import styles from './Summary.module.scss';

interface Props {
    description: string;
}

const Summary = ({ description }: Props) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={styles.baseContainer}>
            <div
                className={`${styles.description} ${isExpanded ? styles.expanded : styles.collapsed}`}
            >
                <div className={styles.header}>
                    <div className={styles.beta}>
                        {"이 글을 AI가 요약했어요"}
                        <div className={styles.betaBox}>
                            BETA
                        </div>
                    </div>
                    <button
                        className={styles.toggleButton}
                        onClick={toggleDescription}
                    >
                        {isExpanded ? '접기' : '더보기'}
                    </button>
                </div>
                {description}
            </div>

        </div>
    );
};

export default Summary;
