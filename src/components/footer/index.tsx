'use client';

import React from 'react';
import { FooterWhyUs } from './FooterWhyUs';
import { FooterWave } from './FooterWave';
import { FooterCtaBar } from './FooterCtaBar';
import { FooterColumns } from './FooterColumns';
import { FooterCopyright } from './FooterCopyright';

export function Footer() {
  return (
    <footer className="select-none">
      {/* 1. Commitment & Stats */}
      <FooterWhyUs />

      {/* 2. Wave Separator */}
      <FooterWave />

      {/* 3. Dark Footer Container */}
      <div className="bg-sky-950 text-slate-300 pb-12 sm:pb-0">
        <FooterCtaBar />
        <FooterColumns />
        <FooterCopyright />
      </div>
    </footer>
  );
}
