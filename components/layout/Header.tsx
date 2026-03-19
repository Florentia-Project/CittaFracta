import React from 'react';

export const Header: React.FC = () => {
  return (
    <div className="hidden sm:block pb-2">
      <h1 className="text-2xl font-display font-bold tracking-[0.15em] uppercase text-ink scriptorium-title">
        CITTA·FRACTA
      </h1>
      <p className="text-[10px] font-body italic text-ink-light mt-0.5 tracking-wider scriptorium-subtitle">
        Analisi Storica delle Fazioni Fiorentine
      </p>
    </div>
  );
};
