'use client';

import { StagesColumn } from "../../components/renderStages/stagesColumn";

export default function CreatePage() {
  return (
    <main className="mx-auto max-w-[1020px] px-6 py-9 sm:px-10 sm:py-12">
      <StagesColumn stages={[]} />
    </main>
  );
}
