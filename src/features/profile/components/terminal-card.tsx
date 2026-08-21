'use client';

import * as React from 'react';
import { Terminal, Copy, Check, Play } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

interface CommandOutput {
  command: string;
  response: string[];
}

const COMMAND_MAP: Record<string, string[]> = {
  'status': [
    '✓ Role: Blockchain & Golang Backend Engineer',
    '✓ Core Engine: MetaNode Layer 1 (12,000 TPS)',
    '✓ Consensus: DAG + BFT multi-node architecture',
    '✓ Storage: NOMT Trie, Flat Trie, LevelDB, Xapian',
    '✓ Status: Ready for high-impact backend & Web3 roles',
  ],
  'skills': [
    '→ Languages: Go (Golang), Rust, C/C++, TypeScript, Python',
    '→ Blockchain: EVM, Geth, Solidity, JSON-RPC, DAG/BFT, Merkle Trees',
    '→ Storage: LevelDB, Xapian, PostgreSQL, MySQL, Redis',
    '→ Systems: QUIC, TCP/UDP, Kafka, gRPC, Docker, Linux cgo/FFI',
  ],
  'projects': [
    '1. MetaNode Layer 1 Blockchain (12,000 TPS, DAG/BFT, EVM)',
    '2. Rust & QUIC Distributed File Storage (Merkle Integrity)',
    '3. Enterprise Go E-Commerce Microservices (Kafka, RabbitMQ, Redis, Graylog)',
    '4. MetaCoSign - Ethereum JSON-RPC & BLS Key Gateway',
    '5. Laptop E-Commerce Platform (React, Redux, Node.js, MongoDB, Socket.IO, AI & Momo)',
  ],
  'contact': [
    '📧 Email: letuannhat105@gmail.com',
    '📱 Phone: 0944477357',
    '🌐 Location: Hồ Chí Minh, Vietnam',
    '🐙 GitHub: https://github.com/PearTNhat',
  ],
  'help': [
    'Available commands:',
    '  status     - Show engineer profile and current status',
    '  skills     - List primary technical stack',
    '  projects   - Show key architectural projects',
    '  contact    - Print contact and social coordinates',
    '  clear      - Clear terminal window',
  ],
};

export function TerminalCard() {
  const [inputVal, setInputVal] = React.useState('');
  const [history, setHistory] = React.useState<CommandOutput[]>([
    {
      command: 'pear --status',
      response: COMMAND_MAP['status'],
    },
  ]);
  const { isCopied, copy } = useCopyToClipboard();

  const handleCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim().toLowerCase().replace(/^pear\s+--?/, '');
    if (trimmed === 'clear') {
      setHistory([]);
      return;
    }

    const resp = COMMAND_MAP[trimmed] || [
      `Command not recognized: "${cmdStr}". Type "help" or click one of the quick buttons below.`,
    ];

    setHistory((prev) => [
      ...prev,
      {
        command: cmdStr,
        response: resp,
      },
    ]);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    handleCommand(inputVal);
    setInputVal('');
  };

  const fullTerminalText = history
    .map((h) => `$ ${h.command}\n${h.response.join('\n')}`)
    .join('\n\n');

  return (
    <div className="w-full rounded-2xl terminal-window overflow-hidden font-mono text-xs sm:text-sm text-slate-200">
      {/* Terminal Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="ml-2 text-slate-400 text-xs flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            nhat@node-l1:~ (go 1.23)
          </span>
        </div>

        <button
          onClick={() => copy(fullTerminalText)}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
          title="Copy terminal session"
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Terminal Body */}
      <div className="p-4 sm:p-5 space-y-4 max-h-[320px] overflow-y-auto bg-slate-950/90">
        <div className="text-slate-400 text-[11px] pb-1 border-b border-slate-900">
          {'// Welcome to Lê Tuấn Nhật CLI. Run commands or click quick actions.'}
        </div>

        {history.map((item, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold">
              <span className="text-emerald-400">$</span>
              <span>{item.command}</span>
            </div>
            <div className="pl-4 space-y-0.5 text-slate-300">
              {item.response.map((line, lIdx) => (
                <div
                  key={lIdx}
                  className={
                    line.startsWith('✓')
                      ? 'text-emerald-400'
                      : line.startsWith('→')
                      ? 'text-cyan-300'
                      : 'text-slate-300'
                  }
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Input prompt */}
        <form onSubmit={onSubmit} className="flex items-center gap-2 pt-2">
          <span className="text-emerald-400 font-bold">$</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type 'skills', 'projects', 'contact' or 'help'..."
            className="flex-1 bg-transparent border-none text-slate-100 placeholder:text-slate-600 focus:outline-none text-xs sm:text-sm"
          />
          <button
            type="submit"
            aria-label="Run command"
            className="p-1 rounded text-cyan-400 hover:text-cyan-300 hover:bg-slate-800"
          >
            <Play className="w-3 h-3" />
          </button>
        </form>
      </div>

      {/* Quick Action Badges */}
      <div className="px-4 py-2.5 bg-slate-900/60 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 text-[11px]">Quick Run:</span>
        {['status', 'skills', 'projects', 'contact', 'help'].map((cmd) => (
          <button
            key={cmd}
            onClick={() => handleCommand(cmd)}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-cyan-950/60 hover:text-cyan-300 text-slate-300 text-[11px] border border-slate-700 transition-colors cursor-pointer"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
}
