import { useState, useEffect } from "react";
import { 
  Users, 
  PlusCircle, 
  LogIn, 
  Search, 
  LayoutDashboard, 
  UserPlus, 
  Briefcase, 
  UserCheck, 
  Calendar, 
  Image as ImageIcon, 
  Settings,
  ChevronRight,
  School,
  MapPin,
  LogOut,
  Trash2,
  Save,
  Edit,
  Edit2,
  Clock,
  FileText,
  Camera,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ANGOLA_GEOGRAPHY } from "./data/angola";
import type { Association, Member, Department, Leadership, Event, GalleryItem, Documents, Complaint } from "./types";

// --- Components ---

const Button = ({ children, onClick, variant = "primary", className = "", icon: Icon, type = "button", disabled = false }: any) => {
  const variants: any = {
    primary: "bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-emerald-800 disabled:text-zinc-400",
    secondary: "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 disabled:bg-zinc-900 disabled:text-zinc-500",
    outline: "border border-zinc-700 hover:bg-zinc-800 text-zinc-300 disabled:border-zinc-900 disabled:text-zinc-600",
    danger: "bg-red-600 hover:bg-red-700 text-white disabled:bg-red-900 disabled:text-zinc-400",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${variants[variant]} ${className} ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

const Input = ({ label, value, onChange, type = "text", placeholder = "", required = false }: any) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
    />
  </div>
);

const Select = ({ label, value, onChange, options, placeholder = "Selecione...", required = false, disabled = false }: any) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{label}</label>}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      disabled={disabled}
      className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <option value="">{placeholder}</option>
      {options.map((opt: string) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const Card = ({ children, title, icon: Icon, className = "" }: any) => (
  <div className={`bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 ${className}`}>
    <div className="flex items-center gap-3 mb-6">
      {Icon && <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500"><Icon size={20} /></div>}
      <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
    </div>
    {children}
  </div>
);

// --- Main App ---

export default function App() {
  const [view, setView] = useState<"landing" | "create" | "login" | "search" | "panel">("landing");
  const [associations, setAssociations] = useState<Association[]>([]);
  const [currentAssociation, setCurrentAssociation] = useState<Association | null>(null);

  useEffect(() => {
    fetchAssociations();
  }, []);

  const fetchAssociations = async () => {
    try {
      const res = await fetch("/api/associations");
      const data = await res.json();
      setAssociations(data);
    } catch (err) {
      console.error("Failed to fetch associations", err);
    }
  };

  const handleLogout = () => {
    setCurrentAssociation(null);
    setView("landing");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setView("landing")}
          >
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">G</div>
            <span className="text-xl font-bold text-white tracking-tight">Giro <span className="text-emerald-500">Escola</span></span>
          </div>
          
          <div className="flex items-center gap-4">
            {currentAssociation ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-zinc-400 hidden sm:block">{currentAssociation.name}</span>
                <Button variant="outline" icon={LogOut} onClick={handleLogout}>Sair</Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setView("search")}>Pesquisar</Button>
                <Button variant="primary" onClick={() => setView("login")}>Entrar</Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {view === "landing" && (
            <LandingView 
              associationsCount={associations.length} 
              onCreate={() => setView("create")} 
              onLogin={() => setView("login")}
              onSearch={() => setView("search")}
            />
          )}
          {view === "create" && (
            <CreateView 
              onSuccess={(assoc: Association) => {
                setCurrentAssociation(assoc);
                setView("panel");
                fetchAssociations();
              }} 
              onCancel={() => setView("landing")}
            />
          )}
          {view === "login" && (
            <LoginView 
              onSuccess={(assoc: Association) => {
                setCurrentAssociation(assoc);
                setView("panel");
              }} 
              onCancel={() => setView("landing")}
            />
          )}
          {view === "search" && (
            <SearchView 
              associations={associations} 
              onBack={() => setView("landing")}
            />
          )}
          {view === "panel" && currentAssociation && (
            <Panel association={currentAssociation} onUpdate={fetchAssociations} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- Views ---

function LandingView({ associationsCount, onCreate, onLogin, onSearch }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center text-center max-w-3xl mx-auto"
    >
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-widest mb-6">
        Sistema de Gestão Estudantil
      </div>
      <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 tracking-tight">
        Impulsionando a Educação em <span className="text-emerald-500">Angola</span>
      </h1>
      <p className="text-lg text-zinc-400 mb-12 leading-relaxed">
        A plataforma centralizada para gerir associações estudantis em Angola. Junte-se a <span className="text-white font-semibold">{associationsCount}</span> associações já cadastradas no Giro Escola.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        <Card title="Para Direção" icon={Users} className="text-left">
          <p className="text-sm text-zinc-500 mb-6">Crie ou faça login para gerir a sua associação e membros.</p>
          <div className="flex flex-col gap-2">
            <Button variant="primary" icon={PlusCircle} onClick={onCreate} className="w-full">Criar Associação</Button>
            <Button variant="secondary" icon={LogIn} onClick={onLogin} className="w-full">Entrar no Painel</Button>
          </div>
        </Card>

        <Card title="Para Estudantes" icon={Search} className="text-left">
          <p className="text-sm text-zinc-500 mb-6">Pesquise associações e conheça os seus projetos e eventos.</p>
          <Button variant="outline" icon={Search} onClick={onSearch} className="w-full">Pesquisar Associação</Button>
        </Card>

        <Card title="Estatísticas" icon={LayoutDashboard} className="text-left">
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-3xl font-bold text-white">{associationsCount}</div>
              <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Associações Ativas</div>
            </div>
            <div className="h-px bg-zinc-800 w-full"></div>
            <div className="text-sm text-zinc-400 italic">
              "A educação é a arma mais poderosa que você pode usar para mudar o mundo."
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

function CreateView({ onSuccess, onCancel }: any) {
  const [formData, setFormData] = useState({
    name: "",
    school: "",
    province: "",
    municipality: "",
    neighborhood: ""
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    if (e && e.preventDefault) e.preventDefault();
    
    if (!formData.name || !formData.school || !formData.province || !formData.municipality || !formData.neighborhood) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    console.log("Submitting association creation:", formData);
    try {
      const res = await fetch("/api/associations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      console.log("Response from server:", data);
      if (data.success) {
        setResult(data);
      } else {
        alert("Erro: " + (data.error || "Não foi possível criar a associação"));
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Erro de conexão ao criar associação");
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto"
      >
        <Card title="Associação Criada com Sucesso!" icon={PlusCircle}>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-6">
            <p className="text-sm text-zinc-400 mb-4">Guarde estas credenciais em um lugar seguro. Você precisará delas para entrar no painel.</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Número Interno</label>
                <div className="text-2xl font-mono font-bold text-white">{result.internal_number}</div>
              </div>
              <div>
                <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Senha de Acesso</label>
                <div className="text-2xl font-mono font-bold text-white">{result.password}</div>
              </div>
            </div>
          </div>
          <Button variant="primary" onClick={() => onSuccess({ ...formData, ...result })} className="w-full">Ir para o Painel</Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-xl mx-auto"
    >
      <Card title="Criar Nova Associação" icon={PlusCircle}>
        <div className="flex flex-col gap-6">
          <Input label="Nome da Associação" value={formData.name} onChange={(v: any) => setFormData({...formData, name: v})} placeholder="Ex: AE-ISPTEC" required />
          <Input label="Nome da Instituição / Escola" value={formData.school} onChange={(v: any) => setFormData({...formData, school: v})} placeholder="Ex: Instituto Superior Politécnico de Tecnologias e Ciências" required />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select 
              label="Província" 
              value={formData.province} 
              onChange={(v: any) => setFormData({...formData, province: v, municipality: ""})} 
              options={Object.keys(ANGOLA_GEOGRAPHY)} 
              required 
            />
            <Select 
              label="Município" 
              value={formData.municipality} 
              onChange={(v: any) => setFormData({...formData, municipality: v})} 
              options={formData.province ? ANGOLA_GEOGRAPHY[formData.province] : []} 
              required 
              disabled={!formData.province}
            />
          </div>

          <Input 
            label="Bairro" 
            value={formData.neighborhood} 
            onChange={(v: any) => setFormData({...formData, neighborhood: v})} 
            placeholder="Digite o nome do seu bairro"
            required 
          />

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onCancel} className="flex-1" disabled={loading}>Cancelar</Button>
            <Button variant="primary" onClick={handleSubmit} className="flex-1" disabled={loading}>
              {loading ? "Criando..." : "Criar Agora"}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function LoginView({ onSuccess, onCancel }: any) {
  const [internalNumber, setInternalNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: any) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);
    console.log("Attempting login:", internalNumber);
    try {
      const res = await fetch("/api/associations/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internal_number: internalNumber, password })
      });
      const data = await res.json();
      console.log("Login response:", data);
      if (data.success) {
        onSuccess(data.association);
      } else {
        alert("Erro: " + (data.error || "Credenciais inválidas"));
      }
    } catch (err) {
      console.error("Login fetch error:", err);
      alert("Erro de conexão ao entrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto"
    >
      <Card title="Entrar na Associação" icon={LogIn}>
        <div className="flex flex-col gap-6">
          <Input label="Número Interno" value={internalNumber} onChange={setInternalNumber} placeholder="Ex: AE-2026-1234" required />
          <Input label="Senha" type="password" value={password} onChange={setPassword} required />
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onCancel} className="flex-1" disabled={loading}>Voltar</Button>
            <Button variant="primary" onClick={handleLogin} className="flex-1" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function SearchView({ associations, onBack }: any) {
  const [search, setSearch] = useState("");
  const [selectedAssoc, setSelectedAssoc] = useState<Association | null>(null);

  const filtered = associations.filter((a: Association) => 
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    a.school.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedAssoc) {
    return <PublicProfile association={selectedAssoc} onBack={() => setSelectedAssoc(null)} />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white">Pesquisar Associações</h2>
        <Button variant="outline" onClick={onBack}>Voltar</Button>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
        <input 
          type="text" 
          placeholder="Pesquisar por nome ou escola..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
        />
      </div>

      {associations.length === 0 && search === "" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-zinc-900/50 border border-zinc-800 h-40 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((assoc: Association) => (
          <div 
            key={assoc.id} 
            onClick={() => setSelectedAssoc(assoc)}
            className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl hover:border-emerald-500/50 cursor-pointer transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                <School size={24} />
              </div>
              <ChevronRight className="text-zinc-600 group-hover:text-emerald-500 transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{assoc.name}</h3>
            <p className="text-sm text-zinc-500 mb-4 line-clamp-1">{assoc.school}</p>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <MapPin size={14} />
              <span>{assoc.province}, {assoc.municipality}</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-zinc-500">
            Nenhuma associação encontrada com este termo.
          </div>
        )}
      </div>
    )}
    </motion.div>
  );
}

// --- Public Profile (for Search) ---

function PublicProfile({ association, onBack }: any) {
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("members");

  useEffect(() => {
    // Increment visit
    fetch(`/api/associations/${association.id}/visit`, { method: "POST" });

    const fetchProfile = async () => {
      const [members, leadership, events, gallery, settings, departments] = await Promise.all([
        fetch(`/api/associations/${association.id}/members`).then(r => r.json()),
        fetch(`/api/associations/${association.id}/leadership`).then(r => r.json()),
        fetch(`/api/associations/${association.id}/events`).then(r => r.json()),
        fetch(`/api/associations/${association.id}/gallery`).then(r => r.json()),
        fetch(`/api/associations/${association.id}/settings`).then(r => r.json()),
        fetch(`/api/associations/${association.id}/departments`).then(r => r.json())
      ]);
      setData({ members, leadership, events, gallery, settings, departments });
    };
    fetchProfile();
  }, [association.id]);

  if (!data) {
    return (
      <div className="max-w-5xl mx-auto animate-pulse">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-10 w-32 bg-zinc-800 rounded-xl" />
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden mb-8">
          <div className="h-48 bg-zinc-800" />
          <div className="pt-16 pb-8 px-8">
            <div className="h-10 w-2/3 bg-zinc-800 rounded-lg mb-4" />
            <div className="h-6 w-1/3 bg-zinc-800 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 px-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-12 bg-zinc-800 rounded-xl" />)}
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "members", label: "Associados", icon: Users },
    { id: "leadership", label: "Direção", icon: UserCheck },
    { id: "departments", label: "Departamentos", icon: Briefcase },
    { id: "events", label: "Eventos", icon: Calendar },
    { id: "gallery", label: "Galeria", icon: ImageIcon },
    { id: "documents", label: "Documentos", icon: FileText },
    { id: "complaints", label: "Reclamações", icon: MessageSquare },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" onClick={onBack}>Voltar para lista</Button>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden mb-8">
        <div className="h-48 bg-gradient-to-r from-emerald-600 to-teal-600 relative">
          <div className="absolute -bottom-12 left-8 flex items-end gap-6">
            <div className="w-32 h-32 bg-zinc-900 border-4 border-zinc-900 rounded-2xl overflow-hidden shadow-2xl">
              {data.settings.docs?.association_logo ? (
                <img src={data.settings.docs.association_logo} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-emerald-500">
                  {association.name[0]}
                </div>
              )}
            </div>
            <div className="mb-4">
              <h1 className="text-4xl font-bold text-white tracking-tight">{association.name}</h1>
              <p className="text-zinc-200 flex items-center gap-2">
                <School size={16} /> {association.school}
              </p>
            </div>
          </div>
        </div>
        <div className="pt-16 pb-4 px-8 flex flex-wrap gap-8">
          <div className="flex items-center gap-2 text-zinc-400">
            <MapPin size={18} className="text-emerald-500" />
            <span>{association.province}, {association.municipality}, {association.neighborhood}</span>
          </div>
        </div>

        {/* Tab Menu */}
        <div className="px-8 border-t border-zinc-800/50 mt-4 overflow-x-auto">
          <div className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 text-sm font-bold uppercase tracking-widest transition-all relative flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id ? "text-emerald-500" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="public-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "members" && (
              <Card title="Lista de Associados" icon={Users}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="pb-4 font-bold text-xs uppercase tracking-wider text-zinc-500">Nome</th>
                        <th className="pb-4 font-bold text-xs uppercase tracking-wider text-zinc-500">Classe</th>
                        <th className="pb-4 font-bold text-xs uppercase tracking-wider text-zinc-500">Curso</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                      {data.members.map((m: Member) => (
                        <tr key={m.id}>
                          <td className="py-4 text-zinc-200">{m.name}</td>
                          <td className="py-4 text-zinc-400">{m.grade} Classe</td>
                          <td className="py-4 text-zinc-400">{m.course || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {data.members.length === 0 && <p className="text-center py-8 text-zinc-500 italic">Nenhum associado listado.</p>}
                </div>
              </Card>
            )}

            {activeTab === "leadership" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.leadership.map((leader: Leadership) => (
                  <div key={leader.id} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-2xl bg-zinc-800 overflow-hidden mb-4 shadow-xl">
                      {leader.photo ? <img src={leader.photo} className="w-full h-full object-cover" /> : <Users className="w-full h-full p-6 text-zinc-600" />}
                    </div>
                    <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">{leader.role}</div>
                    <div className="text-xl font-bold text-white mb-1">{leader.name}</div>
                    <div className="text-sm text-zinc-400">{leader.grade}ª Classe {leader.course && `| ${leader.course}`}</div>
                  </div>
                ))}
                {data.leadership.length === 0 && <div className="col-span-full py-12 text-center text-zinc-500 italic">Informação da direção não disponível.</div>}
              </div>
            )}

            {activeTab === "departments" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {data.departments.map((dept: Department) => (
                  <Card key={dept.id} title={dept.name} icon={Briefcase}>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-zinc-800 pb-2">
                        <span className="text-zinc-500">Coordenador:</span>
                        <span className="text-zinc-200">{dept.coordinator_id || "Não definido"}</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-800 pb-2">
                        <span className="text-zinc-500">Adjunto:</span>
                        <span className="text-zinc-200">{dept.deputy_id || "Não definido"}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block mb-1">Equipa:</span>
                        <p className="text-zinc-400 text-xs leading-relaxed">{dept.other_members || "Apenas direção do departamento."}</p>
                      </div>
                    </div>
                  </Card>
                ))}
                {data.departments.length === 0 && <div className="col-span-full py-12 text-center text-zinc-500 italic">Nenhum departamento listado.</div>}
              </div>
            )}

            {activeTab === "events" && (
              <div className="space-y-6">
                {data.events.map((event: Event) => (
                  <div key={event.id} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl flex flex-col sm:flex-row gap-8">
                    {event.photo && (
                      <div className="w-full sm:w-64 h-40 rounded-2xl overflow-hidden flex-shrink-0">
                        <img src={event.photo} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 text-xs font-bold text-emerald-500 uppercase mb-3">
                        <span className="flex items-center gap-1"><Calendar size={14} /> {event.date}</span>
                        <span className="flex items-center gap-1"><Clock size={14} /> {event.time}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">{event.description}</h3>
                      <div className="flex items-center gap-2 text-zinc-400">
                        <MapPin size={16} className="text-emerald-500" /> {event.location}
                      </div>
                    </div>
                  </div>
                ))}
                {data.events.length === 0 && <div className="py-12 text-center text-zinc-500 italic">Nenhum evento programado.</div>}
              </div>
            )}

            {activeTab === "gallery" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.gallery.map((item: GalleryItem) => (
                  <div key={item.id} className="aspect-square rounded-3xl overflow-hidden bg-zinc-800 group relative">
                    <img src={item.photo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <p className="text-sm text-white line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                ))}
                {data.gallery.length === 0 && <div className="col-span-full py-12 text-center text-zinc-500 italic">Galeria vazia.</div>}
              </div>
            )}

            {activeTab === "documents" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card title="Documentos Oficiais" icon={FileText}>
                  <div className="space-y-4">
                    {[
                      { label: "Estatuto", key: "statute" },
                      { label: "Termo de Responsabilidade", key: "terms" },
                      { label: "Contrato", key: "contract" }
                    ].map(doc => (
                      data.settings.docs?.[doc.key] ? (
                        <a 
                          key={doc.key}
                          href={data.settings.docs[doc.key]} 
                          target="_blank" 
                          className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-2xl hover:bg-zinc-800 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                              <FileText size={20} />
                            </div>
                            <span className="font-medium text-zinc-200">{doc.label}</span>
                          </div>
                          <ChevronRight size={18} className="text-zinc-600 group-hover:text-emerald-500 transition-colors" />
                        </a>
                      ) : null
                    ))}
                    {!data.settings.docs?.statute && !data.settings.docs?.terms && !data.settings.docs?.contract && (
                      <p className="text-center py-4 text-zinc-500 italic">Nenhum documento disponível.</p>
                    )}
                  </div>
                </Card>

                <Card title="Instituição de Ensino" icon={School}>
                  <div className="flex flex-col items-center text-center gap-4 py-4">
                    <div className="w-32 h-32 bg-zinc-800 rounded-3xl overflow-hidden shadow-xl">
                      {data.settings.docs?.school_logo ? (
                        <img src={data.settings.docs.school_logo} className="w-full h-full object-cover" />
                      ) : (
                        <School className="w-full h-full p-8 text-zinc-700" />
                      )}
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white">{association.school}</div>
                      <div className="text-xs text-emerald-500 font-bold uppercase tracking-widest mt-2">Instituição Parceira</div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === "complaints" && (
              <PublicComplaintsTab associationId={association.id} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// --- Management Panel ---

function Panel({ association, onUpdate }: { association: Association, onUpdate: () => void }) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "members" | "departments" | "leadership" | "events" | "gallery" | "complaints" | "settings">("dashboard");

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "members", label: "Membros", icon: UserPlus },
    { id: "departments", label: "Departamentos", icon: Briefcase },
    { id: "leadership", label: "Direção", icon: UserCheck },
    { id: "events", label: "Eventos", icon: Calendar },
    { id: "gallery", label: "Galeria", icon: ImageIcon },
    { id: "complaints", label: "Reclamações", icon: MessageSquare },
    { id: "settings", label: "Configurações", icon: Settings },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Nav */}
      <div className="lg:col-span-1">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-2 sticky top-24">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mb-1 last:mb-0 ${
                activeTab === tab.id 
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" 
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              }`}
            >
              <tab.icon size={20} />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="lg:col-span-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "dashboard" && <DashboardTab associationId={association.id} />}
            {activeTab === "members" && <MembersTab associationId={association.id} />}
            {activeTab === "departments" && <DepartmentsTab associationId={association.id} />}
            {activeTab === "leadership" && <LeadershipTab associationId={association.id} />}
            {activeTab === "events" && <EventsTab associationId={association.id} />}
            {activeTab === "gallery" && <GalleryTab associationId={association.id} />}
            {activeTab === "complaints" && <ComplaintsTab associationId={association.id} />}
            {activeTab === "settings" && <SettingsTab association={association} onUpdate={onUpdate} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- Panel Tabs ---

function DashboardTab({ associationId }: { associationId: number }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const [settings, members, events] = await Promise.all([
        fetch(`/api/associations/${associationId}/settings`).then(r => r.json()),
        fetch(`/api/associations/${associationId}/members`).then(r => r.json()),
        fetch(`/api/associations/${associationId}/events`).then(r => r.json())
      ]);
      setData({ ...settings, membersCount: members.length, eventsCount: events.length });
    };
    fetchStats();
  }, [associationId]);

  if (!data) return null;

  const stats = [
    { label: "Visitas à Página", value: data.association?.visits || 0, icon: Eye, color: "text-blue-500" },
    { label: "Membros Cadastrados", value: data.membersCount, icon: Users, color: "text-emerald-500" },
    { label: "Eventos Publicados", value: data.eventsCount, icon: Calendar, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} title={stat.label} icon={stat.icon}>
            <div className={`text-4xl font-bold ${stat.color} mt-2`}>{stat.value}</div>
          </Card>
        ))}
      </div>
      
      <Card title="Menu Principal" icon={LayoutDashboard}>
        <p className="text-zinc-400 leading-relaxed">
          Bem-vindo ao painel de gestão da sua associação. Aqui você pode gerir membros, departamentos, eventos e visualizar as reclamações dos estudantes. Utilize o menu lateral para navegar entre as diferentes secções.
        </p>
      </Card>
    </div>
  );
}

function ComplaintsTab({ associationId }: { associationId: number }) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      const res = await fetch(`/api/associations/${associationId}/complaints`);
      setComplaints(await res.json());
    };
    fetchComplaints();
  }, [associationId]);

  return (
    <div className="space-y-6">
      <Card title="Reclamações Recebidas" icon={MessageSquare}>
        <div className="space-y-4">
          {complaints.map((c) => (
            <div key={c.id} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-white font-bold">{c.student_name}</div>
                  <div className="text-xs text-zinc-500">{c.student_grade} Classe • {new Date(c.created_at).toLocaleDateString()}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${c.satisfied ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                  {c.satisfied ? 'Satisfeito' : 'Não Satisfeito'}
                </div>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed italic">"{c.description}"</p>
            </div>
          ))}
          {complaints.length === 0 && <p className="text-center py-8 text-zinc-500 italic">Nenhuma reclamação recebida até o momento.</p>}
        </div>
      </Card>
    </div>
  );
}

function PublicComplaintsTab({ associationId }: { associationId: number }) {
  const [formData, setFormData] = useState({ student_name: "", student_grade: "", description: "", satisfied: true });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await fetch(`/api/associations/${associationId}/complaints`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card title="Reclamação Enviada" icon={MessageSquare}>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-4">
            <ThumbsUp size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Obrigado pelo seu feedback!</h3>
          <p className="text-zinc-400">A sua reclamação foi enviada com sucesso para a associação.</p>
          <Button variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>Enviar outra</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Enviar Reclamação ou Sugestão" icon={MessageSquare}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Seu Nome" value={formData.student_name} onChange={(v: any) => setFormData({...formData, student_name: v})} required />
          <Select label="Sua Classe" value={formData.student_grade} onChange={(v: any) => setFormData({...formData, student_grade: v})} options={["7ª", "8ª", "9ª", "10ª", "11ª", "12ª", "13ª"]} required />
        </div>
        
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Descrição da Reclamação</label>
          <textarea 
            value={formData.description} 
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Descreva aqui o seu problema ou sugestão..."
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 h-32 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            required
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Está satisfeito com a associação?</label>
          <div className="flex gap-4">
            <button 
              type="button"
              onClick={() => setFormData({...formData, satisfied: true})}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${formData.satisfied ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
            >
              <ThumbsUp size={18} /> Sim
            </button>
            <button 
              type="button"
              onClick={() => setFormData({...formData, satisfied: false})}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${!formData.satisfied ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
            >
              <ThumbsDown size={18} /> Não
            </button>
          </div>
        </div>

        <Button variant="primary" type="submit">Enviar Reclamação</Button>
      </form>
    </Card>
  );
}

function MembersTab({ associationId }: { associationId: number }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [formData, setFormData] = useState({ name: "", grade: "", course: "" });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    const res = await fetch(`/api/associations/${associationId}/members`);
    setMembers(await res.json());
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const url = editingId ? `/api/members/${editingId}` : `/api/associations/${associationId}/members`;
    const method = editingId ? "PUT" : "POST";
    
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    setFormData({ name: "", grade: "", course: "" });
    setEditingId(null);
    fetchMembers();
  };

  const handleEdit = (m: Member) => {
    setEditingId(m.id);
    setFormData({ name: m.name, grade: m.grade, course: m.course || "" });
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este membro?")) {
      await fetch(`/api/members/${id}`, { method: "DELETE" });
      fetchMembers();
    }
  };

  const grades = ["7ª", "8ª", "9ª", "10ª", "11ª", "12ª", "13ª"];
  const needsCourse = ["10ª", "11ª", "12ª", "13ª"].includes(formData.grade);

  return (
    <div className="space-y-8">
      <Card title={editingId ? "Editar Membro" : "Cadastrar Novo Membro"} icon={editingId ? Edit2 : UserPlus}>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <Input label="Nome Completo" value={formData.name} onChange={(v: any) => setFormData({...formData, name: v})} required />
          <Select label="Classe" value={formData.grade} onChange={(v: any) => setFormData({...formData, grade: v})} options={grades} required />
          {needsCourse && <Input label="Curso" value={formData.course} onChange={(v: any) => setFormData({...formData, course: v})} required />}
          <div className="flex gap-2 sm:col-start-3">
            <Button variant="primary" type="submit" className="flex-1">{editingId ? "Salvar" : "Cadastrar"}</Button>
            {editingId && <Button variant="outline" onClick={() => { setEditingId(null); setFormData({ name: "", grade: "", course: "" }); }}>Cancelar</Button>}
          </div>
        </form>
      </Card>

      <Card title="Lista de Membros" icon={Users}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="pb-4 font-bold text-xs uppercase tracking-wider text-zinc-500">Nome</th>
                <th className="pb-4 font-bold text-xs uppercase tracking-wider text-zinc-500">Classe</th>
                <th className="pb-4 font-bold text-xs uppercase tracking-wider text-zinc-500">Curso</th>
                <th className="pb-4 font-bold text-xs uppercase tracking-wider text-zinc-500 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {members.map((m) => (
                <tr key={m.id} className="group">
                  <td className="py-4 text-zinc-200">{m.name}</td>
                  <td className="py-4 text-zinc-400">{m.grade} Classe</td>
                  <td className="py-4 text-zinc-400">{m.course || "-"}</td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(m)} className="p-2 text-zinc-500 hover:text-emerald-500 transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(m.id)} className="p-2 text-zinc-500 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {members.length === 0 && <p className="text-center py-8 text-zinc-500">Nenhum membro cadastrado.</p>}
        </div>
      </Card>
    </div>
  );
}

function DepartmentsTab({ associationId }: { associationId: number }) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [formData, setFormData] = useState({ name: "", coordinator_id: "", deputy_id: "", secretary_id: "", other_members: "" });

  useEffect(() => { 
    fetchDepartments();
    fetchMembers();
  }, []);

  const fetchDepartments = async () => {
    const res = await fetch(`/api/associations/${associationId}/departments`);
    setDepartments(await res.json());
  };

  const fetchMembers = async () => {
    const res = await fetch(`/api/associations/${associationId}/members`);
    setMembers(await res.json());
  };

  const handleAdd = async (e: any) => {
    e.preventDefault();
    await fetch(`/api/associations/${associationId}/departments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    setFormData({ name: "", coordinator_id: "", deputy_id: "", secretary_id: "", other_members: "" });
    fetchDepartments();
  };

  return (
    <div className="space-y-8">
      <Card title="Criar Departamento" icon={Briefcase}>
        <form onSubmit={handleAdd} className="flex flex-col gap-6">
          <Input label="Nome do Departamento" value={formData.name} onChange={(v: any) => setFormData({...formData, name: v})} required />
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select 
              label="Coordenador" 
              value={formData.coordinator_id} 
              onChange={(v: any) => setFormData({...formData, coordinator_id: v})} 
              options={members.map(m => m.name)} 
              placeholder="Escolha um membro..."
            />
            <Select 
              label="Adjunto" 
              value={formData.deputy_id} 
              onChange={(v: any) => setFormData({...formData, deputy_id: v})} 
              options={members.map(m => m.name)} 
              placeholder="Escolha um membro..."
            />
            <Select 
              label="Secretário" 
              value={formData.secretary_id} 
              onChange={(v: any) => setFormData({...formData, secretary_id: v})} 
              options={members.map(m => m.name)} 
              placeholder="Escolha um membro..."
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Outros Membros</label>
            <textarea 
              value={formData.other_members} 
              onChange={(e) => setFormData({...formData, other_members: e.target.value})}
              placeholder="Nomes separados por vírgula..."
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 h-24 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <Button variant="primary" type="submit">Criar Departamento</Button>
        </form>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {departments.map((dept) => (
          <Card key={dept.id} title={dept.name} icon={Briefcase}>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-500">Coordenador:</span>
                <span className="text-zinc-200">{dept.coordinator_id || "Não definido"}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-500">Adjunto:</span>
                <span className="text-zinc-200">{dept.deputy_id || "Não definido"}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-500">Secretário:</span>
                <span className="text-zinc-200">{dept.secretary_id || "Não definido"}</span>
              </div>
              <div>
                <span className="text-zinc-500 block mb-1">Equipa:</span>
                <p className="text-zinc-400 text-xs leading-relaxed">{dept.other_members || "Apenas direção do departamento."}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function LeadershipTab({ associationId }: { associationId: number }) {
  const [leadership, setLeadership] = useState<Leadership[]>([]);
  const [formData, setFormData] = useState({ role: "", name: "", grade: "", course: "", photo: "" });

  useEffect(() => { fetchLeadership(); }, []);

  const fetchLeadership = async () => {
    const res = await fetch(`/api/associations/${associationId}/leadership`);
    setLeadership(await res.json());
  };

  const handlePhotoChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, photo: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = async (e: any) => {
    e.preventDefault();
    await fetch(`/api/associations/${associationId}/leadership`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    setFormData({ role: "", name: "", grade: "", course: "", photo: "" });
    fetchLeadership();
  };

  const roles = ["Presidente", "Vice-Presidente", "Secretário Geral", "Tesoureiro"];
  const grades = ["7ª", "8ª", "9ª", "10ª", "11ª", "12ª", "13ª"];

  return (
    <div className="space-y-8">
      <Card title="Cadastrar Membro da Direção" icon={UserCheck}>
        <form onSubmit={handleAdd} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Cargo" value={formData.role} onChange={(v: any) => setFormData({...formData, role: v})} options={roles} required />
            <Input label="Nome Completo" value={formData.name} onChange={(v: any) => setFormData({...formData, name: v})} required />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Classe" value={formData.grade} onChange={(v: any) => setFormData({...formData, grade: v})} options={grades} required />
            <Input label="Curso" value={formData.course} onChange={(v: any) => setFormData({...formData, course: v})} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Foto</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex items-center justify-center">
                {formData.photo ? <img src={formData.photo} className="w-full h-full object-cover" /> : <Camera className="text-zinc-700" />}
              </div>
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/10 file:text-emerald-500 hover:file:bg-emerald-500/20" />
            </div>
          </div>

          <Button variant="primary" type="submit">Cadastrar Direção</Button>
        </form>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {leadership.map((leader) => (
          <div key={leader.id} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl flex gap-6 items-center">
            <div className="w-24 h-24 rounded-2xl bg-zinc-800 overflow-hidden flex-shrink-0 shadow-xl">
              {leader.photo ? <img src={leader.photo} className="w-full h-full object-cover" /> : <Users className="w-full h-full p-6 text-zinc-600" />}
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">{leader.role}</div>
              <div className="text-xl font-bold text-white mb-1">{leader.name}</div>
              <div className="text-sm text-zinc-400">{leader.grade}ª Classe {leader.course && `| ${leader.course}`}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventsTab({ associationId }: { associationId: number }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [formData, setFormData] = useState({ description: "", photo: "", date: "", time: "", location: "" });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    const res = await fetch(`/api/associations/${associationId}/events`);
    setEvents(await res.json());
  };

  const handlePhotoChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, photo: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const url = editingId ? `/api/events/${editingId}` : `/api/associations/${associationId}/events`;
    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    setFormData({ description: "", photo: "", date: "", time: "", location: "" });
    setEditingId(null);
    fetchEvents();
  };

  const handleEdit = (ev: Event) => {
    setEditingId(ev.id);
    setFormData({ 
      description: ev.description, 
      photo: ev.photo || "", 
      date: ev.date, 
      time: ev.time, 
      location: ev.location 
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este evento?")) {
      await fetch(`/api/events/${id}`, { method: "DELETE" });
      fetchEvents();
    }
  };

  return (
    <div className="space-y-8">
      <Card title={editingId ? "Editar Evento" : "Adicionar Evento"} icon={editingId ? Edit2 : Calendar}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input label="Descrição do Evento" value={formData.description} onChange={(v: any) => setFormData({...formData, description: v})} placeholder="Ex: Torneio Inter-Escolar de Futebol" required />
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Data" type="date" value={formData.date} onChange={(v: any) => setFormData({...formData, date: v})} required />
            <Input label="Hora" type="time" value={formData.time} onChange={(v: any) => setFormData({...formData, time: v})} required />
            <Input label="Local" value={formData.location} onChange={(v: any) => setFormData({...formData, location: v})} placeholder="Ex: Pátio da Escola" required />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Cartaz / Foto</label>
            <input type="file" accept="image/*" onChange={handlePhotoChange} className="text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/10 file:text-emerald-500 hover:file:bg-emerald-500/20" />
            {formData.photo && <img src={formData.photo} className="mt-4 w-full max-h-48 object-contain rounded-xl bg-zinc-900 p-2" />}
          </div>

          <div className="flex gap-2">
            <Button variant="primary" type="submit" className="flex-1">{editingId ? "Salvar Alterações" : "Publicar Evento"}</Button>
            {editingId && <Button variant="outline" onClick={() => { setEditingId(null); setFormData({ description: "", photo: "", date: "", time: "", location: "" }); }}>Cancelar</Button>}
          </div>
        </form>
      </Card>

      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl flex flex-col sm:flex-row gap-6 relative group">
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(event)} className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-emerald-500 transition-colors">
                <Edit2 size={16} />
              </button>
              <button onClick={() => handleDelete(event.id)} className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-red-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
            {event.photo && (
              <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                <img src={event.photo} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-4 text-xs font-bold text-emerald-500 uppercase mb-2">
                <span>{event.date}</span>
                <span>{event.time}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{event.description}</h3>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <MapPin size={14} /> {event.location}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryTab({ associationId }: { associationId: number }) {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [formData, setFormData] = useState({ description: "", photo: "" });

  useEffect(() => { fetchGallery(); }, []);

  const fetchGallery = async () => {
    const res = await fetch(`/api/associations/${associationId}/gallery`);
    setGallery(await res.json());
  };

  const handlePhotoChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, photo: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = async (e: any) => {
    e.preventDefault();
    await fetch(`/api/associations/${associationId}/gallery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    setFormData({ description: "", photo: "" });
    fetchGallery();
  };

  return (
    <div className="space-y-8">
      <Card title="Adicionar à Galeria" icon={ImageIcon}>
        <form onSubmit={handleAdd} className="flex flex-col gap-6">
          <Input label="Descrição da Foto" value={formData.description} onChange={(v: any) => setFormData({...formData, description: v})} required />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Foto</label>
            <input type="file" accept="image/*" onChange={handlePhotoChange} required className="text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/10 file:text-emerald-500 hover:file:bg-emerald-500/20" />
          </div>
          <Button variant="primary" type="submit">Adicionar Foto</Button>
        </form>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {gallery.map((item) => (
          <div key={item.id} className="aspect-square rounded-2xl overflow-hidden bg-zinc-800 group relative">
            <img src={item.photo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
              <p className="text-xs text-white line-clamp-2 mb-1">{item.description}</p>
              <span className="text-[10px] text-zinc-400">{new Date(item.created_at || "").toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab({ association, onUpdate }: { association: Association, onUpdate: () => void }) {
  const [assocData, setAssocData] = useState(association);
  const [docs, setDocs] = useState<any>({});
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    const res = await fetch(`/api/associations/${association.id}/settings`);
    const data = await res.json();
    setDocs(data.docs || {});
  };

  const handleUpdateAssoc = async () => {
    await fetch(`/api/associations/${association.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assocData)
    });
    onUpdate();
    alert("Dados da associação atualizados!");
  };

  const handleUpdateDocs = async (field: string, value: string) => {
    await fetch(`/api/associations/${association.id}/settings/docs`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value })
    });
    fetchSettings();
  };

  const handleFileUpload = (field: string) => (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => handleUpdateDocs(field, reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword) return;
    await fetch(`/api/associations/${association.id}/settings/password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword })
    });
    setNewPassword("");
    alert("Senha atualizada com sucesso!");
  };

  const handleDelete = async () => {
    if (confirm("Tem certeza que deseja eliminar esta associação? Todos os dados serão perdidos permanentemente.")) {
      await fetch(`/api/associations/${association.id}`, { method: "DELETE" });
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8">
      {/* Edit Association */}
      <Card title="Editar Associação" icon={Edit}>
        <div className="flex flex-col gap-6">
          <Input label="Nome da Associação" value={assocData.name} onChange={(v: any) => setAssocData({...assocData, name: v})} />
          <Input label="Nome da Instituição" value={assocData.school} onChange={(v: any) => setAssocData({...assocData, school: v})} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Província" value={assocData.province} onChange={(v: any) => setAssocData({...assocData, province: v})} options={Object.keys(ANGOLA_GEOGRAPHY)} />
            <Select label="Município" value={assocData.municipality} onChange={(v: any) => setAssocData({...assocData, municipality: v})} options={assocData.province ? ANGOLA_GEOGRAPHY[assocData.province] : []} />
          </div>
          <Input label="Bairro" value={assocData.neighborhood} onChange={(v: any) => setAssocData({...assocData, neighborhood: v})} />
          <Button variant="primary" icon={Save} onClick={handleUpdateAssoc}>Salvar Alterações</Button>
        </div>
      </Card>

      {/* Documents */}
      <Card title="Documentos e Logos" icon={Settings}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Logos</h4>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex items-center justify-center">
                {docs.school_logo ? <img src={docs.school_logo} className="w-full h-full object-cover" /> : <School className="text-zinc-700" />}
              </div>
              <div className="flex-1">
                <label className="text-xs text-zinc-400 block mb-1">Logo da Escola</label>
                <input type="file" accept="image/*" onChange={handleFileUpload("school_logo")} className="text-xs text-zinc-500" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex items-center justify-center">
                {docs.association_logo ? <img src={docs.association_logo} className="w-full h-full object-cover" /> : <Users className="text-zinc-700" />}
              </div>
              <div className="flex-1">
                <label className="text-xs text-zinc-400 block mb-1">Logo da Associação</label>
                <input type="file" accept="image/*" onChange={handleFileUpload("association_logo")} className="text-xs text-zinc-500" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Documentos Oficiais</h4>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Estatuto (Link ou Imagem)</label>
                <input type="file" accept="image/*,application/pdf" onChange={handleFileUpload("statute")} className="text-xs text-zinc-500" />
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Termo de Responsabilidade</label>
                <input type="file" accept="image/*,application/pdf" onChange={handleFileUpload("terms")} className="text-xs text-zinc-500" />
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Contrato de Adesão</label>
                <input type="file" accept="image/*,application/pdf" onChange={handleFileUpload("contract")} className="text-xs text-zinc-500" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Security & Danger Zone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card title="Alterar Senha" icon={Settings}>
          <div className="flex flex-col gap-4">
            <Input label="Nova Senha" type="password" value={newPassword} onChange={setNewPassword} />
            <Button variant="secondary" onClick={handleUpdatePassword}>Atualizar Senha</Button>
          </div>
        </Card>
        <Card title="Zona de Perigo" icon={Trash2} className="border-red-900/50 bg-red-950/10">
          <p className="text-sm text-zinc-500 mb-6">Eliminar a associação apagará todos os membros, departamentos e eventos permanentemente.</p>
          <Button variant="danger" icon={Trash2} onClick={handleDelete} className="w-full">Eliminar Associação</Button>
        </Card>
      </div>
    </div>
  );
}
