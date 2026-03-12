'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

// ── Constants ───────────────────────────────────────────────────────────────
const VEN_CITIES = [
    "Caracas", "Maracaibo", "Valencia", "Barquisimeto", "Maracay",
    "Ciudad Guayana", "San Cristóbal", "Maturín", "Barcelona", "Puerto Cruz",
    "Mérida", "Cumaná", "Barinas", "Los Teques", "San Antonio", "Lechería"
];
const PAYMENT_OPTIONS = ["Ca$h", "Pago móvil", "Transferencia", "Zelle", "Criptomonedas", "PayPal", "Zinli"];
const SERVICE_STYLES = ["Trato de Novia", "Cita Social", "Masajes Relajantes", "Fetichismo", "BDSM Suave", "Cosplay", "Dueto", "Cam Session"];
const TARGET_AUDIENCE = ["Hombres", "Mujeres", "Parejas", "Todos"];
const DAYS = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];
const EYE_COLORS = ["Café", "Negros", "Verdes", "Azules", "Grises", "Miel", "Avellana"];

const DEFAULT_STATS = [
    { label: "Encanto", value: 95, color: "#ff2d75" },
    { label: "Estilo", value: 98, color: "#00f3ff" },
    { label: "Energía", value: 92, color: "#fff300" },
    { label: "Misterio", value: 88, color: "#bd00ff" },
];

// ── Types ────────────────────────────────────────────────────────────────────
type FormData = {
    performerName: string;
    tagline: string;
    bio: string;
    metaDescription: string;
    contactEmail: string;
    profileImages: string[];
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    height: string;
    eyeColor: string;
    weight: string;
    locations: string[];
    stats: { label: string; value: number; color: string }[];
    schedule: { is24h: boolean; from: string; to: string; workingDays: string[] };
    pricing: { h1: number; h2: number; night: number; customLabel: string; customPrice: number };
    vesRate: number;
    taxiIncluded: boolean;
    paymentMethods: string[];
    services: string[];
    targetAudience: string[];
    activePromo: { label: string; description: string; isActive: boolean };
    personalMessage: string;
    socialLinks: { instagram: string; twitter: string; onlyfans: string; tiktok: string };
};

const EMPTY_FORM: FormData = {
    performerName: "", tagline: "", bio: "", metaDescription: "", contactEmail: "",
    profileImages: ["", ""],
    primaryColor: "#be2e57", secondaryColor: "#9fd7fb", backgroundColor: "#312a30",
    height: "1.68m", eyeColor: "Café", weight: "55kg",
    locations: ["Caracas"],
    stats: DEFAULT_STATS,
    schedule: { is24h: true, from: "09:00", to: "23:00", workingDays: [...DAYS] },
    pricing: { h1: 100, h2: 180, night: 500, customLabel: "", customPrice: 0 },
    vesRate: 40, taxiIncluded: false,
    paymentMethods: ["Ca$h"], services: ["Trato de Novia"],
    targetAudience: ["Hombres"],
    activePromo: { label: "", description: "", isActive: false },
    personalMessage: "",
    socialLinks: { instagram: "", twitter: "", onlyfans: "", tiktok: "" },
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function toggleInArray(arr: string[], val: string): string[] {
    return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
}

// ── Section Wrapper ──────────────────────────────────────────────────────────
function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
    return (
        <div className="bg-white/[0.02] border border-white/5 rounded-lg p-6 space-y-5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-2 border-b border-white/5 pb-3">
                <span>{icon}</span> {title}
            </h3>
            {children}
        </div>
    );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
    return <label className="text-[8px] font-black uppercase tracking-widest text-white/30 block mb-1">{children}</label>;
}

function Input({ value, onChange, placeholder, type = "text" }: { value: string | number; onChange: (v: string) => void; placeholder?: string; type?: string }) {
    return (
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-[var(--color-neon-cyan)] outline-none p-2.5 rounded text-white text-xs font-mono transition-colors"
        />
    );
}

function Textarea({ value, onChange, rows = 3 }: { value: string; onChange: (v: string) => void; rows?: number }) {
    return (
        <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            rows={rows}
            className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-[var(--color-neon-cyan)] outline-none p-2.5 rounded text-white text-xs font-mono resize-none transition-colors"
        />
    );
}

