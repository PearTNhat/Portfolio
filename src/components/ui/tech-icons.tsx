import {
  SiGo,
  SiRust,
  SiCplusplus,
  SiTypescript,
  SiPython,
  SiEthereum,
  SiSolidity,
  SiPostgresql,
  SiMysql,
  SiRedis,
  SiMongodb,
  SiApachekafka,
  SiDocker,
  SiLinux,
  SiRabbitmq,
  SiNodedotjs,
  SiReact,
  SiNextdotjs,
  SiGnubash,
  SiRedux,
  SiTailwindcss,
  SiSocketdotio,
  SiExpress,
  SiCloudinary,
  SiJsonwebtokens,
  SiVercel,
} from 'react-icons/si';
import { Network, Database, Cpu, Search, Layers, Zap, GitBranch, Binary, Globe, Mail, Sparkles, CreditCard } from 'lucide-react';

export function getTechIcon(name: string, customClass: string = 'w-5 h-5') {
  const text = name.trim();
  const lower = text.toLowerCase();

  // 1. Specific Database & Backend checks first
  if (lower.includes('mongo')) {
    return <SiMongodb className={`${customClass} text-[#47A248] shrink-0`} />;
  }
  if (lower.includes('redis')) {
    return <SiRedis className={`${customClass} text-[#DC382D] shrink-0`} />;
  }
  if (lower.includes('postgres')) {
    return <SiPostgresql className={`${customClass} text-[#336791] dark:text-[#699ECA] shrink-0`} />;
  }
  if (lower.includes('mysql')) {
    return <SiMysql className={`${customClass} text-[#4479A1] dark:text-[#00758F] shrink-0`} />;
  }
  if (lower.includes('leveldb')) {
    return <Database className={`${customClass} text-cyan-500 dark:text-cyan-400 shrink-0`} />;
  }
  if (lower.includes('xapian')) {
    return <Search className={`${customClass} text-sky-500 dark:text-sky-400 shrink-0`} />;
  }

  // 2. Specific Blockchain, Smart Contracts & Consensus
  if (lower.includes('solidity') || lower.includes('contract')) {
    return <SiSolidity className={`${customClass} text-[#6366F1] dark:text-[#A5B4FC] shrink-0`} />;
  }
  if (lower.includes('geth') || lower.includes('ethereum') || lower.includes('evm') || lower.includes('layer 1')) {
    return <SiEthereum className={`${customClass} text-[#627EEA] dark:text-[#8C9FF5] shrink-0`} />;
  }
  if (lower.includes('dag') || lower.includes('bft') || lower.includes('consensus')) {
    return <GitBranch className={`${customClass} text-indigo-500 dark:text-indigo-400 shrink-0`} />;
  }
  if (lower.includes('rpc') || lower.includes('json-rpc')) {
    return <Layers className={`${customClass} text-cyan-500 dark:text-cyan-400 shrink-0`} />;
  }
  if (lower.includes('trie') || lower.includes('merkle') || lower.includes('nomt') || lower.includes('bls')) {
    return <Binary className={`${customClass} text-emerald-500 dark:text-emerald-400 shrink-0`} />;
  }

  // 3. Networking, Infra & DevOps
  if (lower.includes('http') || lower.includes('rest') || lower.includes('api')) {
    return <Globe className={`${customClass} text-sky-500 dark:text-sky-400 shrink-0`} />;
  }
  if (lower.includes('tcp') || lower.includes('udp') || lower.includes('socket')) {
    return <Zap className={`${customClass} text-amber-500 dark:text-amber-400 shrink-0`} />;
  }
  if (lower.includes('quic')) {
    return <Zap className={`${customClass} text-cyan-400 shrink-0`} />;
  }
  if (lower.includes('kafka')) {
    return <SiApachekafka className={`${customClass} text-[#E535AB] dark:text-rose-400 shrink-0`} />;
  }
  if (lower.includes('docker')) {
    return <SiDocker className={`${customClass} text-[#2496ED] shrink-0`} />;
  }
  if (lower.includes('linux')) {
    return <SiLinux className={`${customClass} text-[#FCC624] shrink-0`} />;
  }
  if (lower.includes('bash') || lower.includes('shell')) {
    return <SiGnubash className={`${customClass} text-[#4EAA25] shrink-0`} />;
  }
  if (lower.includes('rabbitmq')) {
    return <SiRabbitmq className={`${customClass} text-[#FF6600] shrink-0`} />;
  }
  if (lower.includes('grpc') || lower.includes('protobuf')) {
    return <Network className={`${customClass} text-sky-400 shrink-0`} />;
  }

  // 4. Frontend & Fullstack
  if (lower.includes('react')) {
    return <SiReact className={`${customClass} text-[#61DAFB] shrink-0`} />;
  }
  if (lower.includes('redux')) {
    return <SiRedux className={`${customClass} text-[#764ABC] shrink-0`} />;
  }
  if (lower.includes('tailwind')) {
    return <SiTailwindcss className={`${customClass} text-[#06B6D4] shrink-0`} />;
  }
  if (lower.includes('socket')) {
    return <SiSocketdotio className={`${customClass} text-slate-800 dark:text-slate-100 shrink-0`} />;
  }
  if (lower.includes('express')) {
    return <SiExpress className={`${customClass} text-slate-800 dark:text-slate-200 shrink-0`} />;
  }
  if (lower.includes('cloudinary')) {
    return <SiCloudinary className={`${customClass} text-[#3448C5] shrink-0`} />;
  }
  if (lower.includes('jwt') || lower.includes('token')) {
    return <SiJsonwebtokens className={`${customClass} text-[#D63AFF] shrink-0`} />;
  }
  if (lower.includes('next')) {
    return <SiNextdotjs className={`${customClass} text-slate-800 dark:text-slate-100 shrink-0`} />;
  }
  if (lower.includes('vercel')) {
    return <SiVercel className={`${customClass} text-slate-900 dark:text-white shrink-0`} />;
  }
  if (lower.includes('momo') || lower.includes('pay')) {
    return <CreditCard className={`${customClass} text-[#A50064] dark:text-[#D82D8B] shrink-0`} />;
  }
  if (lower.includes('mailer') || lower.includes('mail') || lower.includes('email')) {
    return <Mail className={`${customClass} text-sky-500 shrink-0`} />;
  }
  if (lower.includes('ai') || lower.includes('recommendation') || lower.includes('ml')) {
    return <Sparkles className={`${customClass} text-amber-500 dark:text-amber-400 shrink-0`} />;
  }
  if (lower.includes('multer')) {
    return <Layers className={`${customClass} text-indigo-500 shrink-0`} />;
  }

  // 5. Programming Languages
  if (lower.includes('python')) {
    return <SiPython className={`${customClass} text-[#3776AB] shrink-0`} />;
  }
  if (lower.includes('rust')) {
    return <SiRust className={`${customClass} text-[#DEA584] dark:text-[#F74C00] shrink-0`} />;
  }
  if (lower.includes('c++') || lower.includes('c / c++') || lower.includes('c/c++') || lower.includes('cpp')) {
    return <SiCplusplus className={`${customClass} text-[#00599C] dark:text-[#659AD2] shrink-0`} />;
  }
  if (lower.includes('typescript') || lower.includes('ts')) {
    return <SiTypescript className={`${customClass} text-[#3178C6] shrink-0`} />;
  }
  if (lower.includes('node') || lower.includes('javascript') || lower.includes('js')) {
    return <SiNodedotjs className={`${customClass} text-[#5FA04E] shrink-0`} />;
  }
  if (lower.includes('go') || lower.includes('golang')) {
    return <SiGo className={`${customClass} text-[#00ADD8] shrink-0`} />;
  }

  return <Cpu className={`${customClass} text-cyan-500 shrink-0`} />;
}
