
import { BarChart3, Building2, FileText, Clock, CreditCard, TrendingUp, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Layout } from "@/components/layout/Layout"
import { useClient } from "@/contexts/ClientContext"
import { useToast } from "@/hooks/use-toast"
import MetricCard from "@/components/dashboard/MetricCard"
import { ProgressCard } from "@/components/dashboard/ProgressCard"
import { ConsumptionChart } from "@/components/dashboard/ConsumptionChart"
import { formatLastUsage } from "@/data/mockData"

export default function Dashboard() {
  const { client, loading } = useClient();
  const { toast } = useToast();
  const clientColor = client?.color || "#4f46e5";
  // Helper for subtle backgrounds
  const cardBg = `${clientColor}20` // ~12% opacity
  const cardBorder = clientColor

  if (loading || !client) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" style={{ borderBottom: `2px solid ${clientColor}` }}></div>
        </div>
      </Layout>
    )
  }

  // --- Conteúdo da página de Início ---
  const usagePercentage = Math.round((client.credits.used / client.credits.total) * 100)

  const getAlertType = () => {
    if (client.type === "projeto") return "success"
    if (usagePercentage >= 100) return "blocked"
    if (usagePercentage >= 85) return "warning"
    return "success"
  }

  // --- Fim conteúdo da página de Início ---

  return (
    <Layout>
      <div className="min-h-screen" style={{ background: '#151518' }}>
        <div className="container mx-auto p-6 space-y-8">
          {/* --- Conteúdo da página de Início --- */}
          <div className="space-y-2">
            <h1
              className="text-3xl font-bold"
              style={{ color: client.color || '#3f3f46' }}
            >
              Início
            </h1>
            <p className="text-muted-foreground" style={{ color: '#d4d4d8' }}>
              Bem-vindo ao painel de controle do <span style={{ color: client.color || '#3f3f46' }}>{client.name}</span>
            </p>
          </div>

          {/* Consumo Mensal */}
          <div className="grid gap-6 md:grid-cols-1 mb-6">
            <div
              style={client.color ? {
                border: `1px solid ${client.color}22`,
                borderRadius: 12,
                background: `${client.color}10 !important`,
              } : {}}
            >
              <ProgressCard
                title="Consumo Mensal"
                current={client.credits.used}
                total={client.credits.total}
                variant={usagePercentage >= 100 ? "destructive" : usagePercentage >= 85 ? "warning" : "default"}
                showAlert={getAlertType() === "warning" || getAlertType() === "blocked"}
                alertType={getAlertType() as "warning" | "blocked"}
                cardColor={client.color ? `${client.color}10` : undefined}
                onUpgrade={() =>
                  toast({
                    title: "Upgrade solicitado",
                    description: "Em breve você será redirecionado para as opções de upgrade.",
                    style: client.color ? { background: client.color, color: '#fff' } : {},
                  })
                }
              />
            </div>
          </div>

          {/* Banner de acesso especial */}
          <div className="relative mb-8">
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <div className="backdrop-blur-md bg-black/40 rounded-xl w-full h-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-accent">
                <h2 className="text-2xl font-bold mb-2 text-white drop-shadow">Acesse métricas avançadas!</h2>
                <p className="mb-4 text-white/80">Assine o pacote especial para liberar todas as métricas e relatórios detalhados.</p>
                <Button style={{ background: client.color || '#4f46e5', color: '#fff', fontWeight: 600, fontSize: 18 }} className="px-8 py-3 hover:opacity-90 shadow-lg">
                  Solicitar acesso especial
                </Button>
              </div>
            </div>
            {/* Métricas e gráfico borrados */}
            <div className="pointer-events-none select-none" style={{ filter: 'blur(6px)', opacity: 0.7 }}>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <div
                  style={client.color ? {
                    border: `1px solid ${client.color}22`,
                    borderRadius: 12,
                    background: `${client.color}10 !important`,
                  } : {}}
                >
                  <MetricCard
                    title="Créditos Totais"
                    value={client.credits.total.toLocaleString('pt-BR')}
                    icon={<CreditCard />}
                    subtitle={client.type === "projeto" ? "Pré-pago" : "Limite mensal"}
                    variant="accent"
                    cardColor={client.color ? `${client.color}10` : undefined}
                  />
                </div>
                <div
                  style={client.color ? {
                    border: `1px solid ${client.color}22`,
                    borderRadius: 12,
                    background: `${client.color}10 !important`,
                  } : {}}
                >
                  <MetricCard
                    title="Créditos Consumidos"
                    value={client.credits.used.toLocaleString('pt-BR')}
                    subtitle={`${usagePercentage}% do total`}
                    icon={<TrendingUp />}
                    variant={usagePercentage >= 85 ? "warning" : "default"}
                    cardColor={client.color ? `${client.color}10` : undefined}
                  />
                </div>
                <div
                  style={client.color ? {
                    border: `1px solid ${client.color}22`,
                    borderRadius: 12,
                    background: `${client.color}10 !important`,
                  } : {}}
                >
                  <MetricCard
                    title="Créditos Restantes"
                    value={client.credits.remaining.toLocaleString('pt-BR')}
                    subtitle={client.type === "projeto" ? "Saldo atual" : "Até fim do mês"}
                    icon={<Users />}
                    variant={client.credits.remaining < 1000 ? "destructive" : "success"}
                    cardColor={client.color ? `${client.color}10` : undefined}
                  />
                </div>
                <div
                  style={client.color ? {
                    border: `1px solid ${client.color}22`,
                    borderRadius: 12,
                    background: `${client.color}10 !important`,
                  } : {}}
                >
                  <MetricCard
                    title="Último Uso"
                    value={formatLastUsage(client.lastUsage)}
                    subtitle="Interação com IA"
                    icon={<Clock />}
                    cardColor={client.color ? `${client.color}10` : undefined}
                  />
                </div>
              </div>
              <div
                style={client.color ? {
                  border: `1px solid ${client.color}22`,
                  borderRadius: 12,
                  background: `${client.color}10 !important`,
                } : {}}
              >
                <ConsumptionChart data={client.monthlyConsumption} cardColor={client.color ? `${client.color}10` : undefined} />
              </div>
            </div>
          </div>
          {/* --- Fim conteúdo da página de Início --- */}

          {/* --- Conteúdo original do Dashboard --- */}
          <div className="space-y-2 pt-12">
            <h1 className="text-3xl font-bold" style={{ color: clientColor }}>
              Dashboard BI
            </h1>
            <p className="text-muted-foreground">
              Análises avançadas e relatórios de consumo integrados
            </p>
          </div>

          {/* Indicador de Integração Futura */}
          <Card style={{ borderColor: cardBorder, background: cardBg }} className="animate-fade-in">
            <CardHeader className="text-center">
              <div className="mx-auto h-12 w-12 rounded-lg flex items-center justify-center mb-4" style={{ background: cardBg }}>
                <BarChart3 className="h-6 w-6" style={{ color: clientColor }} />
              </div>
              <CardTitle className="text-xl" style={{ color: clientColor }}>Dashboard BI em Desenvolvimento</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Esta seção será integrada com ferramentas de Business Intelligence como Looker 
                para fornecer análises avançadas e insights detalhados sobre consumo e performance.
              </p>
              
              <div className="grid gap-4 md:grid-cols-3 mt-6">
                <div className="p-4 rounded-lg border" style={{ borderColor: cardBorder, background: cardBg }}>
                  <BarChart3 className="h-8 w-8 mb-2 mx-auto" style={{ color: clientColor }} />
                  <h3 className="font-medium text-sm" style={{ color: clientColor }}>Relatórios Avançados</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Gráficos interativos e métricas personalizadas
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border" style={{ borderColor: cardBorder, background: cardBg }}>
                  <Building2 className="h-8 w-8 mb-2 mx-auto" style={{ color: clientColor }} />
                  <h3 className="font-medium text-sm" style={{ color: clientColor }}>Análise Multi-Cliente</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Comparativos e benchmarks entre empresas
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border" style={{ borderColor: cardBorder, background: cardBg }}>
                  <FileText className="h-8 w-8 mb-2 mx-auto" style={{ color: clientColor }} />
                  <h3 className="font-medium text-sm" style={{ color: clientColor }}>Exportação</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Relatórios em PDF, Excel e integração via API
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Button style={{ background: clientColor, color: '#fff' }} className="hover:opacity-90">
                  Solicitar Acesso Beta
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview de Features */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="animate-slide-up" style={{ borderColor: cardBorder, background: cardBg }}>
              <CardHeader>
                <CardTitle className="text-lg" style={{ color: clientColor }}>Próximas Funcionalidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full" style={{ background: clientColor }}></div>
                    <span className="text-sm">Dashboards personalizáveis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full" style={{ background: clientColor }}></div>
                    <span className="text-sm">Alertas inteligentes via e-mail/SMS</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full" style={{ background: clientColor }}></div>
                    <span className="text-sm">Previsões de consumo com IA</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full" style={{ background: clientColor }}></div>
                    <span className="text-sm">Integração com Looker/Tableau</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ borderColor: cardBorder, background: cardBg }}>
              <CardHeader>
                <CardTitle className="text-lg" style={{ color: clientColor }}>Suporte Técnico</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Para integração e configuração do Dashboard BI, entre em contato com nossa equipe especializada.
                </p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start" style={{ borderColor: cardBorder, color: clientColor }}>
                    📧 bi@talka.com.br
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" style={{ borderColor: cardBorder, color: clientColor }}>
                    📞 (11) 9999-9999 ramal 200
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}