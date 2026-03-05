"use client";

import React, { useState, useEffect } from 'react';
import { Activity, Box } from 'lucide-react';

export default function BlockchainStatus() {
  const [blockHeight, setBlockHeight] = useState<number | null>(null);
  const [gasPrice, setGasPrice] = useState<string | null>(null);
  const [status, setStatus] = useState<'online' | 'offline'>('online');

  useEffect(() => {
    const fetchChainData = async () => {
      try {
        const response = await fetch('https://polygon-rpc.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'eth_blockNumber',
            params: []
          })
        });

        const data = await response.json();
        if (data.result) {
          const height = parseInt(data.result, 16);
          setBlockHeight(height);
          setStatus('online');
          
          // Simulation simple pour l'indicateur
          const gasLevels = ["Faible", "Moyen", "Stable"];
          setGasPrice(gasLevels[Math.floor(Math.random() * gasLevels.length)]);
        }
      } catch (error) {
        setStatus('offline');
      }
    };

    fetchChainData();
    const interval = setInterval(fetchChainData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (status === 'offline') return null;

  // STYLE CAPSULE (identique au badge Protection)
  return (
    <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[10px] sm:text-xs text-gray-400 cursor-default animate-in fade-in duration-700">
        
        {/* Indicateur Vert */}
        <div className="flex items-center gap-1.5 text-green-500">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
            </span>
            <span className="font-bold tracking-wider uppercase hidden sm:inline">Polygon</span>
        </div>
        
        {/* Info Bloc */}
        {blockHeight && (
            <>
                <div className="h-3 w-px bg-white/10"></div>
                <div className="flex items-center gap-1" title={`Bloc actuel: #${blockHeight}`}>
                    <Box className="w-3 h-3 text-blue-400" />
                    <span className="font-mono text-gray-300">#{blockHeight.toLocaleString()}</span>
                </div>
            </>
        )}

        {/* Info Gas */}
        {gasPrice && (
            <>
                <div className="h-3 w-px bg-white/10 hidden sm:block"></div>
                <div className="hidden sm:flex items-center gap-1" title="Frais de réseau">
                    <Activity className="w-3 h-3 text-purple-400" />
                    <span>{gasPrice}</span>
                </div>
            </>
        )}
    </div>
  );
}
