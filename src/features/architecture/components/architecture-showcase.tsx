'use client';

import * as React from 'react';
import { Container } from '@/components/layouts/container';
import { SectionHeader } from '@/components/layouts/section-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layers, Database, Shield, Zap, GitBranch, Binary, CheckCircle2 } from 'lucide-react';

export function ArchitectureShowcase() {
  const [activeTab, setActiveTab] = React.useState<'l1' | 'storage' | 'rpc'>('l1');

  return (
    <section id="architecture" className="py-20 sm:py-28 bg-slate-100/50 dark:bg-slate-900/30 border-y border-slate-200/80 dark:border-slate-800/80">
      <Container size="xl">
        <SectionHeader
          badge="System Architecture"
          title="Distributed Systems & Blockchain Internals"
          subtitle="Deep dive into core engineering implementations: Consensus mechanisms, state trie storage, and low-latency transport protocols."
        />

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          <button
            onClick={() => setActiveTab('l1')}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'l1'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Zap className="w-4 h-4" />
            MetaNode Layer 1 (12K TPS)
          </button>
          <button
            onClick={() => setActiveTab('storage')}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'storage'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Binary className="w-4 h-4" />
            Rust QUIC Storage & Merkle Tree
          </button>
          <button
            onClick={() => setActiveTab('rpc')}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'rpc'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            Ethereum JSON-RPC & BLS Gateway
          </button>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'l1' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Visual Architecture Diagram Card */}
            <Card className="lg:col-span-7 p-6 sm:p-8 bg-slate-950 text-slate-100 border-cyan-500/30 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <span className="font-mono text-xs text-cyan-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    Layer 1 Blockchain Pipeline (Go + Rust + cgo)
                  </span>
                  <Badge variant="cyan" size="sm">12,000 TPS</Badge>
                </div>

                {/* Pipeline Flowchart */}
                <div className="space-y-3.5 font-mono text-xs">
                  {/* Step 1: Ingestion & Mempool */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-200">1. Tx Ingestion & DAG Mempool</div>
                        <div className="text-[11px] text-slate-400">Concurrent transaction ordering via DAG</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">Async Go</span>
                  </div>

                  <div className="text-center text-slate-600">↓</div>

                  {/* Step 2: Consensus */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-200">2. Multi-Node BFT Consensus</div>
                        <div className="text-[11px] text-slate-400">Deterministic finality & validator quorum</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800">BFT Quorum</span>
                  </div>

                  <div className="text-center text-slate-600">↓</div>

                  {/* Step 3: EVM Execution */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <GitBranch className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-200">3. EVM Smart Contract Execution</div>
                        <div className="text-[11px] text-slate-400">Ethereum-compatible opcode execution & receipts</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">EVM Engine</span>
                  </div>

                  <div className="text-center text-slate-600">↓</div>

                  {/* Step 4: State Storage */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-cyan-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300">
                        <Database className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-cyan-300">4. Dual Trie & LSM-Tree Storage</div>
                        <div className="text-[11px] text-slate-400">NOMT Trie + Flat Trie on LevelDB & Xapian Indexer</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-600">LevelDB / Xapian</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>FFI/cgo bindings to Rust cryptography modules</span>
                <span className="text-emerald-400">Sync status: Synced</span>
              </div>
            </Card>

            {/* Technical Highlights & Contributions */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              <Card className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-500" />
                  Key Architectural Contributions
                </h3>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Consensus Protocol:</strong> Implemented DAG + BFT hybrid consensus enabling deterministic sub-second block finality.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>12,000 TPS Benchmark:</strong> Optimized block creation, transaction verification pipelines, and receipt generation.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>State Trie Engineering:</strong> Designed dual-tier storage with NOMT Trie & Flat Trie to eliminate read amplification on LevelDB.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Node Synchronization:</strong> Solved complex distributed state divergence and peer sync under high network latency.</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-cyan-950/20 to-indigo-950/20 border-cyan-500/20">
                <div className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-semibold mb-2">
                  TECHNOLOGY STACK
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['Go (Golang)', 'Rust', 'EVM', 'DAG', 'BFT', 'NOMT Trie', 'Flat Trie', 'LevelDB', 'Xapian', 'TCP Sockets', 'cgo / FFI', 'Linux'].map((t) => (
                    <Badge key={t} variant="cyan" size="sm">
                      {t}
                    </Badge>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'storage' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <Card className="lg:col-span-7 p-6 sm:p-8 bg-slate-950 text-slate-100 border-indigo-500/30 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <span className="font-mono text-xs text-indigo-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                    Rust + QUIC Chunk Transfer & Merkle Tree Verification
                  </span>
                  <Badge variant="indigo" size="sm">Zero Head-of-Line Blocking</Badge>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-indigo-300 font-bold mb-1">1. File Chunking & Async Tokio Streams</div>
                    <p className="text-[11px] text-slate-400">Large files partitioned into fixed 1MB chunks streamed over parallel QUIC streams.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-emerald-300 font-bold mb-1">2. Merkle Root Hash Computation</div>
                    <p className="text-[11px] text-slate-400">Cryptographic hash tree computed per chunk, root hash stored immutably on smart contract.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-cyan-300 font-bold mb-1">3. Proof Validation & Download Verification</div>
                    <p className="text-[11px] text-slate-400">Client verifies chunk validity via Merkle proofs on-the-fly with zero-copy buffers.</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
                Protocol: QUIC / UDP • Tokio async runtime • Solidity Smart Contract
              </div>
            </Card>

            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              <Card className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Binary className="w-5 h-5 text-indigo-500" />
                  Key Storage Capabilities
                </h3>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>QUIC Protocol:</strong> Multiplexed streams preventing packet loss stalls seen in standard TCP.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Merkle Proofs:</strong> End-to-end cryptographic verification of file integrity without loading full file in memory.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Smart Contract Metadata:</strong> Transparent audit trail of file uploads, downloads, and user verification records.</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-indigo-950/20 to-purple-950/20 border-indigo-500/20">
                <div className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-semibold mb-2">
                  STORAGE TECH STACK
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['Rust', 'QUIC Protocol', 'Merkle Tree', 'Smart Contracts', 'Solidity', 'Async Tokio', 'UDP'].map((t) => (
                    <Badge key={t} variant="indigo" size="sm">
                      {t}
                    </Badge>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'rpc' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <Card className="lg:col-span-7 p-6 sm:p-8 bg-slate-950 text-slate-100 border-emerald-500/30 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <span className="font-mono text-xs text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Ethereum JSON-RPC 2.0 & BLS Key Management (MetaCoSign)
                  </span>
                  <Badge variant="emerald" size="sm">EVM Tooling</Badge>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-slate-900 text-slate-300 border border-slate-800">
                    <div className="text-emerald-400 font-bold mb-1">{'// Supported JSON-RPC Standard Methods'}</div>
                    <div>eth_getBlockByNumber, eth_sendRawTransaction, eth_call, eth_estimateGas, eth_getTransactionReceipt, net_version...</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 text-slate-300 border border-slate-800">
                    <div className="text-cyan-400 font-bold mb-1">{'// BLS Key Registration Gateway'}</div>
                    <div>Validates validator public keys, signature proofs, and coordinates registration on-chain.</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
                Go-ethereum (Geth) compatibility • Sub-millisecond response caching • Web UI
              </div>
            </Card>

            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              <Card className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-500" />
                  RPC Gateway Capabilities
                </h3>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>100% Web3 Compatibility:</strong> Native plug-and-play for Metamask, Hardhat, Foundry, and Web3 SDKs.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>BLS Key Registration:</strong> Secure administrative registration and verification of validator cryptographic keys.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>High Concurrency:</strong> Connection pooling and request deduplication in Go.</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-emerald-950/20 to-teal-950/20 border-emerald-500/20">
                <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold mb-2">
                  RPC TECH STACK
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['Go (Golang)', 'JSON-RPC 2.0', 'Geth', 'BLS Signatures', 'React.js', 'Tailwind CSS', 'Docker'].map((t) => (
                    <Badge key={t} variant="emerald" size="sm">
                      {t}
                    </Badge>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