function TagToggle({ options, selected, onChange }: { options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map(opt => (
                <button
                    key={opt}
                    type="button"
                    onClick={() => onChange(toggleInArray(selected, opt))}
                    className={`text-[9px] font-black uppercase px-2.5 py-1 rounded transition-all border ${selected.includes(opt)
                        ? 'bg-[var(--color-neon-cyan)]/10 border-[var(--color-neon-cyan)] text-[var(--color-neon-cyan)]'
                        : 'bg-white/5 border-white/10 text-white/30 hover:border-white/30'
                        }`}
                >{opt}</button>
            ))}
        </div>
    );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function AdminConfig() {
    const config = useQuery(api.siteConfig.get, { slug: 'default-tenant' }); // Temporal
    const updateConfig = useMutation(api.siteConfig.update);
    const resetConfig = useMutation(api.siteConfig.resetToDefaults);

    const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [activeTab, setActiveTab] = useState<'identidad' | 'visual' | 'servicio' | 'horario' | 'marketing'>('identidad');

    useEffect(() => {
        if (config) {
            setFormData({
                performerName: config.performerName || "",
                tagline: config.tagline || "",
                bio: config.bio || "",
                metaDescription: config.metaDescription || "",
                contactEmail: config.contactEmail || "",
                profileImages: config.profileImages?.length >= 2
                    ? config.profileImages
                    : [...(config.profileImages || []), "", ""].slice(0, 2),
                primaryColor: config.primaryColor || "#ff2d75",
                secondaryColor: config.secondaryColor || "#00f3ff",
                backgroundColor: (config as any).backgroundColor || "#0d0d12",
                height: (config as any).height || "1.68m",
                eyeColor: (config as any).eyeColor || "Café",
                weight: config.weight || "55kg",
                locations: config.locations || ["Caracas"],
                stats: (config as any).stats || DEFAULT_STATS,
                schedule: config.schedule
                    ? { is24h: config.schedule.is24h, from: config.schedule.from || "09:00", to: config.schedule.to || "23:00", workingDays: config.schedule.workingDays || [...DAYS] }
                    : { is24h: true, from: "09:00", to: "23:00", workingDays: [...DAYS] },
                pricing: config.pricing
                    ? { h1: config.pricing.h1, h2: config.pricing.h2 || 0, night: config.pricing.night || 0, customLabel: config.pricing.customLabel || "", customPrice: config.pricing.customPrice || 0 }
                    : { h1: 100, h2: 180, night: 500, customLabel: "", customPrice: 0 },
                vesRate: config.vesRate || 40,
                taxiIncluded: config.taxiIncluded ?? false,
                paymentMethods: config.paymentMethods || ["Ca$h"],
                services: config.services || ["Trato de Novia"],
                targetAudience: config.targetAudience || ["Hombres"],
                activePromo: config.activePromo || { label: "", description: "", isActive: false },
                personalMessage: config.personalMessage || "",
                socialLinks: {
                    instagram: config.socialLinks?.instagram || "",
                    twitter: config.socialLinks?.twitter || "",
                    onlyfans: config.socialLinks?.onlyfans || "",
                    tiktok: config.socialLinks?.tiktok || "",
                },
            });
        }
    }, [config]);

    const set = (key: keyof FormData, val: any) => setFormData(prev => ({ ...prev, [key]: val }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateConfig({
                tenantId: 'default-tenant' as any, // Temporal hasta que tengamos el tenantId real
                ...formData,
                schedule: {
                    is24h: formData.schedule.is24h,
                    from: formData.schedule.from || undefined,
                    to: formData.schedule.to || undefined,
                    workingDays: formData.schedule.workingDays,
                },
                pricing: {
                    h1: Number(formData.pricing.h1),
                    h2: Number(formData.pricing.h2) || undefined,
                    night: Number(formData.pricing.night) || undefined,
                    customLabel: formData.pricing.customLabel || undefined,
                    customPrice: Number(formData.pricing.customPrice) || undefined,
                },
                profileImages: formData.profileImages.filter(Boolean),
                vesRate: Number(formData.vesRate),
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } finally {
            setSaving(false);
        }
    };

    const TABS = [
        { id: 'identidad', label: 'Identidad', icon: '👤' },
        { id: 'visual', label: 'Visual', icon: '🎨' },
        { id: 'servicio', label: 'Servicios', icon: '💼' },
        { id: 'horario', label: 'Horario', icon: '🕐' },
        { id: 'marketing', label: 'Marketing', icon: '📣' },
    ] as const;

    if (!config && config !== null) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-white/30 text-xs font-mono animate-pulse">CARGANDO CONFIGURACIÓN...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-white">Dashboard <span className="text-[var(--color-neon-cyan)]">Config</span></h1>
                    <p className="text-[9px] font-mono text-white/30 mt-1">Sistema Camaleónico · Tiempo Real · Multi-Template</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => resetConfig({ tenantId: 'default-tenant' as any })}
                        className="text-[8px] font-black uppercase px-3 py-1.5 border border-red-500/30 text-red-500/50 hover:border-red-500/60 hover:text-red-500 transition-all rounded"
                    >
                        ↺ Reset
                    </button>
                    {saved && (
                        <span className="text-[9px] font-black text-[var(--color-neon-cyan)] animate-pulse">✓ Guardado</span>
                    )}
                </div>
            </div>

            {/* Preview Bar */}
            <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3 flex items-center gap-4 text-[9px] font-mono">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: formData.primaryColor }} />
                <span className="text-white/30">PREVIEW LIVE:</span>
                <span className="text-white/60 font-black uppercase">{formData.performerName || 'Performer Name'}</span>
                <span className="text-white/20">·</span>
                <span className="text-white/40">{formData.tagline || 'Official Site'}</span>
                <div className="ml-auto flex gap-2">
                    <div className="w-4 h-4 rounded border border-white/10" style={{ backgroundColor: formData.primaryColor }} />
                    <div className="w-4 h-4 rounded border border-white/10" style={{ backgroundColor: formData.secondaryColor }} />
                    <div className="w-4 h-4 rounded border border-white/10" style={{ backgroundColor: formData.backgroundColor }} />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-white/5 pb-0">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`text-[9px] font-black uppercase tracking-widest px-4 py-2.5 border-b-2 transition-all -mb-px ${activeTab === tab.id
                            ? 'border-[var(--color-neon-cyan)] text-[var(--color-neon-cyan)]'
                            : 'border-transparent text-white/30 hover:text-white/60'
                            }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* ── TAB: IDENTIDAD ─────────────────────────────────── */}
                {activeTab === 'identidad' && (
                    <div className="space-y-5">
                        <Section title="Perfil Principal" icon="👤">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <FieldLabel>Nombre del Performer</FieldLabel>
                                    <Input value={formData.performerName} onChange={v => set('performerName', v)} placeholder="Nombre Profesional (EJ: Zynch User)" />
                                </div>
                                <div>
                                    <FieldLabel>Tagline / Lema</FieldLabel>
                                    <Input value={formData.tagline} onChange={v => set('tagline', v)} placeholder="Official Site" />
                                </div>
                                <div>
                                    <FieldLabel>Email de contacto</FieldLabel>
                                    <Input value={formData.contactEmail} onChange={v => set('contactEmail', v)} placeholder="contact@domain.fun" type="email" />
                                </div>
                                <div>
                                    <FieldLabel>Mensaje Personal</FieldLabel>
                                    <Input value={formData.personalMessage} onChange={v => set('personalMessage', v)} placeholder="¡Contáctame!" />
                                </div>
                            </div>
                            <div>
                                <FieldLabel>Bio / Descripción</FieldLabel>
                                <Textarea value={formData.bio} onChange={v => set('bio', v)} rows={3} />
                            </div>
                            <div>
                                <FieldLabel>Meta Descripción (SEO)</FieldLabel>
                                <Textarea value={formData.metaDescription} onChange={v => set('metaDescription', v)} rows={2} />
                            </div>
                        </Section>

                        <Section title="Datos Físicos" icon="📏">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <FieldLabel>Estatura</FieldLabel>
                                    <Input value={formData.height} onChange={v => set('height', v)} placeholder="1.68m" />
                                </div>
                                <div>
                                    <FieldLabel>Peso</FieldLabel>
                                    <Input value={formData.weight} onChange={v => set('weight', v)} placeholder="55kg" />
                                </div>
                                <div className="col-span-2">
                                    <FieldLabel>Color de Ojos</FieldLabel>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {EYE_COLORS.map(color => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => set('eyeColor', color)}
                                                className={`text-[9px] font-black uppercase px-2.5 py-1 rounded transition-all border ${formData.eyeColor === color
                                                    ? 'bg-[var(--color-neon-cyan)]/10 border-[var(--color-neon-cyan)] text-[var(--color-neon-cyan)]'
                                                    : 'bg-white/5 border-white/10 text-white/30 hover:border-white/30'
                                                    }`}
                                            >{color}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Section>

                        <Section title="Fotos de Perfil (Carrusel)" icon="🖼️">
                            <div className="grid md:grid-cols-2 gap-5">
                                {[0, 1].map(i => (
                                    <div key={i} className="space-y-2">
                                        <FieldLabel>Foto #{i + 1} — URL</FieldLabel>
                                        <Input
                                            value={formData.profileImages[i] || ""}
                                            onChange={v => {
                                                const imgs = [...formData.profileImages];
                                                imgs[i] = v;
                                                set('profileImages', imgs);
                                            }}
                                            placeholder="https://..."
                                        />
                                        {formData.profileImages[i] && (
                                            <div className="aspect-[4/5] rounded overflow-hidden border border-white/10 max-h-40">
                                                <img src={formData.profileImages[i]} className="w-full h-full object-cover" alt={`Preview ${i + 1}`} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Section>

                        <Section title="Redes Sociales" icon="🔗">
                            <div className="grid md:grid-cols-2 gap-4">
                                {(['instagram', 'onlyfans', 'tiktok', 'twitter'] as const).map(net => (
                                    <div key={net}>
                                        <FieldLabel>{net.charAt(0).toUpperCase() + net.slice(1)}</FieldLabel>
                                        <Input
                                            value={formData.socialLinks[net]}
                                            onChange={v => set('socialLinks', { ...formData.socialLinks, [net]: v })}
                                            placeholder={`https://${net}.com/...`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </Section>

                        <Section title="Ciudades de Servicio" icon="📍">
                            <TagToggle options={VEN_CITIES} selected={formData.locations} onChange={v => set('locations', v)} />
                        </Section>
                    </div>
                )}

                {/* ── TAB: VISUAL ────────────────────────────────────── */}
                {activeTab === 'visual' && (
                    <div className="space-y-5">
                        <Section title="Paleta de Colores del Sitio" icon="🎨">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {([
                                    { key: 'primaryColor', label: 'Color Primario', hint: 'Neon Pink' },
                                    { key: 'secondaryColor', label: 'Color Secundario', hint: 'Neon Cyan' },
                                    { key: 'backgroundColor', label: 'Color de Fondo', hint: 'Dark Background' },
                                ] as const).map(({ key, label, hint }) => (
                                    <div key={key} className="space-y-3">
                                        <FieldLabel>{label}</FieldLabel>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="color"
                                                value={formData[key]}
                                                onChange={e => set(key, e.target.value)}
                                                className="w-12 h-10 rounded border border-white/10 cursor-pointer bg-transparent"
                                            />
                                            <Input value={formData[key]} onChange={v => set(key, v)} placeholder="#000000" />
                                        </div>
                                        <div className="w-full h-6 rounded flex items-center justify-center text-[8px] font-black uppercase tracking-widest" style={{ backgroundColor: formData[key] }}>
                                            {hint}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 rounded border border-white/5 space-y-2 mt-2">
                                <p className="text-[8px] font-black uppercase tracking-widest text-white/20">Preview de Paleta</p>
                                <div className="flex gap-3 items-center">
                                    <div className="font-black text-sm uppercase italic" style={{ color: formData.primaryColor }}>
                                        {formData.performerName || 'Performer'}
                                    </div>
                                    <div className="text-[9px] font-black uppercase px-2 py-0.5" style={{ backgroundColor: formData.secondaryColor, color: formData.backgroundColor }}>
                                        Activa Ahora
                                    </div>
                                    <div className="text-[9px] text-white/40 font-mono">{formData.tagline}</div>
                                </div>
                            </div>
                        </Section>

                        <Section title="Stats Bars — Barras de Performance" icon="📊">
                            <p className="text-[8px] text-white/30 font-mono mb-3">Aparecen en la página de perfil. Editá el nombre, valor (0-100) y color de cada barra.</p>
                            <div className="space-y-4">
                                {formData.stats.map((stat, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-white/[0.02] border border-white/5 p-3 rounded">
                                        <Input
                                            value={stat.label}
                                            onChange={v => {
                                                const s = [...formData.stats];
                                                s[i] = { ...s[i], label: v };
                                                set('stats', s);
                                            }}
                                            placeholder="Encanto"
                                        />
                                        <input
                                            type="number"
                                            min={0} max={100}
                                            value={stat.value}
                                            onChange={e => {
                                                const s = [...formData.stats];
                                                s[i] = { ...s[i], value: Number(e.target.value) };
                                                set('stats', s);
                                            }}
                                            className="w-16 bg-white/5 border border-white/10 p-2.5 rounded text-white text-xs font-mono text-center"
                                        />
                                        <input
                                            type="color"
                                            value={stat.color}
                                            onChange={e => {
                                                const s = [...formData.stats];
                                                s[i] = { ...s[i], color: e.target.value };
                                                set('stats', s);
                                            }}
                                            className="w-10 h-9 rounded border border-white/10 cursor-pointer bg-transparent flex-shrink-0"
                                        />
                                        <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full" style={{ width: `${stat.value}%`, backgroundColor: stat.color }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    </div>
                )}

                {/* ── TAB: SERVICIOS ─────────────────────────────────── */}
                {activeTab === 'servicio' && (
                    <div className="space-y-5">
                        <Section title="Tarifas (USD)" icon="💵">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {([
                                    { key: 'h1', label: '1 Hora' },
                                    { key: 'h2', label: '2 Horas' },
                                    { key: 'night', label: 'Noche' },
                                    { key: 'customPrice', label: 'Extra' },
                                ] as const).map(({ key, label }) => (
                                    <div key={key}>
                                        <FieldLabel>{label} (USD)</FieldLabel>
                                        <Input
                                            type="number"
                                            value={formData.pricing[key] || ''}
                                            onChange={v => set('pricing', { ...formData.pricing, [key]: v })}
                                            placeholder="0"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 pt-2 border-t border-white/5">
                                <div>
                                    <FieldLabel>Label del Servicio Extra</FieldLabel>
                                    <Input value={formData.pricing.customLabel} onChange={v => set('pricing', { ...formData.pricing, customLabel: v })} placeholder="Cam Session, Trío..." />
                                </div>
                                <div>
                                    <FieldLabel>Tasa de Cambio (Bs/USD)</FieldLabel>
                                    <Input type="number" value={formData.vesRate} onChange={v => set('vesRate', v)} placeholder="40" />
                                </div>
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => set('taxiIncluded', !formData.taxiIncluded)}
                                    className={`relative w-10 h-5 rounded-full transition-colors ${formData.taxiIncluded ? 'bg-green-500' : 'bg-white/10'}`}
                                >
                                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${formData.taxiIncluded ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                </button>
                                <span className="text-[9px] font-black uppercase text-white/40">
                                    Traslado / Taxi {formData.taxiIncluded ? <span className="text-green-400">INCLUIDO</span> : <span className="text-red-400/50">NO INCLUIDO</span>}
                                </span>
                            </div>
                        </Section>

                        <Section title="Estilos & Servicios Ofrecidos" icon="✨">
                            <TagToggle options={SERVICE_STYLES} selected={formData.services} onChange={v => set('services', v)} />
                        </Section>

                        <Section title="Público Objetivo" icon="🎯">
                            <TagToggle options={TARGET_AUDIENCE} selected={formData.targetAudience} onChange={v => set('targetAudience', v)} />
                        </Section>

                        <Section title="Métodos de Pago" icon="💳">
                            <TagToggle options={PAYMENT_OPTIONS} selected={formData.paymentMethods} onChange={v => set('paymentMethods', v)} />
                        </Section>
                    </div>
                )}

                {/* ── TAB: HORARIO ───────────────────────────────────── */}
                {activeTab === 'horario' && (
                    <div className="space-y-5">
                        <Section title="Disponibilidad & Horario" icon="🕐">
                            <div className="flex items-center gap-4 mb-4">
                                <button
                                    type="button"
                                    onClick={() => set('schedule', { ...formData.schedule, is24h: !formData.schedule.is24h })}
                                    className={`relative w-10 h-5 rounded-full transition-colors ${formData.schedule.is24h ? 'bg-[var(--color-neon-cyan)]' : 'bg-white/10'}`}
                                >
                                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${formData.schedule.is24h ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                </button>
                                <span className="text-[9px] font-black uppercase text-white/40">
                                    Modo {formData.schedule.is24h ? <span className="text-[var(--color-neon-cyan)]">24 Horas / Full Time</span> : 'Horario Específico'}
                                </span>
                            </div>

                            {!formData.schedule.is24h && (
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <FieldLabel>Desde</FieldLabel>
                                        <Input type="time" value={formData.schedule.from} onChange={v => set('schedule', { ...formData.schedule, from: v })} />
                                    </div>
                                    <div>
                                        <FieldLabel>Hasta</FieldLabel>
                                        <Input type="time" value={formData.schedule.to} onChange={v => set('schedule', { ...formData.schedule, to: v })} />
                                    </div>
                                </div>
                            )}

                            <div>
                                <FieldLabel>Días de Trabajo</FieldLabel>
                                <div className="flex gap-2 mt-2">
                                    {DAYS.map(day => (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => set('schedule', { ...formData.schedule, workingDays: toggleInArray(formData.schedule.workingDays, day) })}
                                            className={`w-10 h-10 rounded text-[9px] font-black uppercase transition-all border ${formData.schedule.workingDays.includes(day)
                                                ? 'bg-[var(--color-neon-cyan)]/10 border-[var(--color-neon-cyan)] text-[var(--color-neon-cyan)]'
                                                : 'bg-white/5 border-white/10 text-white/30 hover:border-white/30'
                                                }`}
                                        >{day}</button>
                                    ))}
                                </div>
                            </div>
                        </Section>
                    </div>
                )}

                {/* ── TAB: MARKETING ─────────────────────────────────── */}
                {activeTab === 'marketing' && (
                    <div className="space-y-5">
                        <Section title="Promo Activa (Banner en Perfil)" icon="🔥">
                            <div className="flex items-center gap-4 mb-4">
                                <button
                                    type="button"
                                    onClick={() => set('activePromo', { ...formData.activePromo, isActive: !formData.activePromo.isActive })}
                                    className={`relative w-10 h-5 rounded-full transition-colors ${formData.activePromo.isActive ? 'bg-[var(--color-neon-pink)]' : 'bg-white/10'}`}
                                >
                                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${formData.activePromo.isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                </button>
                                <span className={`text-[9px] font-black uppercase ${formData.activePromo.isActive ? 'text-[var(--color-neon-pink)]' : 'text-white/30'}`}>
                                    Promo {formData.activePromo.isActive ? 'ACTIVA' : 'Desactivada'}
                                </span>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <FieldLabel>Título de la Promo</FieldLabel>
                                    <Input value={formData.activePromo.label} onChange={v => set('activePromo', { ...formData.activePromo, label: v })} placeholder="Oferta de Apertura" />
                                </div>
                                <div>
                                    <FieldLabel>Descripción</FieldLabel>
                                    <Textarea value={formData.activePromo.description} onChange={v => set('activePromo', { ...formData.activePromo, description: v })} />
                                </div>
                            </div>
                            {formData.activePromo.isActive && formData.activePromo.label && (
                                <div className="mt-3 bg-[var(--color-neon-pink)]/10 border border-[var(--color-neon-pink)]/30 p-3 relative">
                                    <div className="absolute top-0 right-0 bg-[var(--color-neon-pink)] text-black text-[7px] font-black px-2 py-0.5 uppercase">PROMO ACTIVA</div>
                                    <p className="text-[9px] font-black uppercase text-[var(--color-neon-pink)] mb-1">{formData.activePromo.label}</p>
                                    <p className="text-[8px] text-white/50">{formData.activePromo.description}</p>
                                </div>
                            )}
                        </Section>
                    </div>
                )}

                {/* ── Save Button ─────────────────────────────────────── */}
                <div className="sticky bottom-0 bg-[var(--color-dark-bg)] border-t border-white/5 pt-4 pb-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-4 font-black text-sm uppercase tracking-widest border border-[var(--color-neon-cyan)] text-[var(--color-neon-cyan)] hover:bg-[var(--color-neon-cyan)]/10 disabled:opacity-50 transition-all"
                    >
                        {saving ? '⏳ Guardando...' : saved ? '✓ Guardado Exitosamente' : '💾 Guardar Configuración'}
                    </button>
                </div>
            </form>
        </div>
    );
}
