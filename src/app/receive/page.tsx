'use client';

import { useState } from "react";
import { ReceivedChainsList } from "../../components/receive/receivedChainsList";
import { ContinueChainColumn } from "../../components/receive/continueChainColumn";
import { ActionChainStage } from "../../lib/mongo";

interface ReceivedChain {
    transferId: string;
    actionChainId: string;
    title?: string;
    senderPubKey: string;
    sentAt: Date;
    continued: boolean;
    continuedAt?: Date | null;
    stages: ActionChainStage[];
    stageCount: number;
}

export default function ReceivePage() {
    const [selectedChain, setSelectedChain] = useState<ReceivedChain | null>(null);

    return (
        <main className="mx-auto max-w-[920px] px-6 py-9 sm:px-10 sm:py-12">
            {!selectedChain ? (
                <ReceivedChainsList onSelectChain={setSelectedChain} />
            ) : (
                <ContinueChainColumn
                    chain={selectedChain}
                    onBack={() => setSelectedChain(null)}
                />
            )}
        </main>
    );
}
